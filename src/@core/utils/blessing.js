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