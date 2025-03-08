import { stackPush, stackPushAtAddress, stackPop } from "./mainStackCommands.js";
import { curFile, functionReturnHash, stack } from "./VMTranslator.js";

const functionCallHash = {};

export function getCall(command) {
    const hashIndex = functionCallHash[command[1]]
    const retIndex = (hashIndex !== undefined) ? hashIndex : 0;

    const retAddr = `${curFile}.${stack[stack.length-1]}$ret.${retIndex}`;

    functionCallHash[command[1]] = retIndex + 1;
    stack.push(command[1]);

    return (
        stackPush(retAddr) + "\n" +
        stackPushAtAddress("LCL")   + "\n" +
        stackPushAtAddress("ARG")   + "\n" +
        stackPushAtAddress("THIS")  + "\n" +
        stackPushAtAddress("THAT")  + "\n" +
`// Set ARG
@SP
D=M
@5
D=D-A
@${command[2]}
D=D-A
@ARG
M=D

// Set LCL
@SP
D=M
@LCL
M=D

// Goto function
@${command[1]}
0;JMP
(${retAddr})`);

}

function getFunction(command) {
    let asmCode = `(${command[1]})\n`;
    
    for (let i = 0; i < command[2]; i++) {
        asmCode += "\n" + stackPush(0);
    }

    return asmCode;
}

const saveEndFrameNeg1 = (dest) => (
`@endFrame
M=M-1
A=M
D=M
@${dest}
M=D`);

function getReturn() {
    if (functionReturnHash[stack[stack.length-1]] === 0) {
        stack.pop();    
    } else {
        functionReturnHash[stack[stack.length-1]]--;
    }

    return (
`@LCL
D=M
@endFrame
M=D

// calc retAddr
@5
D=A
@endFrame
D=M-D
A=D
D=M
@retAddr
M=D` +
"\n" + stackPop() + 
"\n" + 
`@ARG
A=M
M=D

@ARG
D=M+1
@SP
M=D` + 
"\n" + saveEndFrameNeg1("THAT") +
"\n" + saveEndFrameNeg1("THIS") +
"\n" + saveEndFrameNeg1("ARG")  +
"\n" + saveEndFrameNeg1("LCL")  +
"\n" + `@retAddr
A=M
0;JMP`);
}

export const FCMap = {
    "call": getCall,
    "function": getFunction,
    "return": getReturn 
};
