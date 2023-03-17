const getPrice = (price: number, currency: string) => {
  const priceData = price / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency.toUpperCase() }).format(
      priceData,
  ).replace(/\D00(?=\D*$)/, '')
}

export {
  getPrice
}