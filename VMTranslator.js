import fs from "node:fs"
import { ALCMap } from "./ALCTemplates.js";
import { MACMap } from "./MACTemplates.js";
import { ALCList, MACList, BCList, FCList } from "./CommandLists.js";
import { BCMap } from "./BCTemplates.js";

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

        if (c === "\n" || c === "\r" || c === "\t") {
            command = command.trim();
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
    
    command = command.trim();
    if (command.length > 0) {
        commands.push(command);
    }
    
    console.log(commands);

    return commands;
}

function parseCommands(commands) {
    let asmCode = "";

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i].split(" ");



        if (ALCList[command[0]]) {
            asmCode += "// " + commands[i] + "\n" + getArithmeticLogicCommandCode(command[0]) + "\n";
        } else if (MACList[command[0]]) {
            asmCode += "// " + commands[i] + "\n" + getMemoryAccessCommandCode(command) + "\n\n";
        } else if (BCList[command[0]]) {
            // TODO: Branching control logic
            asmCode += "// " + commands[i] + "\n" + getBranchingCommandCode(command) + "\n\n";
        } else if (FCList[command[0]]) {
            // TODO: function command logic
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

function getBranchingCommandCode(command) {
    const f = BCMap[command[0]];

    return f(command[1]);
}
