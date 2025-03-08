export function stackPush(val) {
    return (
`
// push ${val}
@${val}
D=A
@SP
A=M
M=D
@SP
M=M+1`);
}

export function stackPushAtAddress(addr) {
    return (
`// push at ${addr}
@${addr}
D=M
@SP
A=M
M=D
@SP
M=M+1`);
}

export function stackPop() {
    return (
`@SP
M=M-1
A=M
D=M`);
}
