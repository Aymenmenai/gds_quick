module.exports= (Obj, ...noneallowedfields) => {
    let newObj = {};
    Object.keys(Obj).forEach(el => {
        if (noneallowedfields.includes(el)===false) {newObj[el] = Obj[el]};
    });
    // console.log(newObj)
    return newObj;
};