const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const process = require('process');

const readline = require('readline/promises').createInterface({
    input: process.stdin,
    output: process.stdout
});


const possibleTasks = `
    help - list all possible tasks
    fs <file path> - file stats
    ls             - files/folders in the current directory,
    touch <filename> - creates a files in the current directory,
    rmFile <filename> - removes a files in the current directory,
    rmdir <dirname> - creates a directory in the current directory,
    unlink <from, to> - renames a file
    mkdir <dirname> - creates a dir
    cat <filename> - read file content,
    cd - change current directory
`
const args = process.argv.slice(2);

if (args.length) {
    parseCommand(args.join(' '))
        .then((log) => console.log(log))
        .then(() => process.exit(1))
        .catch((err) => console.error(err));
} else {
    const hello = 'Welcome to the file manager v0.0.1!';
    console.log(hello);

    readline.on('line', (task) => {
        readline.prompt();
        parseCommand(task).then((log) => {
            console.log(log);
        }).catch((err) => console.error(err));
    });
}


function parseCommand(rawTask) {
    const [task, path] = rawTask.split(' ');
    switch (task) {
        case 'help': {
            return Promise.resolve(possibleTasks);
        }
        case 'fs': {
            return fsPromises.stat(path);
        }
        case 'ls': {
            return fsPromises.readdir(process.cwd()).then((data) => data.join('\n'));
        }
        case 'touch': {
            return fsPromises.writeFile(path, '', { flag: 'w+' });
        }
        case 'rmFile': {
            return fsPromises.rm(path);
        }
        case 'copy': {
            return fsPromises.rm(path);
        }
        case 'unlink': {
            const [_, from, to] = rawTask.split(' ');
            return fsPromises.rename(from, to).then(() => console.log(`successfully renamed from ${from} to ${to}\n`));
        }
        case 'mkdir': {
            return fsPromises.mkdir(path);
        }
        case 'rmdir': {
            const [_, flag] = rawTask.split(' ');
            return fsPromises.rmdir(path, { recursive: flag === '-r' && true });
        }
        case 'cd': {
            try {
                process.chdir(path);
                return Promise.resolve(`cur dir:  ${process.cwd()}`);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        // move to completer in readline
        case 'exit': {
            process.exit(1);
            return;
        }
        default: {
            return Promise.reject('Wrong task');
        }
    }
}