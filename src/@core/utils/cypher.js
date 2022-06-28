export const encode = (str) => {
    return Buffer.from(str).toString('base64')
}

export const decode = (str) => {
    return Buffer.from(str, 'base64').toString('utf8')
}