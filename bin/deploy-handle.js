#!/usr/bin/env node
const program = require('commander')
const ora = require('ora')
const { spawn } = require('child_process');
let { PromiseProcessHandler } = require('../private/util')

async function executePatchCommand(opts){
    let spinner = ora(`处理中....`).start()
    
    
    spinner.text = 'git checkout master'
    await PromiseProcessHandler(spawn('git', ['checkout','master'])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git pull`
    await PromiseProcessHandler(spawn('git', ['pull'])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git merge --no-ff origin/release/v${opts.oldVersion}`
    await PromiseProcessHandler(spawn('git', ['merge','--no-ff',`origin/release/v${opts.oldVersion}`])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git pull`
    await PromiseProcessHandler(spawn('git', ['pull'])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git push`
    await PromiseProcessHandler(spawn('git', ['push'])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git tag -a v${opts.oldVersion} -m ${opts.annotation}`
    await PromiseProcessHandler(spawn('git', ['tag','-a',`v${opts.oldVersion}`,'-m',`${opts.annotation}`])).catch((error)=>{
        spinner.fail(spinner.text+'\n\r'+error)
    })

    spinner.text = `git push origin v${opts.oldVersion}`
    await PromiseProcessHandler(spawn('git', ['push','origin',`v${opts.oldVersion}`])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git branch release/v${opts.newVersion}`
    await PromiseProcessHandler(spawn('git', ['branch',`release/v${opts.newVersion}`])).catch(()=>{
        spinner.fail(spinner.text)
    })

    spinner.text = `git push origin release/v${opts.newVersion}:release/v${opts.newVersion}`
    await PromiseProcessHandler(spawn('git', ['push','origin',`release/v${opts.newVersion}:release/v${opts.newVersion}`])).catch(()=>{
        spinner.fail(spinner.text)
    })
    spinner.succeed()
    
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
