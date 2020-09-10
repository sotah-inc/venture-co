export type CurrencyToTextFormatter = (v: Array<string | null>) => string;

export const currencyToText = (
  amount: number,
  hideCopper?: boolean,
  formatter?: CurrencyToTextFormatter,
): string => {
  if (amount === 0) {
    return "0g";
  }

  if (typeof formatter === "undefined") {
    formatter = formatParams => formatParams.filter(v => v !== null).join(" ");
  }

  const copper = Math.floor(amount % 100);
  amount = amount / 100;
  const silver = Math.floor(amount % 100);
  const gold = Math.floor(amount / 100);

  const copperOutput = copper > 0 ? `${copper.toFixed()}c` : null;
  const silverOutput = silver > 0 ? `${silver.toFixed()}s` : null;
  const goldOutput = (() => {
    if (gold === 0) {
      return null;
    }

    if (gold > 1000 * 1000) {
      return `${Number((gold / 1000 / 1000).toFixed(0)).toLocaleString()}Mg`;
    }

    if (gold > 100 * 1000) {
      return `${Number((gold / 1000).toFixed(0)).toLocaleString()}Kg`;
    }

    return `${Number(gold.toFixed(0)).toLocaleString()}g`;
  })();
  const outputParams = [goldOutput, silverOutput];
  if (typeof hideCopper === "undefined" || !hideCopper) {
    outputParams.push(copperOutput);
  }

  return formatter(outputParams);
};
