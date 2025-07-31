module.exports = (req) => {
  const uppercaseBody = {};

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      const value = req.body[key];
      uppercaseBody[key] =
        typeof value === "string" ? value.toUpperCase() : value;
    }
  }

  return uppercaseBody;
};
