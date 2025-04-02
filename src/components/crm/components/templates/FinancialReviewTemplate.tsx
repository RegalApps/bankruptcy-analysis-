
import React from 'react';

interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  filing_date: string;
  status: string;
}

interface FinancialReviewTemplateProps {
  clientInfo: ClientInfo;
}

export const FinancialReviewTemplate: React.FC<FinancialReviewTemplateProps> = ({ clientInfo }) => {
  const today = new Date().toLocaleDateString();
  
  // Mock financial data
  const financialData = {
    income: {
      employment: 3500,
      other: 500,
      total: 4000,
    },
    expenses: {
      housing: 1500,
      utilities: 300,
      food: 600,
      total: 2400,
    },
    assets: {
      realestate: 350000,
      vehicles: 15000,
      investments: 25000,
    },
    debts: {
      creditcards: 18000,
      loans: 12000,
      total: 30000,
    },
    surplus: 1600,
  };
  
  return (
    <div className="space-y-6 p-6 bg-white dark:bg-zinc-900 border rounded-md font-mono text-sm">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Financial Statement Review</h2>
        <p>Client: {clientInfo.name}</p>
        <p>Date: {today}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Income:</h3>
        <div className="grid grid-cols-2 gap-2">
          <p>Employment Income:</p>
          <p className="text-right">${financialData.income.employment.toLocaleString()}</p>
          <p>Other Income:</p>
          <p className="text-right">${financialData.income.other.toLocaleString()}</p>
          <div className="col-span-2 border-t border-gray-300 dark:border-gray-700 mt-1 pt-1">
            <div className="flex justify-between font-bold">
              <p>Total Income:</p>
              <p>${financialData.income.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Expenses:</h3>
        <div className="grid grid-cols-2 gap-2">
          <p>Housing:</p>
          <p className="text-right">${financialData.expenses.housing.toLocaleString()}</p>
          <p>Utilities:</p>
          <p className="text-right">${financialData.expenses.utilities.toLocaleString()}</p>
          <p>Food:</p>
          <p className="text-right">${financialData.expenses.food.toLocaleString()}</p>
          <div className="col-span-2 border-t border-gray-300 dark:border-gray-700 mt-1 pt-1">
            <div className="flex justify-between font-bold">
              <p>Total Expenses:</p>
              <p>${financialData.expenses.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-md">
        <div className="flex justify-between font-bold">
          <p>Surplus Income:</p>
          <p>${financialData.surplus.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Assets:</h3>
        <div className="grid grid-cols-2 gap-2">
          <p>Real Estate:</p>
          <p className="text-right">${financialData.assets.realestate.toLocaleString()}</p>
          <p>Vehicles:</p>
          <p className="text-right">${financialData.assets.vehicles.toLocaleString()}</p>
          <p>Investments:</p>
          <p className="text-right">${financialData.assets.investments.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Liabilities:</h3>
        <div className="grid grid-cols-2 gap-2">
          <p>Credit Cards:</p>
          <p className="text-right">${financialData.debts.creditcards.toLocaleString()}</p>
          <p>Loans:</p>
          <p className="text-right">${financialData.debts.loans.toLocaleString()}</p>
          <div className="col-span-2 border-t border-gray-300 dark:border-gray-700 mt-1 pt-1">
            <div className="flex justify-between font-bold">
              <p>Total Debt:</p>
              <p>${financialData.debts.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
        <h3 className="font-bold">Notes:</h3>
        <p className="italic text-gray-700 dark:text-gray-300">
          Based on the financial review, the client would benefit from a consumer proposal to address 
          their debt while protecting their assets.
        </p>
      </div>
    </div>
  );
};
