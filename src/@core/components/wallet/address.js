

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
            return '0xD0eEbf2f4026F6Ff053bCD57267cdF0BFa55D5e6';
        case 97:
            return '0x680F8833208B931aB5a71317EFB3eFCF83db9589';
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
            return '0x72a90beC83bD96E341E9f842C8290083cCAD9122';
        case 97:
            return '0xa9b9Ff898964d37a5298ed951a65E81187c8b1fB';
        case 1337:
            return '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
        default:
            return '0x218B53FBCc4b128e2FF289d78079174d7E35CF4C';
    }
}

export const CBNFTContractAddress = (chainId) => {
    switch (chainId) {
        case 56:
            return '0x4e3a8078555b71544482414a8aa93B3305b41F27';
        case 97:
            return '0xE811A6702EbAe54D67E47C996D186dBe8eAf477c';
        case 1337:
            return '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
        default:
            return '0x01ee790155677AAAE3060a09e32491d4C716f908';
    }
}
