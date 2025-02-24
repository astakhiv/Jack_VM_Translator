import { getFileName } from "./VMTranslator.js";

const writeToStack = 
`
@SP
A=M
M=D
@SP
M=M+1
`;

// Push commands
const getPushTemplate = (i, name) => 
`@${i}
D=A
@${name}
D=D+M
A=D
D=M` + writeToStack;

const getPushConstant = (i) => `@${i}\nD=A` + writeToStack;

const getPushStatic = (i) => {
    const name = `${getFileName()}.${i}`;

    return (`@${name}\nD=M` + writeToStack);
};

const getPushPointer = (i) => {
    const param = (i === '0') ? "THIS" : "THAT";
    return (
    `@${param}
    D=M` + writeToStack
    );
}

const getPushTemp = (i) => 
`@${i}
D=A
@5
D=D+A
A=D
D=M` + writeToStack;

///////////////////
//               //
// Pop commands  //
//               //
///////////////////

const getPopTemplate = (i, name) => 
`@${i}
D=A
@${name}
M=D+M
@SP
M=M-1
A=M
D=M
@${name}
A=M
M=D
@${i}
D=A
@${name}
M=M-D
`;

const getPopStatic = (i) => {
    const name = `${getFileName()}.${i}`;

    return (
`@SP
M=M-1
A=M
D=M
@${name}
M=D
`
);
};


const getPopPointer = (i) => {
    const param = (i === '0') ? "THIS" : "THAT";
    console.log("i:", i, "param:", param);
    return (
    `@SP
    M=M-1
    A=M
    D=M
    @${param}
    M=D
    `);
};

const getPopTemp = (i) => 
`@${i}
D=A
@temp_index
M=D
@5
D=A
@temp_index
M=M+D
@SP
M=M-1
A=M
D=M
@temp_index
A=M
M=D
`;

export const MACMap = {
    "push": {
        "local"    : (i) => getPushTemplate(i, "LCL"),
        "argument" : (i) => getPushTemplate(i, "ARG"),
        "this"     : (i) => getPushTemplate(i, "THIS"),
        "that"     : (i) => getPushTemplate(i, "THAT"),
        "constant" : getPushConstant,
        "static"   : getPushStatic,
        "pointer"  : getPushPointer,
        "temp"     : getPushTemp,
    },
    
    "pop" : {
        "local"    : (i) => getPopTemplate(i, "LCL"),
        "argument" : (i) => getPopTemplate(i, "ARG"),
        "this"     : (i) => getPopTemplate(i, "THIS"),
        "that"     : (i) => getPopTemplate(i, "THAT"),
        "static"   : getPopStatic,
        "pointer"  : getPopPointer,
        "temp"     : getPopTemp,
    } 
};


