import { ValidationError, CrossValidationRule } from './types';
import { regulatoryFrameworks } from './regulatoryFrameworks';

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
  ],
  farmingOperations: [
    {
      fields: ['farmingIncome', 'totalDebt', 'landValue', 'equipmentValue', 'cropInventory'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const income = parseFloat(values.farmingIncome?.replace(/[$,]/g, '') || '0');
        const debt = parseFloat(values.totalDebt?.replace(/[$,]/g, '') || '0');
        const assets = parseFloat(values.landValue?.replace(/[$,]/g, '') || '0') +
                      parseFloat(values.equipmentValue?.replace(/[$,]/g, '') || '0') +
                      parseFloat(values.cropInventory?.replace(/[$,]/g, '') || '0');

        if (debt < regulatoryFrameworks.fdma.thresholds.minDebt) {
          errors.push({
            field: 'debt_threshold',
            type: 'regulatory',
            message: 'Debt amount below FDMA threshold',
            code: 'FDMA_THRESHOLD',
            context: { 
              currentDebt: debt,
              requiredMinimum: regulatoryFrameworks.fdma.thresholds.minDebt
            }
          });
        }

        const debtToAssetRatio = debt / assets;
        if (debtToAssetRatio > 0.75) {
          errors.push({
            field: 'farm_viability',
            type: 'warning',
            message: 'High debt-to-asset ratio may affect farm viability',
            code: 'HIGH_DEBT_RATIO',
            context: { debtToAssetRatio }
          });
        }

        return errors;
      },
      category: 'farmingOperations'
    }
  ],
  pensionRestructuring: [
    {
      fields: ['fundingRatio', 'planAssets', 'planLiabilities', 'employerContributions'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const fundingRatio = parseFloat(values.fundingRatio || '0');
        const assets = parseFloat(values.planAssets?.replace(/[$,]/g, '') || '0');
        const liabilities = parseFloat(values.planLiabilities?.replace(/[$,]/g, '') || '0');
        const contributions = parseFloat(values.employerContributions?.replace(/[$,]/g, '') || '0');

        if (fundingRatio < regulatoryFrameworks.pbsa.requirements.fundingRatio) {
          errors.push({
            field: 'funding_ratio',
            type: 'regulatory',
            message: 'Funding ratio below PBSA requirements',
            code: 'INSUFFICIENT_FUNDING',
            context: { 
              currentRatio: fundingRatio,
              requiredRatio: regulatoryFrameworks.pbsa.requirements.fundingRatio
            }
          });
        }

        if (contributions < regulatoryFrameworks.pbsa.requirements.minimumContribution) {
          errors.push({
            field: 'contributions',
            type: 'error',
            message: 'Employer contributions below required minimum',
            code: 'LOW_CONTRIBUTIONS',
            context: {
              currentContributions: contributions,
              requiredMinimum: regulatoryFrameworks.pbsa.requirements.minimumContribution
            }
          });
        }

        return errors;
      },
      category: 'pensionRestructuring'
    }
  ],
  securitiesRestructuring: [
    {
      fields: ['workingCapital', 'customerAssets', 'segregatedFunds', 'operatingCapital'],
      validate: (values) => {
        const errors: ValidationError[] = [];
        const workingCapital = parseFloat(values.workingCapital?.replace(/[$,]/g, '') || '0');
        const customerAssets = parseFloat(values.customerAssets?.replace(/[$,]/g, '') || '0');
        const segregatedFunds = parseFloat(values.segregatedFunds?.replace(/[$,]/g, '') || '0');
        const operatingCapital = parseFloat(values.operatingCapital?.replace(/[$,]/g, '') || '0');

        if (operatingCapital < regulatoryFrameworks.securities.capitalRequirements.minimumCapital) {
          errors.push({
            field: 'capital_adequacy',
            type: 'regulatory',
            message: 'Operating capital below regulatory minimum',
            code: 'INSUFFICIENT_CAPITAL',
            context: {
              currentCapital: operatingCapital,
              requiredMinimum: regulatoryFrameworks.securities.capitalRequirements.minimumCapital
            }
          });
        }

        if (segregatedFunds < customerAssets) {
          errors.push({
            field: 'asset_segregation',
            type: 'error',
            message: 'Insufficient segregation of customer assets',
            code: 'SEGREGATION_VIOLATION',
            context: {
              segregatedFunds,
              customerAssets,
              shortfall: customerAssets - segregatedFunds
            }
          });
        }

        return errors;
      },
      category: 'securitiesRestructuring'
    }
  ]
};
