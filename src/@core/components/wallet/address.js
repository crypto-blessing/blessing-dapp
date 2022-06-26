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
            return '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
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
            return '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        default:
            return 'BSC-Mainnet';
    }
}
