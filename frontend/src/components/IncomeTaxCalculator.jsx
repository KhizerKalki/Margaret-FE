import React, { useState, useEffect } from "react";
import axios from "axios";

function IncomeTaxCalculator() {
  const [inputs] = useState({
    basicSalary: 50000,
    hra: 20000,
    medicalAllowance: 1250,
    conveyanceAllowance: 1600,
    specialAllowance: 10000,
    otherAllowance: 1500,
    lta: 8000,
    mealAllowance: 3000,
    npsContribution: 2000,
    childrenEducationAllowance: 1200,
    hostelAllowance: 1000,
    washingAllowance: 500,
    uniformAllowance: 800,
    otherReimbursements: 1000,
    otherAllowances: 5000,
    grossAnnualSalaryOld: 600000,
    grossAnnualSalaryNew: 620000,
    nonTaxableAllowancesOld: 20000,
    nonTaxableAllowancesNew: 22000,
    professionalTaxOld: 2400,
    professionalTaxNew: 2400,
    standardDeductionOld: 50000,
    standardDeductionNew: 50000,
    hraExemptionOld: 20000,
    hraExemptionNew: 22000,
    ltaExemptionOld: 8000,
    ltaExemptionNew: 8500,
    lossFromHouseOld: 20000,
    lossFromHouseNew: 20000,
    incomeFromHouseOld: 10000,
    incomeFromHouseNew: 10000,
    incomeFromOtherOld: 15000,
    incomeFromOtherNew: 15000,
    currentEmployerPf: 18000,
    previousEmployerPf: 18000,
    vpf: 12000,
    lip: 15000,
    ppf: 10000,
    cef: 12000,
    pensionFunds: 10000,
    fd: 5000,
    ulip: 7000,
    hlp: 25000,
    elss: 15000,
    nsc: 8000,
    stampDuty: 15000,
    otherInvestments: 5000,
    deduction80dCol3: 25000,
    deduction80dCol4: 25000,
    deduction80ccd1bCol3: 5000,
    deduction80ccd1bCol4: 5000,
    deduction80ccd2Col3: 2000,
    deduction80ccd2Col4: 2000,
    deduction80ddCol3: 10000,
    deduction80ddCol4: 10000,
    deduction80ddbCol3: 15000,
    deduction80ddbCol4: 15000,
    deduction80eCol3: 5000,
    deduction80eCol4: 5000,
    deduction80eeCol3: 8000,
    deduction80eeCol4: 8000,
    deduction80eeaCol3: 7000,
    deduction80eeaCol4: 7000,
    deduction80gCol3: 9000,
    deduction80gCol4: 9000,
    deduction80ttaCol3: 5000,
    deduction80ttaCol4: 5000,
    deduction80uCol3: 2000,
    deduction80uCol4: 2000,
    rebate87a: 12500,
    rebate87aNew: 12500,
    balanceTax: 150000,
    balanceTaxNew: 155000,
    totalTax: 125000,
    totalTaxNew: 130000,
    incomeTax: 100000,
    incomeTaxNew: 105000,
    surcharge: 10000,
    surchargeNew: 10500,
    eduCess: 4000,
    eduCessNew: 4200,
    totalInvestments: 150000,
    totalDeductionsCol3: 100000,
    totalDeductionsCol4: 105000,
  });

  const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };

  const calculateGrossSalary = () => {
    const totalGrossSalary =
      inputs.basicSalary +
      inputs.hra +
      inputs.medicalAllowance +
      inputs.conveyanceAllowance +
      inputs.specialAllowance +
      inputs.otherAllowance +
      inputs.lta +
      inputs.mealAllowance +
      inputs.npsContribution +
      inputs.childrenEducationAllowance +
      inputs.hostelAllowance +
      inputs.washingAllowance +
      inputs.uniformAllowance +
      inputs.otherReimbursements +
      inputs.otherAllowances;

    return totalGrossSalary.toFixed(2);
  };

  const calculateIncome = () => {
    const incomeFromSalaryOld =
      inputs.grossAnnualSalaryOld -
      inputs.nonTaxableAllowancesOld -
      inputs.professionalTaxOld -
      inputs.standardDeductionOld -
      inputs.hraExemptionOld -
      inputs.ltaExemptionOld;

    const grossTotalIncomeOld =
      incomeFromSalaryOld -
      inputs.lossFromHouseOld +
      inputs.incomeFromHouseOld +
      inputs.incomeFromOtherOld;

    const incomeFromSalaryNew =
      inputs.grossAnnualSalaryNew -
      inputs.nonTaxableAllowancesNew -
      inputs.professionalTaxNew -
      inputs.standardDeductionNew -
      inputs.hraExemptionNew -
      inputs.ltaExemptionNew;

    const grossTotalIncomeNew =
      incomeFromSalaryNew -
      inputs.lossFromHouseNew +
      inputs.incomeFromHouseNew +
      inputs.incomeFromOtherNew;

    return {
      incomeFromSalaryOld: incomeFromSalaryOld.toFixed(2),
      grossTotalIncomeOld: grossTotalIncomeOld.toFixed(2),
      incomeFromSalaryNew: incomeFromSalaryNew.toFixed(2),
      grossTotalIncomeNew: grossTotalIncomeNew.toFixed(2),
    };
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form16, setform16] = useState({
    assessmentYear: "",
    employerName: "",
    deductorTAN: "",
    employeeName: "",
    employeePAN: "",
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
  };
  const uploadFile = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    const fieldName =
      selectedFile.type === "application/pdf" ? "pdfFile" : "image";
    const endpoint =
      selectedFile.type === "application/pdf" ? "upload" : "askAboutImages";

    formData.append(fieldName, selectedFile);

    try {
      const response = await axios.post(
        `https://margaret-fe-backend.onrender.com/${endpoint}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setform16(response.data);
      console.log(response.data);
      setError("");
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.error ||
          "The document is not a form 16.Please try again."
      );
      return;
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    uploadFile();
  };

  useEffect(() => {
    calculateIncome();
  }, []);

  return (
    <div className="font-sans bg-gray-100 text-gray-800 p-5">
      <div className="flex justify-center m-5">
        {loading ? (
          <div>
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="file" onChange={handleFileChange} />
            <button
              className="btn"
              onClick={handleSubmit}
              style={{ marginTop: "10px" }}
            >
              Upload
            </button>
          </div>
        )}
      </div>
      <div className="container mx-auto max-w-5xl p-5 bg-white shadow-lg">
        <h1 className="text-center mb-5 text-gray-600">
          Monthly Salary Details 2023 - 2024
        </h1>
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                General
              </th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold"></th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                Monthly Salary Details 2023 - 2024
              </th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                DELHI
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Basic Salary + DA</td>
              <td className="border p-2">{inputs.basicSalary}</td>
              <td className="border p-2">Children Education Allowance *</td>
              <td className="border p-2">
                {inputs.childrenEducationAllowance}
              </td>
            </tr>
            <tr>
              <td className="border p-2">House Rent Allowance - HRA</td>
              <td className="border p-2">{inputs.hra}</td>
              <td className="border p-2">Children Hostel Allowance *</td>
              <td className="border p-2">{inputs.hostelAllowance}</td>
            </tr>
            <tr>
              <td className="border p-2">Medical Allowance</td>
              <td className="border p-2">{inputs.medicalAllowance}</td>
              <td className="border p-2">Washing Allowance *</td>
              <td className="border p-2">{inputs.washingAllowance}</td>
            </tr>
            <tr>
              <td className="border p-2">Conveyance Allowance</td>
              <td className="border p-2">{inputs.conveyanceAllowance}</td>
              <td className="border p-2">Uniform Allowance *</td>
              <td className="border p-2">{inputs.uniformAllowance}</td>
            </tr>
            <tr>
              <td className="border p-2">Special Allowance</td>
              <td className="border p-2">{inputs.specialAllowance}</td>
              <td className="border p-2">Sum of All Other Reimbursements *</td>
              <td className="border p-2">{inputs.otherReimbursements}</td>
            </tr>
            <tr>
              <td className="border p-2">Other Allowance</td>
              <td className="border p-2">{inputs.otherAllowance}</td>
              <td className="border p-2">Sum of All Other Allowances</td>
              <td className="border p-2">{inputs.otherAllowances}</td>
            </tr>
            <tr>
              <td className="border p-2">Leave Travel Allowance - LTA</td>
              <td className="border p-2">{inputs.lta}</td>
              <td className="border p-2">Sum of All Annual Perks (If Any)</td>
              <td className="border p-2">{inputs.annualPerks}</td>
            </tr>
            <tr>
              <td className="border p-2">Meal (Voucher) Allowance *</td>
              <td className="border p-2">{inputs.mealAllowance}</td>
              <td className="border p-2">Monthly House Rent Paid</td>
              <td className="border p-2">{inputs.houseRent}</td>
            </tr>
            <tr>
              <td className="border p-2">NPS Employer Contribution</td>
              <td className="border p-2">{inputs.npsContribution}</td>
              <td className="border p-2">Select Rent Location</td>
              <td className="border p-2">{inputs.rentLocation}</td>
            </tr>
            <tr className="bg-gray-100 font-bold text-right">
              <td colSpan="3" className="p-2">
                Total Monthly Gross Salary:
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {calculateGrossSalary()}
              </td>
            </tr>
          </tbody>
        </table>

        <h1 className="text-center mb-5 text-gray-600">
          Taxability & Calculation as per Old and New Tax Regime
        </h1>
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th
                colSpan="2"
                className="border p-2 text-left bg-gray-700 text-white font-bold"
              ></th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                Old Regime
              </th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                New Regime
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 font-bold text-right">
              <td colSpan="2" className="p-2">
                Gross Annual Salary Income (Salary + Allowances + Perks):
              </td>
              <td className="p-2">{inputs.grossAnnualSalaryOld}</td>
              <td className="p-2">{inputs.grossAnnualSalaryNew}</td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Less: Official and Reimbursement Non-Taxable Allowances *
              </td>
              <td className="p-2">{inputs.nonTaxableAllowancesOld}</td>
              <td className="p-2">{inputs.nonTaxableAllowancesNew}</td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Less: Tax on Employment (Professional Tax)
              </td>
              <td className="p-2">{inputs.professionalTaxOld}</td>
              <td className="p-2">{inputs.professionalTaxNew}</td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Less: Standard Deduction
              </td>
              <td className="p-2">{inputs.standardDeductionOld}</td>
              <td className="p-2">{inputs.standardDeductionNew}</td>
            </tr>
            <tr>
              <td className="p-2">Auto Calculation as per Rent amount</td>
              <td className="p-2">Less: HRA Exemption</td>
              <td className="p-2">{inputs.hraExemptionOld}</td>
              <td className="p-2">{inputs.hraExemptionNew}</td>
            </tr>
            <tr>
              <td className="p-2">Amount of LTA Travel Bills (Annually)</td>
              <td className="p-2">Less: LTA Exemption</td>
              <td className="p-2">{inputs.ltaExemptionOld}</td>
              <td className="p-2">{inputs.ltaExemptionNew}</td>
            </tr>
            <tr className="bg-gray-100 font-bold text-right">
              <td colSpan="2" className="p-2">
                Income from Salary
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.incomeFromSalaryOld}
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.incomeFromSalaryNew}
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Less: Loss from House Property u/s(24)
              </td>
              <td className="p-2">{inputs.lossFromHouseOld}</td>
              <td className="p-2">{inputs.lossFromHouseNew}</td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Add: Income from House Property
              </td>
              <td className="p-2">{inputs.incomeFromHouseOld}</td>
              <td className="p-2">{inputs.incomeFromHouseNew}</td>
            </tr>
            <tr>
              <td colSpan="2" className="p-2">
                Add: Income from Other Sources
              </td>
              <td className="p-2">{inputs.incomeFromOtherOld}</td>
              <td className="p-2">{inputs.incomeFromOtherNew}</td>
            </tr>
            <tr className="bg-gray-100 font-bold text-right">
              <td colSpan="2" className="p-2">
                Gross Total Income
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.grossTotalIncomeOld}
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.grossTotalIncomeNew}
              </td>
            </tr>
          </tbody>
        </table>

        <h1 className="text-center mb-5 text-gray-600">
          Investments U/S 80C & 80CCC
        </h1>
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                Investment Type
              </th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                Amount
              </th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold"></th>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Current Employer - PF</td>
              <td className="border p-2">{inputs.currentEmployerPf}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Previous Employer - PF</td>
              <td className="border p-2">{inputs.previousEmployerPf}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Voluntary Provident Fund - VPF</td>
              <td className="border p-2">{inputs.vpf}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Life Insurance Premiums - LIP</td>
              <td className="border p-2">{inputs.lip}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Public Provident Fund - PPF</td>
              <td className="border p-2">{inputs.ppf}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">
                Children Education Tuition Fees - CEF
              </td>
              <td className="border p-2">{inputs.cef}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Pension Funds – Section 80CCC</td>
              <td className="border p-2">{inputs.pensionFunds}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Bank Fixed Deposits (5-Yr) - FD</td>
              <td className="border p-2">{inputs.fd}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">Unit Linked Insurance Plan - ULIP</td>
              <td className="border p-2">{inputs.ulip}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">
                Home Loan Principal Repayment - HLP
              </td>
              <td className="border p-2">{inputs.hlp}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">
                Equity Linked Savings Scheme - ELSS
              </td>
              <td className="border p-2">{inputs.elss}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">National Savings Certificate - NSC</td>
              <td className="border p-2">{inputs.nsc}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">
                Stamp Duty and Registration Charges
              </td>
              <td className="border p-2">{inputs.stampDuty}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr>
              <td className="border p-2">
                Other Investments E.g. Sukanya Account
              </td>
              <td className="border p-2">{inputs.otherInvestments}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
            <tr className="bg-gray-100 font-bold text-right">
              <td className="p-2">Total Investments U/S 80C & 80CCC</td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.totalInvestments}
              </td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                Taxable Income
              </th>
              <td className="p-2">{inputs.taxableIncomeOld}</td>
              <td className="p-2">{inputs.taxableIncomeNew}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Income Tax</td>
              <td className="border p-2">{inputs.incomeTax}</td>
              <td className="border p-2">{inputs.incomeTaxNew}</td>
            </tr>

            <tr>
              <td className="border p-2">
                <strong>Less: </strong>Rebate 87A
              </td>
              <td className="border p-2">{inputs.rebate87a}</td>
              <td className="border p-2">{inputs.rebate87aNew}</td>
            </tr>
            <tr>
              <td className="border p-2">Balance Tax Liability</td>
              <td className="border p-2">{inputs.balanceTax}</td>
              <td className="border p-2">{inputs.balanceTaxNew}</td>
            </tr>
            <tr>
              <td className="border p-2">Add: Surcharge</td>
              <td className="border p-2">{inputs.surcharge}</td>
              <td className="border p-2">{inputs.surchargeNew}</td>
            </tr>

            <tr>
              <td className="border p-2">Total Tax</td>
              <td className="border p-2">{inputs.totalTax}</td>
              <td className="border p-2">{inputs.totalTaxNew}</td>
            </tr>
            <tr>
              <td className="border p-2">Add: Edu. Health Cess</td>
              <td className="border p-2">{inputs.eduCess}</td>
              <td className="border p-2">{inputs.eduCessNew}</td>
            </tr>

            <tr className="bg-gray-100 font-bold text-right">
              <td className="p-2">Net Annual Tax</td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.eduCess}
              </td>
              <td className="p-2 text-center text-lg text-gray-700">
                {inputs.eduCessNew}
              </td>
            </tr>
            <tr className="font-bold text-center bg-gray-100">
              <td className="p-2"></td>
              <td className="p-2">Save Tax as per New Slab</td>
              <td className="p-2">
                {(inputs.eduCess - inputs.eduCessNew).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <h1 className="text-center mb-5 text-gray-600">Form 16 Details</h1>
        <div className="border p-5 bg-white shadow rounded">
          <table className="w-full border-collapse mb-5">
            <tbody>
              <tr>
                <td className="border p-2 font-bold text-left">
                  Employee Name
                </td>
                <td className="border p-2 text-left">{form16.employeeName}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">
                  Employer Name
                </td>
                <td className="border p-2 text-left">{form16.employerName}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">Employee PAN</td>
                <td className="border p-2 text-left">{form16.employeePAN}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">Deductor Tan</td>
                <td className="border p-2 text-left">{form16.deductorTAN}</td>
              </tr>
              <tr>
                <td className="border p-2 font-bold text-left">
                  Assessment Year
                </td>
                <td className="border p-2 text-left">
                  {form16.assessmentYear}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5">
            <p className="text-gray-600 text-sm">
              <strong>Signature Details</strong>
            </p>
            <p className="text-gray-600 text-sm">
              This form has been signed and certified using a Digital Signature
              Certificate as specified under section 119 of the income-tax Act,
              1961. (Please refer circular No.2/2007, dated 21-5-2007).
            </p>
            <p className="text-gray-600 text-sm mt-3">
              The Digital Signature of the signatory has been affixed below. To
              see the details and validate the signature, you should click on
              the signature.
            </p>
          </div>

          <div className="mt-5 text-center">
            <p className="text-gray-600 text-sm font-bold">
              Caution: Please do not attempt to modify / tamper with your Form
              16. Any alteration will render the same invalid.
            </p>
            <p className="text-gray-600 text-sm">Digitally Signed by</p>
            <p className="text-gray-600 text-sm">Date:</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeTaxCalculator;
