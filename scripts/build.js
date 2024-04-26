/* eslint-disable node/no-unsupported-features/es-builtins */
// 进行打包 Monorepo
// 1.获取打包文件 文件目录
const fs = require('fs');
const execa = require('execa');
// import execa from "execa";

const dirs = fs.readdirSync('packages').filter(item => {
    return fs.statSync(`packages/${item}`).isDirectory();
})

// 2.进行打包 （并行打包）
function build(target) {
    //开启子进程的 使用execa -c表示执行rollup配置，使用环境变量 -env
    execa('rollup --bundleConfigAsCjs', ['-c', '--environment', `TARGET: ${target}`], {stdio: "inherit"}) //子进程的输出在父包看到
}
async function runParaller(dir, itemFunc) {
    let result = [];
    for(let item of dir) {
        result.push(itemFunc(item));
    }
    return Promise.all(result);
}
runParaller(dirs, build).then(()=>{
    console.log("打包完成");
})
console.log(dirs);