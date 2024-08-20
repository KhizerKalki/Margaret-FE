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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, " $1");
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
        <BottomGradient />
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
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.general?.[key] === undefined ? "" : inputs.general[key] || "0"}
                      onChange={(e) => handleChange("general", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.monthlySalaryDetails?.[key] === undefined ? "" : inputs.monthlySalaryDetails[key] || "0"}
                      onChange={(e) => handleChange("monthlySalaryDetails", key, e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.delhi?.[key] === undefined ? "" : inputs.delhi[key] || "0"}
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
                      value={inputs.taxability?.oldRegime?.[key] === undefined ? "" : inputs.taxability.oldRegime[key] || "0"}
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
                      value={inputs.taxability?.newRegime?.[key] === undefined ? "" : inputs.taxability.newRegime[key] || "0"}
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
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={inputs.investments?.[key] === undefined ? "" : inputs.investments[key] || "0"}
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
          <h1 className="text-center mb-5 text-gray-600">Form 16 Details</h1>
          <div className="border p-5 bg-white shadow rounded">
            <table className="w-full border-collapse mb-5">
              <tbody>
                {Object.keys(sampleData.form16Details).map((key) => (
                  <tr key={key}>
                    <td className="border p-2 font-bold text-left">
                      {capitalizeFirstLetter(key)}
                    </td>
                    <td className="border p-2 text-left">
                      <input
                        type="text"
                        value={inputs.form16Details?.[key] === undefined ? "" : inputs.form16Details[key] || "0"}
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
              <p className="text-gray-600 text-sm">
                Digitally Signed by {inputs.form16Details?.signatureName || ""}
              </p>
              <p className="text-gray-600 text-sm">
                Date: {inputs.form16Details?.signatureDate || ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomeTaxCalculator;
