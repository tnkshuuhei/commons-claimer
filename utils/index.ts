export const TOKEN_ADDRESS = "0x7b97031b6297bc8e030B07Bd84Ce92FEa1B00c3e";
export const SCHEMA_UID =
  "0xa1215b03d4956c2e07792ccc30da1b48742a2c6dde9b12d2c97d5b16cf8263b8";
// on celo https://celo.easscan.org/schema/view/0xa1215b03d4956c2e07792ccc30da1b48742a2c6dde9b12d2c97d5b16cf8263b8

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const formatTokenAmount = (
  amount: any,
  decimals: number,
  displayDecimals = 2
) => {
  if (!amount) return "0";
  const divisor = BigInt(10 ** decimals);
  const beforeDecimal = BigInt(amount) / divisor;
  const afterDecimal = BigInt(amount) % divisor;
  const afterDecimalStr = afterDecimal.toString().padStart(decimals, "0");
  const result = `${beforeDecimal}.${afterDecimalStr.slice(
    0,
    displayDecimals
  )}`;
  return parseFloat(result).toFixed(displayDecimals);
};
