module.exports = (length) => {
  // console.log(length);
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 4) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  // console.log("RL-" + ("0000000" + length).slice(-6) + result);
  return "RL-" + ("000000000" + length).slice(-6) + result;
};
