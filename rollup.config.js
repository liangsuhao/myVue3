//通过rollup打包
//1.引入相关依赖
import ts from 'rollup-plugin-typescript2'  //解析ts
import json from '@rollup/plugin-json'  //解析json
import resolvePlugin from '@rollup/plugin-node-resolve'  //解析相关插件
import path from 'path'  //处理路径

//2.获取相关文件路径
let packagesDir = path.resolve(__dirname, 'packages')

//2.1获取到所有包的路径并解析
let packageDir = path.resolve(packagesDir, process.env.TARGET.trim())

//2.2获取到每个包的配置
let resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve('package.json'));
const packageOptions = pkg.buildOptions || {};
let name = path.basename(packageDir);

//3创建一个表
const outputOptions = {
    "esm-bundler": {
        "file": resolve(`dist/${name}.esm-bundler.js`),
        "format": "es"
    },
    "cjs": {
        "file": resolve(`dist/${name}.cjs.js`),
        "format": "cjs"
    },
    "global": {
        "file": resolve(`dist/${name}.global.js`),
        "format": "iife"
    }
}

//4.进行打包的
function createConfig(format, output) {
    output.name = packageOptions.name;
    output.sourcemap = true;
    //生成rollup配置
    return {
        input: resolve("src/index.ts"),
        output,
        plugins: [
            json(),
            ts({ //解析ts
                tsconfig: path.resolve(__dirname, "tsconfig.json"),                
            }),
            resolvePlugin()  //解析第三方插件
        ]
    }
}
export default packageOptions.formats.map(format => createConfig(format, outputOptions[format]));
