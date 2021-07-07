const PDFToolsSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs')

const inputFile = "./creditMemo.docx"
const outputFile = "./creditMemo.pdf"

const data = {
	"date": "2021-07-01T04:00:00.000Z",
	"loanOfficer": "William Hawking",
	"loanAnalyst": "Michelle Smith",
	"borrower": "Milkyway corporation",
	"specificLoanPurpose": "Purpose of the loan.",
	"id": 679255,
	"status": "Completed",
	"projectName": "Milkyway Giants",
	"streetAddress": "910 Deerfield Crossing Dr Apt 7303",
	"appartment": "",
	"city": "Alpharetta",
	"state": "GA",
	"zipcode": "30004-1824",
	"propertyPics": "[\"https://creditmemofile.s3.us-east-2.amazonaws.com/ffe5b900-7f6c-4093-9d50-540e9d6793f5.jpg\",\"https://creditmemofile.s3.us-east-2.amazonaws.com/cc57af55-2aa7-496d-9522-aef76e37b06d.jpg\"]",
	"appraisalReport": "",
	"salesPrice": "35,000,000",
	"appraisedValue": "32,500,000",
	"propertyType": "Hotel/Motel",
	"PropertyCollateralDescription": "A brief description about the property collaterals",
	"loanAmount": "30,000,000",
	"loanAmortization": 340,
	"interestRate": "3.95",
	"fee": "0",
	"MDSSL": "0",
	"proposedPayment": "$146,764.32",
	"capitalizationRate": "7.50%",
	"ltvPercent": "80%",
	"TDSCR": "1.15",
	"balloonTerm": 60,
	"BERR": "8.00%",
	"NOI": "$543,766.00 ",
	"GPRINC": "$756,000.00 ",
	"TOE": "$174,434.00 ",
	"HNOI": "$643,766.00 ",
	"HGPRINC": "$856,000.00 ",
	"HTOE": "$274,434.00 ",
	"LTVAM": "$26,000,000.00",
	"FLAM": "$8,054,409.96",
	"LTVRatio": "24.78",
	"reservesRequired": "N/A",
	"DSCR": "0.31",
	"ADSAM": "$472,840.00",
	"ADSSL": "$0.00",
	"MPDSCR": "$39,403.33",
	"maxSustainableLoanAmount": "$8,054,409.96",
	"EAPRAM": "$7,250,213.00",
	"debtYield": "1.81%",
	"actualAnnualDebtService": "$1,761,171.84",
	"breakEvenOccupancyRate": "256.03%",
	"selectedNOI": "1",
	"underwriterNOI": "$543,766.00 ",
	"underwriterGPRINC": "$756,000.00 ",
	"underwriterTOE": "$174,434.00 ",
	"justification": "",
	"rentalIncomeInformation": "",
	"tenantLeaseInformation": "",
	"equity": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"management": "test Management",
	"managementAdditionalInfo": "",
	"reputation": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"financialStatements": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"liquidity": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"secondaryRepayment": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"managementAdditional": "",
	"financialAdditional": "",
	"marketFile": "",
	"singleAsset": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"guarantyConsiderations": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"amortization": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"reservesEscrows": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"insuranceRequirements": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"creditEnhancemen": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"LoanAgreementAdditionalDetails": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"strengthsWeaknessesOfficerRecommendation": "\"From page 86 \"\"potential gross income field\"\" \nor keyed in \"",
	"loanPolicyExceptions": "Exception2"
};

if(fs.existsSync(outputFile)) fs.unlinkSync(outputFile)

const credentials =  PDFToolsSdk.Credentials
.serviceAccountCredentialsBuilder()
.fromFile("./pdfservices-api-credentials.json")
.build();

const executionContext = PDFToolsSdk.ExecutionContext.create(credentials)

const documentMerge = PDFToolsSdk.DocumentMerge,
documentMergeOptions = documentMerge.options,
options = new documentMergeOptions.DocumentMergeOptions(data, documentMergeOptions.OutputFormat.PDF)

const documentMergeOperation = documentMerge.Operation.createNew(options)

const input = PDFToolsSdk.FileRef.createFromLocalFile(inputFile)
documentMergeOperation.setInput(input)

documentMergeOperation.execute(executionContext)
.then(result => result.saveAsFile(outputFile))
.catch(err => {
        if(err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
            console.log("Exception encountered while executing operation", err)
        } else {
            console.log("Exception encountered while executing operation", err)
        }
})




