const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const port = process.env.PORT || 3000;

// const corsOptions = {
//   origin: "http://localhost:5173/",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

// app.use(cors(corsOptions));

app.use(cors());
const uploadsDir = path.join(__dirname, "PdfUploads");
const uploadsDirImg = path.join(__dirname, "ImgUploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(uploadsDirImg)) {
  fs.mkdirSync(uploadsDirImg, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, uploadsDirImg);
    } else if (file.mimetype === "application/pdf") {
      cb(null, uploadsDir);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Handle file upload and processing on POST
app.post("/upload", upload.single("pdfFile"), (req, res) => {
  const pdfPath = req.file.path;
  extractTextFromPDF(pdfPath)
    .then((text) => {
      return queryOpenAI(text);
    })
    .then((invoiceData) => {
      const responseMessage = processInvoiceData(invoiceData);
      fs.unlinkSync(pdfPath); // Remove the file after processing
      res.send(responseMessage);
    })
    .catch((error) => {
      console.error("Error processing PDF:", error);
      res.status(500).send("Error processing PDF");
    });
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/askAboutImages", upload.single("image"), async (req, res) => {
  try {
    const imageFilePath = req.file.path;

    const imageAsBase64 = fs.readFileSync(imageFilePath, "base64");
    const imageContent = {
      type: "image_url",
      image_url: `data:image/png;base64,${imageAsBase64}`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: `Extract the following numerical values from the Form 16. If a value is not available, leave it empty.\n
   I DONT NEED LABELS OR HEADINGS JUST GIVE ME THE NUMERICAL VALUES IN THIS ORDER
          Extract the following numerical values from the Form 16. If a value is not available, leave it empty. The values should be extracted in the following format without the labels , only give the values if present:\n\n
          Basic Salary:\n
          HRA:\n
          Medical Allowance:\n
          Conveyance Allowance:\n
          Special Allowance:\n
          Other Allowance:\n
          LTA:\n
          Meal Allowance:\n
          NPS Contribution:\n
          Children Education Allowance:\n
          Hostel Allowance:\n
          Washing Allowance:\n
          Uniform Allowance:\n
          Other Reimbursements:\n
          Other Allowances:\n
          Gross Annual Salary (Old Regime):\n
          Gross Annual Salary (New Regime):\n
          Taxability (Old Regime):\n
          Gross Annual Salary (Old Regime):\n
          Non-Taxable Allowances (Old Regime):\n
          Professional Tax (Old Regime):\n
          Standard Deduction (Old Regime):\n
          HRA Exemption (Old Regime):\n
          LTA Exemption (Old Regime):\n
          Loss From House (Old Regime):\n
          Income From House (Old Regime):\n
          Income From Other (Old Regime):\n
          Taxability (New Regime):\n
          Gross Annual Salary (New Regime):\n
          Non-Taxable Allowances (New Regime):\n
          Professional Tax (New Regime):\n
          Standard Deduction (New Regime):\n
          HRA Exemption (New Regime):\n
          LTA Exemption (New Regime):\n
          Loss From House (New Regime):\n
          Income From House (New Regime):\n
          Income From Other (New Regime):\n
          Current Employer PF:\n
          Previous Employer PF:\n
          VPF:\n
          LIP:\n
          PPF:\n
          CEF:\n
          Pension Funds:\n
          FD:\n
          ULIP:\n
          HLP:\n
          ELSS:\n
          NSC:\n
          Stamp Duty:\n
          Other Investments:\n
          Total Investments:\n
          Taxable Income (Old Regime):\n
          Income Tax (Old Regime):\n
          Rebate 87A (Old Regime):\n  
          Balance Tax (Old Regime):\n
          Surcharge (Old Regime):\n
          Total Tax (Old Regime):\n 
          Edu Cess (Old Regime):\n
          Net Annual Tax(Old Regime):\n
          Tax Savings (Old Regime):\n
          Taxable Income (New Regime):\n
          Income Tax (New Regime):\n
          Rebate 87A (New Regime):\n
          Balance Tax (New Regime):\n
          Surcharge (New Regime):\n
          Total Tax (New Regime):\n
          Edu Cess (New Regime):\n
          Net Annual Tax (New Regime):\n
          Tax Savings (New Regime):\n
          Employee Name:\n
          Employee No:\n
          PAN:\n
          Designation:\n
          Financial Year:\n
          Assessment Year:\n
          Form 16 Enclosed:\n
          Form 12BA Enclosed:\n
          Taxable Income:\n
          Tax:\n
          Signature Name:\n
          Signature Date:\n\n`,
        },
        { role: "user", content: [imageContent] },
      ],
      max_tokens: 1000,
    });

    const responseData = response.choices[0].message.content;

    const lines = responseData.split("\n").map((line) => line.trim());

    const extractValue = (index) =>
      lines[index] && lines[index] !== "" ? lines[index] : "";

    const extractedData = {
      general: {
        basicSalary: extractValue(0),
        hra: extractValue(1),
        medicalAllowance: extractValue(2),
        conveyanceAllowance: extractValue(3),
        specialAllowance: extractValue(4),
        otherAllowance: extractValue(5),
        lta: extractValue(6),
        mealAllowance: extractValue(7),
        npsContribution: extractValue(8),
        childrenEducationAllowance: extractValue(9),
        hostelAllowance: extractValue(10),
        washingAllowance: extractValue(11),
        uniformAllowance: extractValue(12),
        otherReimbursements: extractValue(13),
        otherAllowances: extractValue(14),
      },
      monthlySalaryDetails: {
        grossAnnualSalaryOld: extractValue(15),
        grossAnnualSalaryNew: extractValue(16),
      },
      taxability: {
        oldRegime: {
          grossAnnualSalary: extractValue(17),
          nonTaxableAllowances: extractValue(18),
          professionalTax: extractValue(19),
          standardDeduction: extractValue(20),
          hraExemption: extractValue(21),
          ltaExemption: extractValue(22),
          lossFromHouse: extractValue(23),
          incomeFromHouse: extractValue(24),
          incomeFromOther: extractValue(25),
        },
        newRegime: {
          grossAnnualSalary: extractValue(26),
          nonTaxableAllowances: extractValue(27),
          professionalTax: extractValue(28),
          standardDeduction: extractValue(29),
          hraExemption: extractValue(30),
          ltaExemption: extractValue(31),
          lossFromHouse: extractValue(32),
          incomeFromHouse: extractValue(33),
          incomeFromOther: extractValue(34),
        },
      },
      investments: {
        currentEmployerPf: extractValue(35),
        previousEmployerPf: extractValue(36),
        vpf: extractValue(37),
        lip: extractValue(38),
        ppf: extractValue(39),
        cef: extractValue(40),
        pensionFunds: extractValue(41),
        fd: extractValue(42),
        ulip: extractValue(43),
        hlp: extractValue(44),
        elss: extractValue(45),
        nsc: extractValue(46),
        stampDuty: extractValue(47),
        otherInvestments: extractValue(48),
        totalInvestments: extractValue(49),
      },
      taxableIncome: {
        oldRegime: {
          incomeTax: extractValue(50),
          rebate87a: extractValue(51),
          balanceTax: extractValue(52),
          surcharge: extractValue(53),
          totalTax: extractValue(54),
          eduCess: extractValue(55),
          netAnnualTax: extractValue(56),
          taxSavings: extractValue(57),
        },
        newRegime: {
          incomeTax: extractValue(58),
          rebate87a: extractValue(59),
          balanceTax: extractValue(60),
          surcharge: extractValue(61),
          totalTax: extractValue(62),
          eduCess: extractValue(63),
          netAnnualTax: extractValue(64),
          taxSavings: extractValue(65),
        },
      },
      form16Details: {
        employeeName: extractValue(66),
        employeeNo: extractValue(67),
        pan: extractValue(68),
        designation: extractValue(69),
        financialYear: extractValue(70),
        assessmentYear: extractValue(71),
        form16Enclosed: extractValue(72),
        form12BAEnclosed: extractValue(73),
        taxableIncome: extractValue(74),
        tax: extractValue(75),
        signatureName: extractValue(76),
        signatureDate: extractValue(77),
      },
    };

    res.json(extractedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function extractTextFromPDF(pdfPath) {
  let dataBuffer = fs.readFileSync(pdfPath);
  return pdf(dataBuffer).then(function (data) {
    return data.text;
  });
}

async function queryOpenAI(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const data = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `

   I DONT NEED LABELS OR HEADINGS JUST GIVE ME THE NUMERICAL VALUES IN THIS ORDER\n
          Extract the following numerical values from the Form 16. If a value is not available,make it 0. The values should be extracted in the following format without the labels:\n\n
          Basic Salary:\n
          HRA:\n
          Medical Allowance:\n
          Conveyance Allowance:\n
          Special Allowance:\n
          Other Allowance:\n
          LTA:\n
          Meal Allowance:\n
          NPS Contribution:\n
          Children Education Allowance:\n
          Hostel Allowance:\n
          Washing Allowance:\n
          Uniform Allowance:\n
          Other Reimbursements:\n
          Other Allowances:\n
          Gross Annual Salary (Old Regime):\n
          Gross Annual Salary (New Regime):\n
          Taxability (Old Regime):\n
          Gross Annual Salary (Old Regime):\n
          Non-Taxable Allowances (Old Regime):\n
          Professional Tax (Old Regime):\n
          Standard Deduction (Old Regime):\n
          HRA Exemption (Old Regime):\n
          LTA Exemption (Old Regime):\n
          Loss From House (Old Regime):\n
          Income From House (Old Regime):\n
          Income From Other (Old Regime):\n
          Taxability (New Regime):\n
          Gross Annual Salary (New Regime):\n
          Non-Taxable Allowances (New Regime):\n
          Professional Tax (New Regime):\n
          Standard Deduction (New Regime):\n
          HRA Exemption (New Regime):\n
          LTA Exemption (New Regime):\n
          Loss From House (New Regime):\n
          Income From House (New Regime):\n
          Income From Other (New Regime):\n
          Current Employer PF:\n
          Previous Employer PF:\n
          VPF:\n
          LIP:\n
          PPF:\n
          CEF:\n
          Pension Funds:\n
          FD:\n
          ULIP:\n
          HLP:\n
          ELSS:\n
          NSC:\n
          Stamp Duty:\n
          Other Investments:\n
          Total Investments:\n
          Taxable Income (Old Regime):\n
          Income Tax (Old Regime):\n
          Rebate 87A (Old Regime):\n  
          Balance Tax (Old Regime):\n
          Surcharge (Old Regime):\n
          Total Tax (Old Regime):\n 
          Edu Cess (Old Regime):\n
          Net Annual Tax(Old Regime):\n
          Tax Savings (Old Regime):\n
          Taxable Income (New Regime):\n
          Income Tax (New Regime):\n
          Rebate 87A (New Regime):\n
          Balance Tax (New Regime):\n
          Surcharge (New Regime):\n
          Total Tax (New Regime):\n
          Edu Cess (New Regime):\n
          Net Annual Tax (New Regime):\n
          Tax Savings (New Regime):\n
          Employee Name:\n
          Employee No:\n
          PAN:\n
          Designation:\n
          Financial Year:\n
          Assessment Year:\n
          Form 16 Enclosed:\n
          Form 12BA Enclosed:\n
          Taxable Income:\n
          Tax:\n
          Signature Name:\n
          Signature Date:\n\n
  `,
      },
      { role: "user", content: text },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}

function processInvoiceData(invoiceData) {
  const dataParts = invoiceData.split(/,|\n/).map((part) => part.trim());

  if (dataParts) {
    const [
      assessmentYear,
      basicSalary,
      hra,
      medicalAllowance,
      conveyanceAllowance,
      specialAllowance,
      otherAllowance,
      lta,
      mealAllowance,
      npsContribution,
      childrenEducationAllowance,
      hostelAllowance,
      washingAllowance,
      uniformAllowance,
      otherReimbursements,
      otherAllowances,
      grossAnnualSalaryOld,
      grossAnnualSalaryNew,
      grossAnnualSalaryOldRegime,
      nonTaxableAllowancesOldRegime,
      professionalTaxOldRegime,
      standardDeductionOldRegime,
      hraExemptionOldRegime,
      ltaExemptionOldRegime,
      lossFromHouseOldRegime,
      incomeFromHouseOldRegime,
      incomeFromOtherOldRegime,
      grossAnnualSalaryNewRegime,
      nonTaxableAllowancesNewRegime,
      professionalTaxNewRegime,
      standardDeductionNewRegime,
      hraExemptionNewRegime,
      ltaExemptionNewRegime,
      lossFromHouseNewRegime,
      incomeFromHouseNewRegime,
      incomeFromOtherNewRegime,
      currentEmployerPF,
      previousEmployerPF,
      vpf,
      lip,
      ppf,
      cef,
      pensionFunds,
      fd,
      ulip,
      hlp,
      elss,
      nsc,
      stampDuty,
      otherInvestments,
      totalInvestments,
      incomeTaxOldRegime,
      rebate87aOldRegime,
      balanceTaxOldRegime,
      surchargeOldRegime,
      totalTaxOldRegime,
      eduCessOldRegime,
      netAnnualTaxOldRegime,
      taxSavingsOldRegime,
      incomeTaxNewRegime,
      rebate87aNewRegime,
      balanceTaxNewRegime,
      surchargeNewRegime,
      totalTaxNewRegime,
      eduCessNewRegime,
      netAnnualTaxNewRegime,
      taxSavingsNewRegime,
      employeeName,
      employeeNo,
      pan,
      designation,
      financialYear,
      form16Enclosed,
      form12BAEnclosed,
      taxableIncome,
      tax,
      signatureName,
      signatureDate,
    ] = dataParts;

    return {
      general: {
        basicSalary,
        hra,
        medicalAllowance,
        conveyanceAllowance,
        specialAllowance,
        otherAllowance,
        lta,
        mealAllowance,
        npsContribution,
        childrenEducationAllowance,
        hostelAllowance,
        washingAllowance,
        uniformAllowance,
        otherReimbursements,
        otherAllowances,
      },
      monthlySalaryDetails: {
        grossAnnualSalaryOld,
        grossAnnualSalaryNew,
      },
      taxability: {
        oldRegime: {
          grossAnnualSalary: grossAnnualSalaryOldRegime,
          nonTaxableAllowances: nonTaxableAllowancesOldRegime,
          professionalTax: professionalTaxOldRegime,
          standardDeduction: standardDeductionOldRegime,
          hraExemption: hraExemptionOldRegime,
          ltaExemption: ltaExemptionOldRegime,
          lossFromHouse: lossFromHouseOldRegime,
          incomeFromHouse: incomeFromHouseOldRegime,
          incomeFromOther: incomeFromOtherOldRegime,
        },
        newRegime: {
          grossAnnualSalary: grossAnnualSalaryNewRegime,
          nonTaxableAllowances: nonTaxableAllowancesNewRegime,
          professionalTax: professionalTaxNewRegime,
          standardDeduction: standardDeductionNewRegime,
          hraExemption: hraExemptionNewRegime,
          ltaExemption: ltaExemptionNewRegime,
          lossFromHouse: lossFromHouseNewRegime,
          incomeFromHouse: incomeFromHouseNewRegime,
          incomeFromOther: incomeFromOtherNewRegime,
        },
      },
      investments: {
        currentEmployerPf: currentEmployerPF,
        previousEmployerPf: previousEmployerPF,
        vpf,
        lip,
        ppf,
        cef,
        pensionFunds,
        fd,
        ulip,
        hlp,
        elss,
        nsc,
        stampDuty,
        otherInvestments,
        totalInvestments,
      },
      taxableIncome: {
        oldRegime: {
          incomeTax: incomeTaxOldRegime,
          rebate87a: rebate87aOldRegime,
          balanceTax: balanceTaxOldRegime,
          surcharge: surchargeOldRegime,
          totalTax: totalTaxOldRegime,
          eduCess: eduCessOldRegime,
          netAnnualTax: netAnnualTaxOldRegime,
          taxSavings: taxSavingsOldRegime,
        },
        newRegime: {
          incomeTax: incomeTaxNewRegime,
          rebate87a: rebate87aNewRegime,
          balanceTax: balanceTaxNewRegime,
          surcharge: surchargeNewRegime,
          totalTax: totalTaxNewRegime,
          eduCess: eduCessNewRegime,
          netAnnualTax: netAnnualTaxNewRegime,
          taxSavings: taxSavingsNewRegime,
        },
      },
      form16Details: {
        employeeName,
        employeeNo,
        pan,
        designation,
        financialYear,
        assessmentYear,
        form16Enclosed,
        form12BAEnclosed,
        taxableIncome,
        tax,
        signatureName,
        signatureDate,
      },
    };
  } else {
    throw new Error("Failed to extract all required information");
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
