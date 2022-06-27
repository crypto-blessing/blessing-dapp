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
            return '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690';
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
            return '0xc5a5C42992dECbae36851359345FE25997F5C42d';
        default:
            return 'BSC-Mainnet';
    }
}

export const CBTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return '0x67d269191c92Caf3cD7723F116c85e6E9bf55933';
        default:
            return 'BSC-Mainnet';
    }
}
