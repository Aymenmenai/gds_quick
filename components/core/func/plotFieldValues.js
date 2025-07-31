exports.plotFieldValues = (obj, field) => {
  if (!field.includes(".")) {
    return obj[field];
  } else {
    const nestedFields = field.split("."); // Split the field by dot to handle nested properties
    let value = obj;

    for (let nestedField of nestedFields) {
    //   console.log(nestedField);
      value = value[nestedField] || undefined;
      if (value === undefined) {
        break; // Stop accessing nested properties if any of them is undefined
      }
    }

    // Plot the field value using your preferred plotting library
    // For example, using console.log to display the value
    return value;
  }
};
