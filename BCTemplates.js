function getLable(name) {
    return `(${name})`;
}

function getGoto(name) {
    return `@${name}\n0;JMP`;
}

function getIfGoto(name) {
    return (
`@SP
D=M-1
A=M
D=M
@${name}
D;JEQ`);
}

export const BCMap = {
    "label"  : getLable, 
    "goto"   : getGoto, 
    "if-goto": getIfGoto, 
};
