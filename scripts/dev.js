/* eslint-disable node/no-unsupported-features/es-builtins */
const execa = require('execa');

// 2.进行打包 （并行打包）
function build(target) {
    //开启子进程的 使用execa -c表示执行rollup配置，-w代表检测文件变化自动打包 使用环境变量 -env
    execa('rollup --bundleConfigAsCjs', ['-cw', '--environment', `TARGET: ${target}`], {stdio: "inherit"}) //子进程的输出在父包看到
}
build('reactivity');