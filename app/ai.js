/** 
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
function callaifunc(endpoint, token, data,callback) {
    const headers = new Headers();
    
    headers.append("api-key", token);
    headers.append("Accept","application/json");
    headers.append("Content-Type","application/json");
    const body = {
            "messages": [
                {
                    "role": "system",
                    "content": ""
                },
                {
                    "role": "user",
                    "content": data                
                }
            ],
            "temperature":0.2,
            "max_tokens":3000
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    };
    

    console.log('request made to ai server at: ' + new Date().toString());
    var endpoint=`https://${aiConfig.aiResourceName}.openai.azure.com/openai/deployments/${aiConfig.aiDeploymentName}/chat/completions?api-version=${aiConfig.aiAPIVersion}`;
    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, aiConfig.aiEndpoint,data))
        .catch(error => console.log(error));
}
function genaisummary(data,token) {
    //Load Patient from FHIR
    let fhirdata = {"query": fhirConfig.fhirEndpoint + "/Condition?patient=" + data + "&_include=Condition:patient","method":"GET"};
    callfhirserver(aiConfig.aiEndpoint,token,fhirdata,ailoadpatientdata);
}
function ailoadpatientdata(response, endpoint,data) {
    let query="Given the following FHIR Bundle describe the patient and summarize patients medical history:\n" + JSON.stringify(response);
    callaifunc(aiConfig.aiEndpoint,aiConfig.aiKey,query,aidisplaysummary);

   
}
function aidisplaysummary(response,endpoint,data) {
    let airesponse={"aisummary":response};
    updateUI(airesponse,endpoint,data);
}
