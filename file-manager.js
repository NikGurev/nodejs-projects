const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const process = require('process');

const readline = require('readline/promises').createInterface({
    input: process.stdin,
    output: process.stdout
});


const possibleTasks = `
    fs <file path> - file stats
    ls             - files/folders in the current directory
`

function main() {
    readline.question(`What do you want to do?\n ${possibleTasks}`).then(task => {
        parseCommand(task).then((stats) => {
            console.log(stats);
            process.exit(1);
        }).catch((err) => {
            console.error(err);
            process.exit(1);
        });
    });
}

function parseCommand(rawTask) {
    const [task, path] = rawTask.split(' ');
    switch (task) {
        case 'fs': {
            return fsPromises.stat(path);
        }
        case 'ls': {
            return fsPromises.readdir(process.cwd()).then((data) => data.join('\n'));
        }
        default: {
            return Promise.reject('Wrong task');
        }
    }
}

const hello = 'Welcome to the file manager v0.0.1!';
console.log(hello);
main();
