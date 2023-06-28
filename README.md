# GPT FHIR Explorer Sample
Demonstration of using OpenAI to generate FHIR Queries for exploring FHIR Server data and summarizing that data.  You may also use it as a general GPT prompt response platform.
# Prerequisites
1. A running instance of [AHDS FHIR Service](https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/fhir-portal-quickstart) or [Azure API for FHIR](https://learn.microsoft.com/en-us/azure/healthcare-apis/azure-api-for-fhir/fhir-paas-portal-quickstart)
2. A running instance of [Azure OpenAI Service](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/overview?wt.mc_id=acom_openaiwhatis_webpage_gdc) and gpt-turbo-35 or gpt-4 deployed conversation completion model resource
3. A registered [Public Client](https://learn.microsoft.com/en-us/azure/healthcare-apis/azure-api-for-fhir/register-public-azure-ad-client-app)
<I>Note: This is a SPA client and is not secure it is for demonstration purposes and not to be used in production or with any PHI/PII.</I>
# How to set-up a demo environment
1.  Download and install [nodejs and npm](https://nodejs.org/en/download) for your platform
2.  Switch to root directory of this repo
3.  Run ```npm install```
4.  Provide the following JSON Configuration object info as a single string environment variable named NODE_CONFIG:
```
{
	"aiConfig": {
		"aiResourceName": "<your open ai resource name>",
		"aiDeploymentName": "<your open ai deployment name>",
		"aiAPIVersion": "<your open ai api version>",
		"aiKey": "<your open ai key>"
	},
	"fhirConfig": {
		"fhirEndpoint": "<your fhir server endpoint URL>"
	},
	"authConfig": {
		"clientId": "<your fhir server principal client id>",
		"authority": "<your fhir server principal client authority e.g. https://login.microsoftonline.com/{tenantid}>",
		"redirectUri": "<your fhir server principal client redirect url e.g. http://localhost:3000>"
	}
}
```
5. Run ```npm start```