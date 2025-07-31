const dateFormattingOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export default function renderDate(checkTimeAndDate) {
  if (!checkTimeAndDate) {
    return "";
  }
  return new Date(checkTimeAndDate).toLocaleDateString(
    "en-GB",
    dateFormattingOptions
  );
}
