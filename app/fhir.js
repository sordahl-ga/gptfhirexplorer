/** 
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
function callfhirserver(endpoint, token, data, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
    headers.append("Accept","application/json");
    headers.append("Content-Type","application/json");

    const options = {
        method: data["method"],
        headers: headers
        
    };
    
    if (data["method"]==="POST") {
        options["body"]=data["body"];
    }

    console.log('request made to FHIR server at: ' + new Date().toString() + ' query: ' + data["query"]);
    fetch(data["query"], options)
        .then(response => response.json())
        .then(response => callback(response,endpoint,data))
        .catch(error => console.log(error));
}