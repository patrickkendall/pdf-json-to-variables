const PDFToolsSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs')
const express = require("express");
var request = require('request').defaults({ encoding: null });
const bodyParser = require("body-parser")

const inputFile = "./creditMemo.docx"
const outputFile = "./creditMemo.pdf"
var logo;
var data;

const app = express();

app.use(express.json()); 

app.use(bodyParser.urlencoded({
	extended: true
  }));


/* for reference data can be sent through postman
data = {
{
	"borrowerAnalysis": {
		"equity": "test equity",
		"financialAdditional": "",
		"financialStatements": "test",
		"liquidity": "test",
		"management": "test",
		"managementAdditional": "",
		"managementAdditionalInfo": "",
		"marketFile": "",
		"reputation": "test",
		"secondaryRepayment": "test"
	},
	"id": "68f5c9e7-8187-47c2-a496-1d8ae1ca5a96",
	"lastModifiedOn": "7/7/2021, 9:56:30 PM",
	"loanGenericDetails": {
		"borrower": "Madam Curie",
		"date": "2021-07-10T04:00:00.000Z",
		"loanAnalyst": "Issac Newton",
		"loanOfficer": "Albert Einstein",
		"specificLoanPurpose": "test purpose, changed again! Yes"
	},
	"loanStructure": {
		"balloonTerm": 60,
		"BERR": "8.00%",
		"capitalizationRate": "1.15",
		"fee": "0",
		"interestRate": "4.3",
		"loanAmortization": 303,
		"loanAmount": "4789652",
		"ltvPercent": "80",
		"MDSSL": "0",
		"proposedPayment": "$25,937.79",
		"TDSCR": "25"
	},
	"loanStructureAndCreditEnhancements": {
		"amortization": "test spl amoritization terms",
		"creditEnhancemen": "test",
		"guarantyConsiderations": "test",
		"insuranceRequirements": "test terdy",
		"LoanAgreementAdditionalDetails": "test",
		"loanPolicyExceptions": "Exception4",
		"reservesEscrows": "test",
		"singleAsset": "test",
		"strengthsWeaknessesOfficerRecommendation": "test"
	},
	"propertyDetails": {
		"appartment": "",
		"appraisalReport": "",
		"appraisedValue": "$6,500,000",
		"city": "Alpharetta",
		"projectName": "MyProject",
		"PropertyCollateralDescription": "Collateral",
		"propertyPics": "[\"https://creditmemofile.s3.us-east-2.amazonaws.com/ffe5b900-7f6c-4093-9d50-540e9d6793f5.jpg\",\"https://creditmemofile.s3.us-east-2.amazonaws.com/cc57af55-2aa7-496d-9522-aef76e37b06d.jpg\"]",
		"propertyType": "Warehouse",
		"salesPrice": "$7,250,213 ",
		"state": "Georgia",
		"streetAddress": "910 Deerfield Crossing Dr Apt 7303",
		"zipcode": "30004-1824"
	},
	"propertyFinancials": {
		"actualAnnualDebtService": "$311,253.48",
		"ADSAM": "$10,349.64",
		"ADSSL": "$0.00",
		"breakEvenOccupancyRate": "263.01%",
		"debtYield": "5.40%",
		"DSCR": "0.83",
		"EAPRAM": "$22,499,217.00",
		"FLAM": "$159,263.06",
		"GPRINC": "4000000",
		"HGPRINC": "258963",
		"HNOI": "258741",
		"HTOE": "369852",
		"justification": "some justification",
		"LTVAM": "$5,200,000.00",
		"LTVRatio": "2.45",
		"maxSustainableLoanAmount": "$159,263.06",
		"MPDSCR": "$862.47",
		"NOI": "$6,000,000.00",
		"rentalIncomeInformation": "",
		"reservesRequired": "N/A",
		"selectedNOI": "2",
		"tenantLeaseInformation": "",
		"TOE": "62653.07",
		"underwriterGPRINC": "258963",
		"underwriterNOI": "258741",
		"underwriterTOE": "369852"
	},
	"status": "Complete",
	"userId": "1563beb6-d321-4c07-9f58-34587bb49d6d",
	"userName": "vijay_yarramsetty@capturisk.com"
}
*/

app.post("/creditMemo", async(req,res) => {

	const data = req.body;
	var propertyPics = []

	//this function handles converting the jpeg to a base64
	const getBase64 = async (logo) => {
	var x;
	for(x = 0; x < logo.length; x++) {
	console.log(1);
	await request.get(logo[x], async (error, response, body) => {
			if (!error && response.statusCode == 200) {
				logo[x] = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
				console.log("HERE IS THE STRING FOR BASE64 "+logo[x])
				console.log("-----------------------------------------")
			}
		})
	}};

	var propertyPics = data.propertyDetails.propertyPics
	var propertyPics = JSON.parse(propertyPics);
	console.log(propertyPics)
	data.propertyDetails.ypropertyPics = getBase64(propertyPics);

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

	//return result to Postman / browser
	documentMergeOperation.execute(executionContext)
	.then(result => result.saveAsFile(outputFile))
	.catch(err => {
			if(err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
				console.log("Exception encountered while executing operation", err)
			} else {
				console.log("Exception encountered while executing operation", err)
			}
	})

	const file = `${__dirname}/creditMemo.pdf`;
	res.download(file);

});

app.listen(5000, () => {
	console.log("Server has started on port 5000")
})




