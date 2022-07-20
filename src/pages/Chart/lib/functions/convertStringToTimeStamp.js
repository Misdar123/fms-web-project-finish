export const contvertStringToTimestamp = (strDate) => {
  const dt = Date.parse(strDate);
  const convertToSecond = dt / 1000;
  return convertToSecond;
};
