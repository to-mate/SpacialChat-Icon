import Croppie from "croppie"
import "./popup.css"
import firebase from "firebase/app"
import "firebase/storage"
import "firebase/auth"
import url from "url"


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
}
firebase.initializeApp(firebaseConfig)

firebase.auth().signInAnonymously().catch((err) => {
  console.error(err.message)
})

chrome.tabs.getSelected(tab => {
  if (tab.url) {
    const roomName = url.parse(tab.url, true, true).pathname
    if (roomName) {
      chrome.storage.local.set({roomName: roomName.replace(/^\/s\//, "")})
    }
  }
})

let uploadCrop: Croppie
const imageArea = document.getElementById('croppie')

if (imageArea) {
  uploadCrop = new Croppie(imageArea, {
    viewport: {
      width: 100,
      height: 100,
      type: 'circle'
    },
    boundary: {
      width: 300,
      height: 300
    },
    enableExif: true
  })
}


const uploadButton = document.getElementById('upload')

uploadButton?.addEventListener('change', function () {
  readFile(this as HTMLInputElement)
})


const setIconButton = document.getElementById('setIcon')

setIconButton?.addEventListener('click', () => {
  uploadCrop.result({
    type: 'blob',
    size: 'viewport'
  }).then((resp) => {
  chrome.tabs.executeScript({ file: 'setMyId.js' }, () => {
    chrome.storage.local.get(['initial', 'color' ,'roomName'], (result) => {
      const storageRef = firebase.storage().ref().child(`${result.roomName}/${result.initial + result.color}.png`)
      storageRef.put(resp).then().catch((err) => { console.error(err.message) })
    })
  })
    setIconLocalStorage(resp)
  })
})


const readFile = (input: HTMLInputElement) => {
  const reader = new FileReader();
  reader.onload = (e: Event) => {
    document.getElementById('container')?.classList.add('ready')
    uploadCrop.bind({
      url: (<any>e).target?.result
    })
  }
  reader.readAsDataURL((<any>input.files)[0])
}

const setIconLocalStorage = (icon: Blob) => {
  const reader = new FileReader();
  reader.onload = (e: Event) => {
    chrome.storage.local.set({ icon: (e as any).target.result }, () => {
      chrome.tabs.executeScript({
        file: 'changeIcon.js'
      })
    })
  }
  reader.readAsDataURL(icon)
}
