
export interface PricingInputs {
  productCost: number;
  packagingCost: number;
  deliveryCost: number;
  lossRate: number;
  taxes: number;
  gatewayFee: number;
  fixedExpenses: number;
  averageRevenue: number;
  investmentMargin: number;
  profitMargin: number;
}

export interface CalculationResults {
  merchandiseCost: number;
  variableCostPercent: number;
  fixedCostPercent: number;
  markup: number;
  finalPrice: number;
  profitAmount: number;
  breakEvenPrice: number;
  totalMarginsPercent: number;
}
