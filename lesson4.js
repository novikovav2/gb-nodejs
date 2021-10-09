const fs = require('fs')
const yargs = require('yargs')
const inquirer = require('inquirer');
const path = require('path');
const readline = require('readline')

const options = yargs
    .usage('Usage: -p <path> to directory')
    .options('p', {
        alias: 'path',
        describe: 'Path to directory',
        type: 'string',
        demandOption: false
    })
    .options('s', {
        alias: 'subString',
        describe: 'Substring for filter',
        type: 'string',
        demandOption: false
    })
    .argv

const dirPath = options.path || process.cwd()
const subString = options.subString || ''

const isFile = (fileName) => fs.lstatSync(fileName).isFile();

const fileRead = (fileName) => {
    const readStream = fs.createReadStream(fileName, 'utf8')
    const rl = readline.createInterface({
        input: readStream,
        terminal: true
    });

    rl.on('line', (line) => {
        if (line.includes(subString)) {
            console.log(line)
        }
    })
}

const dirRead = (dirPath) => {
    console.clear()
    console.log('Your current location: ', dirPath)
    let list = ['/..', ...fs.readdirSync(dirPath)]
    inquirer.prompt([
        {
            name: 'objectName',
            type: 'list',
            message: 'Please select an object',
            choices: list
        }
    ])
        .then(answer => answer.objectName)
        .then(objectName => {
            const objectFullPath = path.join(dirPath, objectName)
            isFile(objectFullPath) ?  fileRead(objectFullPath) : dirRead(objectFullPath)
        })
}

dirRead(dirPath)
