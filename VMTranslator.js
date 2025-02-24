import fs from "node:fs"
import { ALCMap } from "./ALCTemplates.js";
import { MACMap } from "./MACTemplates.js";

let eqC = 0;
let gtC = 0;
let ltC = 0;


function main() {
    console.log(`Reading from ${process.argv[2]}`);
    const file = fs.readFileSync(process.argv[2], "utf-8");

    const commands = getCommands(file);
    
    const asmCode = parseCommands(commands);

    const dest = getFilePath();

    fs.writeFileSync(dest + ".asm", asmCode);

}

main();

export function getFileName() {
    const path = process.argv[2].split('/')
    return path[path.length-1].slice(0, -3);
}

function getFilePath() {
    return process.argv[2].slice(0, -3);
}

function getCommands(file) {
    const commands = [];

    let command = "";
    let ignore = false;

    for (let i = 0; i < file.length; i++) {
        const c = file[i];

        if (c === "\n" || c === "\r") {
            if (command.length > 0) {
                commands.push(command);
            }

            ignore = false;
            command = "";
        } else if (c === "/") {
            ignore = true;
        } else if (ignore === false) {
            command += c;
        }
    }

    if (command.length > 0) {
        commands.push(command);
    }

    return commands;
}

function parseCommands(commands) {
    let asmCode = "";

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i].split(" ");

        if (command.length === 1) {
            asmCode += "// " + commands[i] + "\n" + getArithmeticLogicCommandCode(command[0]);
        } else if (command.length === 3) {
            asmCode += "// " + commands[i] + "\n" + getMemoryAccessCommandCode(command);
        }
    }

    return asmCode;
}


function getArithmeticLogicCommandCode(command) {
    const f = ALCMap[command];

    let str;
    if (command === "eq") {
        str = f(eqC);
        eqC+=1;
    } else if (command === "gt") {
        str = f(gtC);
        gtC+=1;
    } else if (command === "lt") {
        str = f(ltC);
        ltC+=1;
    } else {
        str = f();
    }

    return str;
}

function getMemoryAccessCommandCode(command) {
    return MACMap[command[0]][command[1]](command[2]);
}

