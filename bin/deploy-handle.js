#!/usr/bin/env node
const program = require('commander')
const { spawn } = require('child_process');
let { PromiseProcessHandler } = require('../private/util')

async function executePatchCommand(opts){
    await PromiseProcessHandler(spawn('git', ['checkout','master']))
    await PromiseProcessHandler(spawn('git', ['pull']))
    await PromiseProcessHandler(spawn('git', ['merge','--no-ff',`origin/release/v${opts.oldVersion}`]))
    await PromiseProcessHandler(spawn('git', ['pull']))
    await PromiseProcessHandler(spawn('git', ['push']))
    await PromiseProcessHandler(spawn('git', ['tag','-a',`v${opts.oldVersion}`,'-m',opts.annotation]))
    await PromiseProcessHandler(spawn('git', ['push','origin',`v${opts.oldVersion}`]))
    await PromiseProcessHandler(spawn('git', ['branch',`release/v${opts.newVersion}`]))
    await PromiseProcessHandler(spawn('git', ['push','origin',`release/v${opts.newVersion}:release/v${opts.newVersion}`]))
}


let oldVersion = program.args[0]
let newVersion = program.args[1]
let annotation = program.args[2]

executePatchCommand({
    oldVersion,
    newVersion,
    annotation
})
