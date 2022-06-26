export const simpleShow = (address) => {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
}

export const chainName = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return 'Localnet';
    }
}

export const cryptoBlessingAdreess = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
        default:
            return 'BSC-Mainnet';
    }
}

export const BUSDContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';
        default:
            return 'BSC-Mainnet';
    }
}
