

export const getProviderUrl = (chainId) => {
    switch (chainId) {
        case 56:
            return 'https://apis.ankr.com/e6fc9c6cc295486dab5eb00d387e968b/807cff1041c516e514318a326153c1f3/binance/full/main';
        case 97:
            return 'https://apis.ankr.com/4ba236862ab54a55b364dcd322cdb412/807cff1041c516e514318a326153c1f3/binance/full/test';
        case 1337:
            return 'http://localhost:8545';
    }
}

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
            return '0x5C8e40ce70273bBFd8a619a0347f15BA33c3E58F';
        case 97:
            return '0x38bbd40b41E95F6Dc7B27F3A727C8A1455fAa623';
        case 1337:
            return '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';
        default:
            return '0xc0CE659216A0EE7B0a9c309BdE2FB42376aD215a';
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
            return '0x218B53FBCc4b128e2FF289d78079174d7E35CF4C';
        case 97:
            return '0xd714e21932BAE2aF5F88793924DCdA76B072fBCC';
        case 1337:
            return '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
        default:
            return '0x218B53FBCc4b128e2FF289d78079174d7E35CF4C';
    }
}

export const CBNFTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0x01ee790155677AAAE3060a09e32491d4C716f908';
        case 97:
            return '0xcf1e0102e08517207D3bb91EcB0a1a073EdFD410';
        case 1337:
            return '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
        default:
            return '0x01ee790155677AAAE3060a09e32491d4C716f908';
    }
}
