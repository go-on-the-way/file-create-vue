#!/usr/bin/env node
const program = require('commander')
const ora = require('ora')
const { spawn } = require('child_process');
let { PromiseProcessHandler } = require('../private/util')

async function executePatchCommand(opts){
    let lqProcess = ora(`
        此次操作会依次执行如下命令请耐心等待:\n\r
        1、git checkout master\n\r
        2、git pull\n\r
        3、git merge --no-ff origin/release/v${opts.oldVersion}\n\r
        4、git pull\n\r
        5、git push\n\r
        6、git tag -a v${opts.oldVersion} -m ${opts.annotation}\n\r
        7、git push origin v${opts.oldVersion}\n\r
        8、git branch release/v${opts.newVersion}\n\r
        9、git push origin release/v${opts.newVersion}:release/v${opts.newVersion}
    `)
    try {
        lqProcess.start()
        await PromiseProcessHandler(spawn('git', ['checkout','master']))
        await PromiseProcessHandler(spawn('git', ['pull']))
        await PromiseProcessHandler(spawn('git', ['merge','--no-ff',`origin/release/v${opts.oldVersion}`]))
        await PromiseProcessHandler(spawn('git', ['pull']))
        await PromiseProcessHandler(spawn('git', ['push']))
        await PromiseProcessHandler(spawn('git', ['tag','-a',`v${opts.oldVersion}`,'-m',opts.annotation]))
        await PromiseProcessHandler(spawn('git', ['push','origin',`v${opts.oldVersion}`]))
        await PromiseProcessHandler(spawn('git', ['branch',`release/v${opts.newVersion}`]))
        await PromiseProcessHandler(spawn('git', ['push','origin',`release/v${opts.newVersion}:release/v${opts.newVersion}`]))
        lqProcess.succeed()
    } catch (error) {
        console.log(error)
        lqProcess.fail()
    }
}

program.parse(process.argv)
if (program.args.length < 1) return

let oldVersion = program.args[0]
let newVersion = program.args[1]
let annotation = program.args[2]

executePatchCommand({
    oldVersion,
    newVersion,
    annotation
})
