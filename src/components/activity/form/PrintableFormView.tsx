import { IncomeExpenseData } from "../types";
import React, { forwardRef } from "react";

interface AISummary {
  surplusDeficit: {
    amount: string;
    trend: string;
  };
  debtRatio: string;
  highRiskCategories: string[];
  trusteeNotes: string;
}

interface PrintableFormViewProps {
  formData: IncomeExpenseData;
  currentDate: string;
  aiSummary: AISummary;
}

export const PrintableFormView = forwardRef<HTMLDivElement, PrintableFormViewProps>(
  ({ formData, currentDate, aiSummary }, ref) => {
    const formatCurrency = (value: string) => {
      if (!value) return "$0.00";
      return `$${parseFloat(value).toFixed(2)}`;
    };

    return (
      <div ref={ref} className="print-container p-8 bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Income & Expenses for the month of {currentDate}</h1>
        </div>

        <div className="mb-8 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">AI-Generated Financial Summary</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">
                {parseFloat(aiSummary.surplusDeficit.amount) >= 0 ? "Surplus" : "Deficit"} Income
              </h3>
              <p className="flex items-center">
                <span className={parseFloat(aiSummary.surplusDeficit.amount) >= 0 ? "text-green-600" : "text-red-600"}>
                  {parseFloat(aiSummary.surplusDeficit.amount) >= 0 ? "🔺" : "🔻"}
                </span>
                <span className="font-bold text-lg ml-2">
                  {formatCurrency(aiSummary.surplusDeficit.amount)}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {parseFloat(aiSummary.surplusDeficit.amount) >= 0 
                    ? "Available after expenses" 
                    : "Shortfall each month"}
                </span>
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Debt-to-Income Ratio</h3>
              <p className="flex items-center">
                <span className={parseFloat(aiSummary.debtRatio) <= 20 ? "text-green-600" : "text-red-600"}>
                  {parseFloat(aiSummary.debtRatio) <= 20 ? "✅" : "⚠️"}
                </span>
                <span className="font-bold text-lg ml-2">{aiSummary.debtRatio}%</span>
                <span className="ml-2 text-sm text-gray-600">
                  {parseFloat(aiSummary.debtRatio) <= 20 
                    ? "Healthy debt level" 
                    : "Higher than recommended"}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">Risk Assessment</h3>
            {aiSummary.highRiskCategories.length > 0 ? (
              <ul className="list-disc pl-6">
                {aiSummary.highRiskCategories.map((risk, index) => (
                  <li key={index} className="text-red-600">
                    <span className="mr-1">🛑</span> {risk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600">✅ No high-risk financial patterns detected</p>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">Trustee Notes</h3>
            <p className="italic">{aiSummary.trusteeNotes}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p><strong>Name:</strong> {formData.full_name}</p>
            <p><strong>Address:</strong> {formData.residential_address}</p>
            <p><strong>Home Phone:</strong> {formData.phone_home}</p>
            <p><strong>Marital Status:</strong> {formData.marital_status}</p>
          </div>
          <div>
            <p><strong>Employer:</strong> {formData.employer_name}</p>
            <p><strong>Work Phone:</strong> {formData.work_phone}</p>
            <p><strong>Occupation:</strong> {formData.occupation}</p>
            <p><strong>Spouse's Name:</strong> {formData.spouse_name}</p>
            <p><strong># of Members in Household:</strong> {formData.household_size}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">MONTHLY FAMILY INCOME (NET)</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left">Source</th>
                <th className="text-right">Debtor</th>
                <th className="text-right">Spouse</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Employment Income</td>
                <td className="text-right">{formatCurrency(formData.employment_income)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_employment_income)}</td>
              </tr>
              <tr>
                <td>Pension/Annuities</td>
                <td className="text-right">{formatCurrency(formData.pension_annuities)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_pension_annuities)}</td>
              </tr>
              <tr>
                <td>Child/Spousal Support</td>
                <td className="text-right">{formatCurrency(formData.child_spousal_support)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_child_spousal_support)}</td>
              </tr>
              <tr>
                <td>Self-Employment Income</td>
                <td className="text-right">{formatCurrency(formData.self_employment_income)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_self_employment_income)}</td>
              </tr>
              <tr>
                <td>Government Benefits</td>
                <td className="text-right">{formatCurrency(formData.government_benefits)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_government_benefits)}</td>
              </tr>
              <tr>
                <td>Rental Income</td>
                <td className="text-right">{formatCurrency(formData.rental_income)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_rental_income)}</td>
              </tr>
              <tr>
                <td>Other Income</td>
                <td className="text-right">{formatCurrency(formData.other_income)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_other_income)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total</td>
                <td className="text-right">{formatCurrency(formData.total_monthly_income)}</td>
                <td className="text-right">{formatCurrency(formData.spouse_total_monthly_income)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">ESSENTIAL MONTHLY EXPENSES</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left">Expense Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mortgage/Rent</td>
                <td className="text-right">{formatCurrency(formData.mortgage_rent)}</td>
              </tr>
              <tr>
                <td>Utilities</td>
                <td className="text-right">{formatCurrency(formData.utilities)}</td>
              </tr>
              <tr>
                <td>Groceries</td>
                <td className="text-right">{formatCurrency(formData.groceries)}</td>
              </tr>
              <tr>
                <td>Child Care</td>
                <td className="text-right">{formatCurrency(formData.child_care)}</td>
              </tr>
              <tr>
                <td>Medical/Dental</td>
                <td className="text-right">{formatCurrency(formData.medical_dental)}</td>
              </tr>
              <tr>
                <td>Transportation</td>
                <td className="text-right">{formatCurrency(formData.transportation)}</td>
              </tr>
              <tr>
                <td>Education/Tuition</td>
                <td className="text-right">{formatCurrency(formData.education_tuition)}</td>
              </tr>
              <tr>
                <td>Debt Repayments</td>
                <td className="text-right">{formatCurrency(formData.debt_repayments)}</td>
              </tr>
              <tr>
                <td>Miscellaneous Essential</td>
                <td className="text-right">{formatCurrency(formData.misc_essential_expenses)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total Essential Expenses</td>
                <td className="text-right">{formatCurrency(formData.total_essential_expenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">DISCRETIONARY EXPENSES</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left">Expense Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dining Out</td>
                <td className="text-right">{formatCurrency(formData.dining_out)}</td>
              </tr>
              <tr>
                <td>Alcohol</td>
                <td className="text-right">{formatCurrency(formData.alcohol)}</td>
              </tr>
              <tr>
                <td>Tobacco</td>
                <td className="text-right">{formatCurrency(formData.tobacco)}</td>
              </tr>
              <tr>
                <td>Entertainment</td>
                <td className="text-right">{formatCurrency(formData.entertainment)}</td>
              </tr>
              <tr>
                <td>Gym Memberships</td>
                <td className="text-right">{formatCurrency(formData.gym_memberships)}</td>
              </tr>
              <tr>
                <td>Gifts/Donations</td>
                <td className="text-right">{formatCurrency(formData.gifts_donations)}</td>
              </tr>
              <tr>
                <td>Subscriptions</td>
                <td className="text-right">{formatCurrency(formData.subscriptions)}</td>
              </tr>
              <tr>
                <td>Clothing</td>
                <td className="text-right">{formatCurrency(formData.clothing)}</td>
              </tr>
              <tr>
                <td>Pet Care</td>
                <td className="text-right">{formatCurrency(formData.pet_care)}</td>
              </tr>
              <tr>
                <td>Leisure & Travel</td>
                <td className="text-right">{formatCurrency(formData.leisure_travel)}</td>
              </tr>
              <tr>
                <td>Other: {formData.other_discretionary_description}</td>
                <td className="text-right">{formatCurrency(formData.other_discretionary)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total Discretionary Expenses</td>
                <td className="text-right">{formatCurrency(formData.total_discretionary_expenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">SAVINGS & INVESTMENTS</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left">Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Emergency Savings</td>
                <td className="text-right">{formatCurrency(formData.emergency_savings)}</td>
              </tr>
              <tr>
                <td>Retirement Savings</td>
                <td className="text-right">{formatCurrency(formData.retirement_savings)}</td>
              </tr>
              <tr>
                <td>Education Savings</td>
                <td className="text-right">{formatCurrency(formData.education_savings)}</td>
              </tr>
              <tr>
                <td>Investment Contributions</td>
                <td className="text-right">{formatCurrency(formData.investment_contributions)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total Savings</td>
                <td className="text-right">{formatCurrency(formData.total_savings)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">INSURANCE EXPENSES</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left">Insurance Type</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vehicle</td>
                <td className="text-right">{formatCurrency(formData.vehicle_insurance)}</td>
              </tr>
              <tr>
                <td>Health</td>
                <td className="text-right">{formatCurrency(formData.health_insurance)}</td>
              </tr>
              <tr>
                <td>Life</td>
                <td className="text-right">{formatCurrency(formData.life_insurance)}</td>
              </tr>
              <tr>
                <td>Home/Renter's</td>
                <td className="text-right">{formatCurrency(formData.home_insurance)}</td>
              </tr>
              <tr>
                <td>Other: {formData.other_insurance_description}</td>
                <td className="text-right">{formatCurrency(formData.other_insurance)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total Insurance</td>
                <td className="text-right">{formatCurrency(formData.total_insurance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">SUMMARY</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="font-bold">
                <td>Total Income:</td>
                <td className="text-right">
                  {formatCurrency(
                    (parseFloat(formData.total_monthly_income || "0") + 
                     parseFloat(formData.spouse_total_monthly_income || "0")).toString()
                  )}
                </td>
              </tr>
              <tr className="font-bold">
                <td>Total Expenses:</td>
                <td className="text-right">
                  {formatCurrency(
                    (parseFloat(formData.total_essential_expenses || "0") + 
                     parseFloat(formData.total_discretionary_expenses || "0") +
                     parseFloat(formData.total_savings || "0") +
                     parseFloat(formData.total_insurance || "0")).toString()
                  )}
                </td>
              </tr>
              <tr className="font-bold">
                <td>Difference:</td>
                <td className="text-right">
                  {formatCurrency(
                    (
                      (parseFloat(formData.total_monthly_income || "0") + 
                       parseFloat(formData.spouse_total_monthly_income || "0")) -
                      (parseFloat(formData.total_essential_expenses || "0") + 
                       parseFloat(formData.total_discretionary_expenses || "0") +
                       parseFloat(formData.total_savings || "0") +
                       parseFloat(formData.total_insurance || "0"))
                    ).toString()
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 pt-10 border-t">
          <p className="mb-4">I hereby certify that the above information is complete and accurate to the best of my knowledge.</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="mb-6 mt-8">
              <div className="border-b border-black w-64 inline-block mb-1"></div>
              <p>Client Signature</p>
            </div>
            
            <div className="mb-6 mt-8">
              <div className="border-b border-black w-64 inline-block mb-1"></div>
              <p>Date</p>
            </div>
            
            <div className="mb-6">
              <div className="border-b border-black w-64 inline-block mb-1"></div>
              <p>Trustee Signature</p>
            </div>
            
            <div className="mb-6">
              <div className="border-b border-black w-64 inline-block mb-1"></div>
              <p>Trustee Name (Print)</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
            <p className="text-sm text-gray-600 font-bold">Final Approval Notes:</p>
            <div className="h-16 border-b border-gray-400"></div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableFormView.displayName = "PrintableFormView";
