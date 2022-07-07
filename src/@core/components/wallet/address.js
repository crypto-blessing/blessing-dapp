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
            return '0x79f6D9076D24EeD88D3711eaBF8Ed67C1F82dAF7';
        case 1337:
            return '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';
        default:
            return 'BSC-Mainnet';
    }

}

export const BUSDContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
        case 97:
            return '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';
        case 1337:
            return '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';
        default:
            return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    }
}

export const CBTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return '0xd714e21932BAE2aF5F88793924DCdA76B072fBCC';
        case 1337:
            return '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
        default:
            return 'BSC-Mainnet';
    }
}

export const CBNFTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return 'BSC-Mainnet';
        case 97:
            return '0xcf1e0102e08517207D3bb91EcB0a1a073EdFD410';
        case 1337:
            return '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
        default:
            return 'BSC-Mainnet';
    }
}
