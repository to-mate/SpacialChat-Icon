import { ConfigurationFactory } from "webpack"
import CopyPlugin from "copy-webpack-plugin"

const config: ConfigurationFactory = () => {
  return {
    entry: {
      popup: `${__dirname}/src/popup.ts`,
      content: `${__dirname}/src/content.ts`,
      background: `${__dirname}/src/background.ts`,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "public", to: "." }],
      }),
    ],
  }
}

export default config
