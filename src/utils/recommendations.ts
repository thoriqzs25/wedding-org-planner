import { Vendor } from "@/types";

export interface VendorFit {
  vendor: Vendor;
  estimatedTotal: number;
  fitScore: number;
  necessityName: string;
}

export function calculateVendorFit(
  vendor: Vendor,
  guestCount: number,
  totalBudget: number
): { estimatedTotal: number; fitScore: number } {
  const perPersonTotal = vendor.perPerson ? vendor.perPerson * guestCount : 0;
  const estimatedTotal = vendor.budget + perPersonTotal;
  const budgetRatio = estimatedTotal / totalBudget;
  let fitScore = 0;

  if (budgetRatio <= 0.05) fitScore = 100;
  else if (budgetRatio <= 0.1) fitScore = 90;
  else if (budgetRatio <= 0.15) fitScore = 80;
  else if (budgetRatio <= 0.2) fitScore = 70;
  else if (budgetRatio <= 0.3) fitScore = 50;
  else if (budgetRatio <= 0.4) fitScore = 30;
  else fitScore = 10;

  return { estimatedTotal, fitScore };
}

export function getTopRecommendations(
  vendors: { vendor: Vendor; necessityName: string }[],
  guestCount: number,
  totalBudget: number,
  limit = 3
): VendorFit[] {
  return vendors
    .map(({ vendor, necessityName }) => {
      const { estimatedTotal, fitScore } = calculateVendorFit(
        vendor,
        guestCount,
        totalBudget
      );
      return { vendor, estimatedTotal, fitScore, necessityName };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}
