const MAX_HEX_COLOR = 16777215;

const decimalValueOfString = str => {
  let decValue = '';
  for (let i = 0; i < str.length; i++) {
    decValue += str[i].charCodeAt(0);
  }
  return parseInt(decValue, 10);
};

const toHex = dec => dec.toString(16);

export const hexColorFromString = (strVal, maxVal, minVal = '\0') => {
  const minDecimal = decimalValueOfString(minVal);
  const decimalShiftedToZero = decimalValueOfString(strVal) - minDecimal;
  const maxDecimalShiftedToZero = decimalValueOfString(maxVal) - minDecimal;

  return toHex(
    Math.round(
      (decimalShiftedToZero * MAX_HEX_COLOR) / maxDecimalShiftedToZero,
    ),
  ).padEnd(6, '0');
};
