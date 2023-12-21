export function calculateVATAmount(productPrice) {
  // Standard VAT rate for the tax year 2022/2023
  const vatRate = 0.12; // 12%

  const vatAmount = parseFloat(productPrice * vatRate).toFixed(2);
  return vatAmount;
}
