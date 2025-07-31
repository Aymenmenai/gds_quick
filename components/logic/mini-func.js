// THIS FUNCTION FOR TO MAKE OBJECT FOR SELECT ELEMENT
export const defaultSelectFunc = (obj, field) => {
  return {
    name: obj[`${field}`.replace("Id", "")]?.name || "",
    id: obj[field] || "",
  };
};

// THIS FUNCTION TO FORMAT DATE FOR THE DATABASE
export const formatDate = (date) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// render time
const dateFormattingOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export const renderDate = (checkTimeAndDate) => {
  if (!checkTimeAndDate) {
    return "";
  }
  return new Date(checkTimeAndDate).toLocaleDateString(
    "en-GB",
    dateFormattingOptions
  );
};

// CHEECK IF THE VALUE EXIST
export const ifExist = (value) => {
  if (value != undefined) {
    return value;
  }
  return "";
};

// CURRENCY
export const currencyFormatter = new Intl.NumberFormat("de-DZ", {
  style: "currency",
  currency: "DZD",
  minimumFractionDigits: 4,
});
// REMOVE UNNECESSARY ZEROS
export const removeExtraZeros = (formattedString) => {
  if (!formattedString) return ""; // Handle empty or undefined input gracefully

  const [firstPart, secondPartWithDZD] = formattedString.split(",");
  const secondPart = secondPartWithDZD?.split(" ")[0]; // Extract the decimal part without "DZD"

  if (!secondPart || parseInt(secondPart) === 0) {
    // If there's no decimal part or it's all zeros, return with "00"
    return `${firstPart},00 DA`;
  }

  // Remove trailing zeros from the decimal part
  const trimmedSecondPart = secondPart.replace(/0+$/, "");

  return `${firstPart},${trimmedSecondPart}`;
};


// TOTAL PRICE
export const calculateTotalPrice = (articles) => {
  if (articles) {
    return articles.reduce(
      (total, article) =>
        total + article.price * article.quantity * (1 + (article.tax || 0)),
      0
    );
  } else {
    return 0;
  }
};

export const calculateTotalPriceSortie = (articles) => {
  if (articles) {
    return articles.reduce(
      (total, article) =>
        total + article.price * article.currQuantity * (1 + (article.tax || 0)),
      0
    );
  } else {
    return 0;
  }
};

export const inputDataInObj = (obj, index, value) => {
  let newObj = { ...obj };
  newObj[index] = value;
  return newObj;
};

// DATE FOR FILTER
export const dataForFilter = (date) => {
  let value = new Date(date);
  const ready = `${value.getFullYear()}-${(value.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${value.getDate().toString().padStart(2, "0")}`;
  return ready;
};

// SEACH ELEMENT IN ARRAY
export const findValueByName = (array, nameToFind) => {
  const resultArray = array.filter((obj) => obj.name === nameToFind);
  return resultArray[0];
};

export function compareObjects(obj1, obj2) {
  const diff = {};
  // console.log(obj1, obj2);
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj2.hasOwnProperty(key)) {
        if (obj1[key] !== obj2[key]) {
          diff[key] = obj2[key];
        }
      } else {
        diff[key] = undefined;
      }
    }
  }

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      diff[key] = obj2[key];
    }
  }

  return diff;
}

// REMOVE UNDEFIND
export function removeUndefinedValues(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}
