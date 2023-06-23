function existInDict(dictObj, key) {
    let result = false;
    Object.keys(dictObj).forEach(keyName => {
        if (keyName === key) {
            result = true;
        }
    })
    return result;
}



export {
    existInDict,
};