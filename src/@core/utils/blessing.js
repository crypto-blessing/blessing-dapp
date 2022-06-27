import { ethers } from 'ethers';

export const getBlessingTitle = (description) => {
    return description.split('#')[0]
}

export const getBlessingDesc = (description, omit = false) => {
    const apadteLength = 40
    let desc = description.split('#')[1]
    if (omit && desc.length > apadteLength) {
        return desc.substring(0, apadteLength) + '...'
    }

    return desc
}

export const transBlesingsFromWalletBlessings = (blessings) => {
    let newBlessings = []
    blessings.forEach(blessing => {
        newBlessings.push({
            code: blessing.blessingID,
            blessing: blessing.blessingImage,
            time: (new Date(parseInt(blessing.sendTimestamp.toString())*1000)).toUTCString(),
            amount: ethers.utils.formatEther(blessing.tokenAmount),
            quantity: blessing.claimQuantity.toString(),
            type: blessing.claimType === 0 ? 'AVERAGE' : 'RANDOM',
            progress: blessing.progress
        })
    })

    return newBlessings.reverse()
}