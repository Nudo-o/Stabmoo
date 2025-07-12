import path from "path"
import { fileURLToPath } from "url"
import TerserWebpackPlugin  from "terser-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    mode: "production",
    target: [ "web", "es5" ],
    entry: "./public/client/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public", "dist/js"),
        clean: true
    },
    devServer: {
        port: 4000,
        open: true,
        hot: true,
        watchFiles: [ "public/*.html", "src/*.*" ]
    },
    optimization: {
        minimizer: [ new TerserWebpackPlugin() ]
    }
}