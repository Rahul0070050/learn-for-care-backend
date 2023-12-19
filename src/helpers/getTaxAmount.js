export function calculateVATAmount(productPrice) {
  // Standard VAT rate for the tax year 2022/2023
  const vatRate = 0.2; // 20%

  const vatAmount = parseFloat(productPrice * vatRate).toFixed(2);
  return vatAmount;
}
