const fs = require('fs');
const path = require('path');
const process = require('process');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


const possibleTasks = `
    fs <file path> - file stats
`

function main() {
    readline.question(`What do you want to do?\n ${possibleTasks}`, task => {
        middleware(task, (stats) => {
            console.log(stats);
        });
    });
}

function middleware(rawTask, cb) {
    const [task, path] = rawTask.split(' ');
    switch (task) {
        case 'fs': {
            return fs.stat(path, (err, stats) => {
                if (err) {
                    console.error(err);
                    return;
                }
                cb(stats);
            });
        }
        default: {
            console.error('Wrong task');
        }
    }
}

const hello = 'Welcome to the file manager v0.0.1!';
console.log(hello);
main();
