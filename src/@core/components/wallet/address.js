export const simpleShow = (address) => {
    if (address != undefined && address.length === 42) {
        return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
    }
    
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
            return '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
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

export const CBTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return 'BSC-Testnet';
        case 1337:
            return '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
        default:
            return 'BSC-Mainnet';
    }
}
