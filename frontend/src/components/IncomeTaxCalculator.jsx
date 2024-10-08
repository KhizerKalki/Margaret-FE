import React, { useState } from "react";
import { sampleData } from "../../SampleDB/sampleData";
import axios from "axios";

function IncomeTaxCalculator() {
  const [inputs, setInputs] = useState(sampleData);
  const [showTables, setShowTables] = useState(false);

  const BottomGradient = () => (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    console.log(formData);
    try {
      const response = await axios.post(
        `http://localhost:5000/${endpoint}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setInputs(response.data);
      console.log(response.data);
      setError("");
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.error ||
          "The document is not a form 16. Please try again."
      );
      return;
    } finally {
      setLoading(false);
      setShowTables(true);
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
    );
  };

  const capitalizeFirstLetter = (string) => {
    return (
      string.charAt(0).toUpperCase() +
      string.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  return (
    <div className="font-sans text-gray-800 p-5">
      <div className="flex justify-center m-5">
        {loading ? (
          <div>
            <div className="flex-col gap-4 w-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
              </div>
            </div>
            <p>Loading</p>
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
            <BottomGradient />
          </div>
        )}
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
              {/* General Section */}
              {Object.keys(sampleData.general).map((key) => (
                <tr key={key}>
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.general?.[key] === undefined
                          ? ""
                          : inputs.general[key] || "0"
                      }
                      onChange={(e) =>
                        handleChange("general", key, e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2"></td> {/* Empty column for Monthly Salary Details */}
                  <td className="border p-2"></td> {/* Empty column for DELHI */}
                </tr>
              ))}

              {/* Monthly Salary Details Section */}
              {Object.keys(sampleData.monthlySalaryDetails).map((key) => (
                <tr key={key}>
                  <td className="border p-2"></td> {/* Empty column for General */}
                  <td className="border p-2"></td> {/* Empty column for General */}
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.monthlySalaryDetails?.[key] === undefined
                          ? ""
                          : inputs.monthlySalaryDetails[key] || "0"
                      }
                      onChange={(e) =>
                        handleChange("monthlySalaryDetails", key, e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2"></td> {/* Empty column for DELHI */}
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
                <th className="border p-2 text-left bg-gray-700 text-white font-bold"></th>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  New Regime
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sampleData.taxability.oldRegime).map((key) => (
                <tr key={key}>
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.taxability?.oldRegime?.[key] === undefined
                          ? ""
                          : inputs.taxability.oldRegime[key] || "0"
                      }
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
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.taxability?.newRegime?.[key] === undefined
                          ? ""
                          : inputs.taxability.newRegime[key] || "0"
                      }
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
                <td className="p-2">
                  {calculateIncomeFromSalary("oldRegime")}
                </td>
                <td className="p-2">Income from Salary:</td>
                <td className="p-2">
                  {calculateIncomeFromSalary("newRegime")}
                </td>
              </tr>
            </tbody>
          </table>

          <h1 className="text-center mb-5 text-gray-600">
            Taxable Income as per Old and New Tax Regime
          </h1>
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  Old Regime
                </th>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold"></th>
                <th className="border p-2 text-left bg-gray-700 text-white font-bold">
                  New Regime
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sampleData.taxableIncome.oldRegime).map((key) => (
                <tr key={key}>
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.taxableIncome?.oldRegime?.[key] === undefined
                          ? ""
                          : inputs.taxableIncome.oldRegime[key] || "0"
                      }
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
                  <td className="border p-2">{capitalizeFirstLetter(key)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={
                        inputs.taxableIncome?.newRegime?.[key] === undefined
                          ? ""
                          : inputs.taxableIncome.newRegime[key] || "0"
                      }
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
                <td className="p-2">
                  {calculateSum("taxableIncome.oldRegime")}
                </td>
                <td className="p-2">Net Annual Tax:</td>
                <td className="p-2">
                  {calculateSum("taxableIncome.newRegime")}
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
                        value={
                          inputs.form16Details?.[key] === undefined
                            ? ""
                            : inputs.form16Details[key] || "0"
                        }
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
                This form has been signed and certified using a Digital
                Signature Certificate as specified under section 119 of the
                income-tax Act, 1961. (Please refer circular No.2/2007, dated
                21-5-2007).
              </p>
              <p className="text-gray-600 text-sm mt-3">
                The Digital Signature of the signatory has been affixed below.
                To see the details and validate the signature, you should click
                on the signature.
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
