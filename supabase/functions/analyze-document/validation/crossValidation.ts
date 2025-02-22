
import { ValidationError, CrossValidationRule } from './types';

export const crossValidationScenarios: Record<string, CrossValidationRule[]> = {
  bankruptcy: [
    {
      fields: ['totalAssets', 'totalLiabilities', 'monthlyIncome', 'monthlyExpenses'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const assets = parseFloat(values.totalAssets?.replace(/[$,]/g, '') || '0');
        const liabilities = parseFloat(values.totalLiabilities?.replace(/[$,]/g, '') || '0');
        const monthlyIncome = parseFloat(values.monthlyIncome?.replace(/[$,]/g, '') || '0');
        const monthlyExpenses = parseFloat(values.monthlyExpenses?.replace(/[$,]/g, '') || '0');
        
        if (assets > liabilities * 1.2) {
          errors.push({
            field: 'solvency',
            type: 'warning',
            message: 'Assets significantly exceed liabilities',
            code: 'SOLVENCY_CHECK',
            context: { assets, liabilities, ratio: assets / liabilities }
          });
        }

        const surplusRatio = (monthlyIncome - monthlyExpenses) / monthlyExpenses;
        if (surplusRatio > 0.3) {
          errors.push({
            field: 'income_surplus',
            type: 'warning',
            message: 'Significant monthly surplus detected',
            code: 'SURPLUS_CHECK',
            context: { surplus: monthlyIncome - monthlyExpenses, ratio: surplusRatio }
          });
        }

        return errors;
      },
      category: 'bankruptcy'
    }
  ],
  proposal: [
    {
      fields: ['proposalAmount', 'totalDebt', 'monthlyPayment', 'proposalTerm', 'securedDebt'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const proposalAmount = parseFloat(values.proposalAmount?.replace(/[$,]/g, '') || '0');
        const totalDebt = parseFloat(values.totalDebt?.replace(/[$,]/g, '') || '0');
        const securedDebt = parseFloat(values.securedDebt?.replace(/[$,]/g, '') || '0');
        const monthlyPayment = parseFloat(values.monthlyPayment?.replace(/[$,]/g, '') || '0');
        const term = parseInt(values.proposalTerm || '0');

        const unsecuredDebt = totalDebt - securedDebt;
        if (proposalAmount < unsecuredDebt * 0.3) {
          errors.push({
            field: 'proposal_viability',
            type: 'warning',
            message: 'Proposal amount may be too low for unsecured creditors',
            code: 'LOW_PROPOSAL_RATIO',
            context: { 
              proposalAmount, 
              unsecuredDebt,
              recommendedMinimum: unsecuredDebt * 0.3 
            }
          });
        }

        const totalPayments = monthlyPayment * term;
        if (totalPayments < proposalAmount) {
          errors.push({
            field: 'payment_schedule',
            type: 'error',
            message: 'Payment schedule insufficient to meet proposal amount',
            code: 'INSUFFICIENT_PAYMENTS',
            context: { 
              totalPayments,
              proposalAmount,
              shortfall: proposalAmount - totalPayments 
            }
          });
        }

        return errors;
      },
      category: 'proposal'
    }
  ],
  corporateRestructuring: [
    {
      fields: ['operatingCash', 'projectedRevenue', 'currentLiabilities', 'restructuringCosts'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const cash = parseFloat(values.operatingCash?.replace(/[$,]/g, '') || '0');
        const revenue = parseFloat(values.projectedRevenue?.replace(/[$,]/g, '') || '0');
        const liabilities = parseFloat(values.currentLiabilities?.replace(/[$,]/g, '') || '0');
        const costs = parseFloat(values.restructuringCosts?.replace(/[$,]/g, '') || '0');

        if (cash < costs * 1.5) {
          errors.push({
            field: 'cash_adequacy',
            type: 'warning',
            message: 'Operating cash may be insufficient for restructuring',
            code: 'INSUFFICIENT_CASH',
            context: { 
              cash,
              costs,
              recommendedBuffer: costs * 1.5 
            }
          });
        }

        if (revenue < liabilities * 1.2) {
          errors.push({
            field: 'revenue_projection',
            type: 'warning',
            message: 'Projected revenue may be insufficient to service liabilities',
            code: 'LOW_REVENUE_PROJECTION',
            context: { 
              revenue,
              liabilities,
              recommendedRatio: 1.2 
            }
          });
        }

        return errors;
      },
      category: 'corporateRestructuring'
    }
  ]
};
