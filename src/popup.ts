import Croppie from "croppie"
import "./popup.css"

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
  readFile(<HTMLInputElement>this)
})


const setIconButton = document.getElementById('setIcon')

setIconButton?.addEventListener('click', () => {
  uploadCrop.result({
    type: 'blob',
    size: 'viewport'
  }).then()
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



