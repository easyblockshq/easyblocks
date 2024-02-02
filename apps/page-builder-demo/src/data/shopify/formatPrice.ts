import { ShopifyPrice } from "./types";

export const formatPrice = (price: ShopifyPrice) => {
  let _amount = price.amount.replace(".0", ".00");

  if (price.currencyCode === "USD") {
    return `$${_amount}`;
  }

  if (price.currencyCode === "EUR") {
    return `€${_amount}`;
  }

  if (price.currencyCode === "PLN") {
    return `${_amount}zł`;
  }

  if (price.currencyCode === "GBP") {
    return `£${_amount}`;
  }

  return `${price.currencyCode}${_amount}`;
};
