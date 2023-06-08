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
                    "content": data["query"]                
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
    

    console.log('request made to ai server at: ' + new Date().toString() + '\nBody:'+JSON.stringify(body,null,4));
    var endpoint=`https://${aiConfig.aiResourceName}.openai.azure.com/openai/deployments/${aiConfig.aiDeploymentName}/chat/completions?api-version=${aiConfig.aiAPIVersion}`;
    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, aiConfig.aiEndpoint,data))
        .catch(error => {console.log(error); summaryModal("Server Error","An Error Occured on the Server...Try Again or Check Logs")});
}
function genaisummary(summarytype,data,token) {
    //Load Patient from FHIR
    let fhirdata ="";
    if (summarytype==="Patient") {
        fhirdata={"query": fhirConfig.fhirEndpoint + "/Patient?_id=" + data + "&_revinclude=Condition:patient","method":"GET","sumtype":"Patient"};
    } else if (summarytype==="Observation") {
        fhirdata={"query": fhirConfig.fhirEndpoint + "/Observation?subject=" + data +"&_count=7","method":"GET","sumtype":"Observation"};     
    }
    callfhirserver(aiConfig.aiEndpoint,token,fhirdata,ailoadpatientdata);
}
function ailoadpatientdata(response, endpoint,data) {
    let query="";
    if (data["sumtype"]==="Patient") {
        query="Given the following FHIR Bundle describe the patient and summarize patients medical history:\n" + JSON.stringify(response);
    } else if (data["sumtype"]==="Observation") {
        query="Given the following FHIR Bundle summarize the Observation findings in an HTML table:\n" + JSON.stringify(response);     
    }
    data["query"]=query;
    callaifunc(aiConfig.aiEndpoint,aiConfig.aiKey,data,aidisplaysummary);

   
}
function aidisplaysummary(response,endpoint,data) {
    let airesponse={"aisummary":response};
    updateUI(airesponse,endpoint,data);
}
