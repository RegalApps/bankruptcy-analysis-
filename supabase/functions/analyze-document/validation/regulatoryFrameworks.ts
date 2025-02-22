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
  },
  fdma: {
    thresholds: {
      minDebt: 25000,
      mediationPeriod: 30,
      stayPeriod: 45
    },
    requirements: {
      documentationNeeded: [
        'farmingIncome',
        'assetInventory',
        'operationsReport',
        'environmentalAssessment'
      ],
      minimumFarmingPeriod: 24 // months
    }
  },
  ccaaExtended: {
    thresholds: {
      crossBorderDebt: 10000000,
      minimumOperatingTime: 36, // months
      employeeCount: 100
    },
    internationalProvisions: {
      recognizedJurisdictions: ['US', 'UK', 'EU'],
      documentationRequirements: [
        'foreignProceedingRecognition',
        'assetDisclosure',
        'creditorAgreements'
      ]
    }
  },
  pbsa: {
    requirements: {
      fundingRatio: 0.85,
      minimumContribution: 100000,
      reportingFrequency: 3 // months
    },
    disclosureRequirements: [
      'actuarialReport',
      'investmentPolicy',
      'memberCommunications'
    ]
  },
  securities: {
    capitalRequirements: {
      minimumCapital: 250000,
      workingCapitalRatio: 2.0,
      customerAssetSegregation: true
    },
    compliance: {
      reportingFrequency: 'monthly',
      auditRequirements: ['external', 'internal'],
      customerProtection: ['insurance', 'segregation']
    }
  }
};
