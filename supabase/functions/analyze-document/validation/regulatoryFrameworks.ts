
export const regulatoryFrameworks = {
  bia: {
    debtThresholds: {
      personal: 1000,
      corporate: 5000,
      farming: 25000
    },
    timeframes: {
      stayPeriod: 30,
      creditorsNotice: 21,
      dischargeWait: {
        firstTime: 9,
        secondTime: 24,
        thirdTime: 36
      }
    },
    documentationRequirements: [
      'incomeStatements',
      'assetInventory',
      'creditorList',
      'taxReturns',
      'monthlyExpenses'
    ]
  },
  ccaa: {
    thresholds: {
      minDebt: 5000000,
      minCreditors: 10,
      minEmployees: 50
    },
    votingRequirements: {
      valueThreshold: 0.662,
      numberThreshold: 0.5
    }
  },
  wura: {
    conditions: {
      minLiabilities: 1000000,
      ceaseBusinessDays: 60,
      petitionThreshold: 0.25
    }
  }
};
