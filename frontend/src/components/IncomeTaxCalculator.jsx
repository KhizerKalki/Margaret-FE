import React, { useState } from "react";
import { sampleData } from "../../SampleDB/sampleData";

function IncomeTaxCalculator() {
  const [inputs, setInputs] = useState({});
  const [showTables, setShowTables] = useState(false);

  const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };

  const handleUpload = () => {
    // Simulate fetching data, in a real scenario, this might involve reading a file or fetching from an API
    setInputs(sampleData);
    setShowTables(true);
  };

  const handleChange = (section, key, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [section]: {
        ...prevInputs[section],
        [key]: value,
      },
    }));
  };

  const calculateSum = (section) => {
    return Object.values(inputs[section] || {})
      .filter((value) => !isNaN(value) && value !== "")
      .reduce((sum, value) => sum + parseFloat(value), 0)
      .toFixed(2);
  };

  const calculateIncomeFromSalary = (regime) => {
    const regimeData = inputs.taxability?.[regime] || {};
    const {
      grossAnnualSalary = 0,
      nonTaxableAllowances = 0,
      professionalTax = 0,
      standardDeduction = 0,
      hraExemption = 0,
      ltaExemption = 0,
      lossFromHouse = 0,
      incomeFromHouse = 0,
      incomeFromOther = 0,
    } = regimeData;

    return (
      grossAnnualSalary -
      nonTaxableAllowances -
      professionalTax -
      standardDeduction -
      hraExemption -
      ltaExemption -
      lossFromHouse +
      incomeFromHouse +
      incomeFromOther
    ).toFixed(2);
  };

  return (
    <div className="font-sans text-gray-800 p-5">
      {/* Upload button */}
      <div className="flex justify-center m-5">
        <button
          onClick={handleUpload}
          className="bg-gradient-to-br w-1/5 relative group/btn from-black to-neutral-600 block text-white rounded-md h-10 font-medium shadow-input"
        >
          Upload Form 16
        </button>
        <BottomGradient/>
      </div>

      {showTables && (
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
              {Object.keys(sampleData.general).map((key) => (
                <tr key={key}>
                  <td className="border p-2">{key.replace(/([A-Z])/g, " $1")}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.general?.[key] || ""}
                      onChange={(e) => handleChange("general", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.monthlySalaryDetails?.[key] || ""}
                      onChange={(e) => handleChange("monthlySalaryDetails", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.delhi?.[key] || ""}
                      onChange={(e) => handleChange("delhi", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-right">
                <td colSpan="3" className="p-2">
                  Total Monthly Gross Salary:
                </td>
                <td className="p-2 text-center text-lg text-gray-700">
                  {calculateSum("general")}
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
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  Old Regime
                </th>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  New Regime
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sampleData.taxability.oldRegime).map((key) => (
                <tr key={key}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.taxability?.oldRegime?.[key] || ""}
                      onChange={(e) =>
                        handleChange(
                          "taxability",
                          {
                            ...inputs.taxability,
                            oldRegime: {
                              ...inputs.taxability?.oldRegime,
                              [key]: e.target.value,
                            },
                          },
                          "oldRegime"
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.taxability?.newRegime?.[key] || ""}
                      onChange={(e) =>
                        handleChange(
                          "taxability",
                          {
                            ...inputs.taxability,
                            newRegime: {
                              ...inputs.taxability?.newRegime,
                              [key]: e.target.value,
                            },
                          },
                          "newRegime"
                        )
                      }
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-right">
                <td className="p-2">Income from Salary:</td>
                <td className="p-2">{calculateIncomeFromSalary("oldRegime")}</td>
                <td className="p-2">{calculateIncomeFromSalary("newRegime")}</td>
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
              </tr>
            </thead>
            <tbody>
              {Object.keys(sampleData.investments).map((key) => (
                <tr key={key}>
                  <td className="border p-2">{key.replace(/([A-Z])/g, " $1")}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.investments?.[key] || ""}
                      onChange={(e) => handleChange("investments", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-right">
                <td className="p-2">Total Investments U/S 80C & 80CCC</td>
                <td className="p-2 text-center text-lg text-gray-700">
                  {calculateSum("investments")}
                </td>
              </tr>
            </tbody>
          </table>

          <h1 className="text-center mb-5 text-gray-600">Taxable Income</h1>
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  Old Regime
                </th>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  New Regime
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sampleData.taxableIncome.oldRegime).map((key) => (
                <tr key={key}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.taxableIncome?.oldRegime?.[key] || ""}
                      onChange={(e) =>
                        handleChange(
                          "taxableIncome",
                          {
                            ...inputs.taxableIncome,
                            oldRegime: {
                              ...inputs.taxableIncome?.oldRegime,
                              [key]: e.target.value,
                            },
                          },
                          "oldRegime"
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.taxableIncome?.newRegime?.[key] || ""}
                      onChange={(e) =>
                        handleChange(
                          "taxableIncome",
                          {
                            ...inputs.taxableIncome,
                            newRegime: {
                              ...inputs.taxableIncome?.newRegime,
                              [key]: e.target.value,
                            },
                          },
                          "newRegime"
                        )
                      }
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold text-right">
                <td className="p-2">Net Annual Tax:</td>
                <td className="p-2">{calculateSum("taxableIncome.oldRegime")}</td>
                <td className="p-2">{calculateSum("taxableIncome.newRegime")}</td>
              </tr>
            </tbody>
          </table>

          <h1 className="text-center mb-5 text-gray-600">Form 16 Details</h1>
          <div className="border p-5 bg-white shadow rounded">
            <table className="w-full border-collapse mb-5">
              <tbody>
                {Object.keys(sampleData.form16Details).map((key) => (
                  <tr key={key}>
                    <td className="border p-2 font-bold text-left">
                      {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="border p-2 text-left">
                      <input
                        type="text"
                        value={inputs.form16Details?.[key] || ""}
                        onChange={(e) =>
                          handleChange("form16Details", key, e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomeTaxCalculator;
