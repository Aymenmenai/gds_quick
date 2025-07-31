exports.idToData = (id, arr) => {
  let data = "NO";
  // console.log(id, arr);
  arr.map((el) => {
    if (el.id === id) data = el.name;
    // if (arr.indexOf(el+1) === id) data = el.name;
  });
  return data;
};
