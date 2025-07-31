module.exports = (obj, ...forbidden) => {
    let clean = {};
    Object.keys(obj).forEach(el => {
        if (!forbidden.includes(el)) {
            // Check if the value is a string and convert it to uppercase
            clean[el] = typeof obj[el] === 'string' ? obj[el].toUpperCase() : obj[el];
        }
    });
    return clean;
};