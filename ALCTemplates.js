const getAdd = () => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D+M
@SP
M=M+1
`;

const getSub = () => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=M-D
@SP
M=M+1
`;

const getNeg = () => 
`@SP
M=M-1
A=M
M=-M
@SP
M=M+1
`;

const getEq = (n) => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
D=M-D
@EQ_${n}
D;JEQ
@SP
A=M
M=0
@END_EQ_${n}
0;JMP
(EQ_${n})
  @SP
  A=M
  M=-1
  @END_EQ_${n}
  0;JMP
(END_EQ_${n})
  @SP
  M=M+1
`;


const getGt = (n) => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
D=M-D
@GT_${n}
D;JGT
@SP
A=M
M=0
@END_GT_${n}
0;JMP
(GT_${n})
  @SP
  A=M
  M=-1
@END_GT_${n}
  0;JMP
(END_GT_${n})
  @SP
  M=M+1
`;

const getLt = (n) => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
D=M-D
@LT_${n}
D;JLT
@SP
A=M
M=0
@END_LT_${n}
0;JMP
(LT_${n})
  @SP
  A=M
  M=-1
  @END_LT_${n}
  0;JMP
(END_LT_${n})
  @SP
  M=M+1
`;

const getAnd = () => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D&M
@SP
M=M+1
`;


const getOr = () => 
`@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D|M
@SP
M=M+1
`;

const getNot = () => 
`@SP
M=M-1
A=M
M=!M
@SP
M=M+1
`;

export const ALCMap = {
    "add": getAdd,
    "sub": getSub,
    "neg": getNeg,
    "eq" : getEq,
    "gt" : getGt,
    "lt" : getLt,
    "and": getAnd,
    "or" : getOr,
    "not": getNot,
};


