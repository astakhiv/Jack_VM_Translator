import { curFile, stack } from "./VMTranslator.js";

function getLable(name) {
    return `(${curFile}.${stack[stack.length-1]}$${name})`;
}

function getGoto(name) {
    return `@${curFile}.${stack[stack.length-1]}$${name}\n0;JMP`;
}

function getIfGoto(name) {
    return (
`@SP
M=M-1
A=M
D=M
@${curFile}.${stack[stack.length-1]}$${name}
D;JNE`);
}

export const BCMap = {
    "label"  : getLable, 
    "goto"   : getGoto, 
    "if-goto": getIfGoto, 
};
