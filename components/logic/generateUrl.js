const rex = (val) => {
  let newRex = val;
  if (!val.endsWith("?")) {
    newRex = newRex + "&";
  }
  return newRex;
};

exports.Urlgenerator = (extension, data) => {
  let finalQuery = "?";
  // TIME EXPRESSION
  if (data.time.start) {
    // DATE  => DATE[GTE] = 2023-04-01 & DATE[LTE] = 2023-04-30
    let ex = rex(finalQuery);
    let start = new Date(data.time.start);
    finalQuery =
      ex +
      `date[gte]=${start.getFullYear()}-${(start.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${start.getDate().toString().padStart(2, "0")}`;
  }
  if (data.time.end) {
    let ex = rex(finalQuery);
    let end = new Date(data.time.end);
    finalQuery =
      ex +
      `date[lte]=${end.getFullYear()}-${(end.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${end.getDate().toString().padStart(2, "0")}`;
  }

  // RANGING EXPRESSION
  if (data.range) {
    data.range.forEach((el) => {
      if (el.min || el.max) {
        let ex = rex(finalQuery);
        if (el.min && el.max) {
          finalQuery =
            ex + `${el.field}[gte]=${el.min}&${el.field}[lte]=${el.max}`;
        } else if (el.min) {
          finalQuery = ex + `${el.field}[gte]=${el.min}`;
        } else if (el.max) {
          finalQuery = ex + `${el.field}[lte]=${el.max}`;
        }
      }
    });
  }

  // SELECT EXPRESSION
  if (data.select) {
    data.select.forEach((el) => {
      if (el.data && el.data.length != 0) {
        let ids = [];
        el.data.forEach((e) => {
          ids.push(e.id);
        });
        let ex = rex(finalQuery);
        finalQuery = ex + `${el.field}=` + ids.join(",");
      }
    });
  }

  // FILTER CATEGORY
  // FILTER UNIT =1,2,3 & CATEGORY=2,3 & REFERENCE = 1

  // console.log(`/api/v1/${extension}/all${finalQuery}`);
  return `/api/v1/${extension}/all${finalQuery}`;
};
