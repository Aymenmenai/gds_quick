exports.generateOptions = (data) => {

    // console.log(data)
    const options = [];
  
    if (data.time?.start) {
      options.push(`date[gte]=${data.time.start}`);
    }
    if (data.time?.end) {
      options.push(`date[lte]=${data.time.end}`);
    }
    if (data.range) {
      data.range.forEach((el) => {
        if (el && typeof el === "object" && el.field && el.min && el.max) {
          options.push(`${el.field}[gte]=${el.min}`);
          options.push(`${el.field}[lte]=${el.max}`);
        }
      });
    }
    if (data.select) {
      data.select.forEach((el) => {
        if (el && typeof el === "object" && el.field && el.data && el.data.length) {
          const ids = el.data.map((e) => e.id).join(",");
          options.push(`${el.field}=${ids}`);
        }
      });
    }
  // console.log('[OBJG]',options.length ? "?" + options.join("&") : "")
    return options.length ? "?" + options.join("&") : "";
  };
  