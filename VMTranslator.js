import fs from "node:fs"
import { ALCMap } from "./ALCTemplates.js";
import { MACMap } from "./MACTemplates.js";
import { ALCList, MACList, BCList, FCList } from "./CommandLists.js";
import { BCMap } from "./BCTemplates.js";
import { FCMap, getCall } from "./FCTemplates.js";
import { count } from "node:console";

let eqC = 0;
let gtC = 0;
let ltC = 0;

export const stack = ["OS"];
export let curFile = "";

export const functionReturnHash = {};

function main() {
    const path = process.argv[2];
    const ext = path.slice(-3, path.length);

    const asmCode = (ext === ".vm") ? parseFile(path) : parseDir(path);

    const dest = getDest(ext);
    
    console.log("Dest: " + dest + ".asm");

    fs.writeFileSync(dest + ".asm", asmCode);

}

main();

function parseFile(path) {
    console.log(`Reading from ${path}`);
    const file = fs.readFileSync(path, "utf-8");

    const pathArr = path.split("/");
    const name = pathArr[pathArr.length-1];
    curFile = name;

    const commands = getCommands(file);
   
    updateFunctionReturnHash(commands);

    const asmCode = parseCommands(commands);

    return asmCode;
}

function updateFunctionReturnHash(commands) {
    let name = "";
    let count = 0;

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i].split(" ");
    
        if (command[0] === "function") {
            if (name !== "") {
                functionReturnHash[name] = count;
            }
            name = command[1];
            count = 0;
        } else if (command[0] === "return") {
            count++;
        }
    }

    if (name !== "") {
        functionReturnHash[name] = count;
    }
}

function parseDir(path) {
    const files = fs.readdirSync(path);
    
    let asmCode = getDirSetup() + "\n\n //Sys.vm \n\n" + parseFile(path + "Sys.vm");

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.slice(-3, file.length) === ".vm" && file.slice(-6, file.length) !== "Sys.vm") {
            asmCode += "\n\n" + "//" + path + file + "\n" + parseFile(path + file);
        }
    }

    return asmCode; 
}

function getDirSetup() {
    return (`@256\nD=A\n@SP\nM=D` + "\n" + getCall(["call", "Sys.init", "0"]));
}

function getDest(ext) {
    if (ext === ".vm") {
        return process.argv[2].slice(0, -3);
    } else {
        const pathArr = process.argv[2].split("/");

        return process.argv[2] + pathArr[pathArr.length-2];
    }
    
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
            asmCode += "//" + commands[i] + "\n" + getFunctionCommandCode(command) + "\n\n";
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

function getFunctionCommandCode(command) {
    const f = FCMap[command[0]];

    return f(command);
}
