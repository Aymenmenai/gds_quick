module.exports = (originalObj, newObj) => {
  const changedValues = {};

  for (const key in originalObj) {
    if (originalObj.hasOwnProperty(key) && newObj.hasOwnProperty(key)) {
      const originalValue = originalObj[key];
      const newValue = newObj[key];

      if (originalValue !== newValue) {
        changedValues[key] = newValue;
      }
    }
  }

  // console.log(changedValues)
  return changedValues;
};
