// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const queryDiv = document.getElementById("bodycontainer");
const airespDiv = document.getElementById("airespcontainer");
const fhirrespDiv = document.getElementById("fhirrespcontainer");
const sumbody = document.getElementById("summarybody");
function showWelcomeMessage(username) {
    // Reconfiguring DOM elements
    queryDiv.style.display = 'initial';
    welcomeDiv.innerHTML = `Welcome ${username}`;
    signInButton.setAttribute("onclick", "signOut();");
    signInButton.setAttribute('class', "btn btn-success")
    signInButton.innerHTML = "Sign Out";
}
function mineAIResponseforFHIR(response,data) {
    var retval={};
    var airesp = response["choices"][0]["message"]["content"];
    if (data["query"].startsWith('*')) {
        return airesp;
    }
    var lines = airesp.split('\n');
    var newfhirquery=""
    var body = "";
    if (lines.length > 1)
    {
        lines.forEach(function(t) {
            {
                if (t.includes("[base]") && newfhirquery==="")
                {
                    newfhirquery = t.replace("`", "");
                }
                else
                {
                    if (t.length && newfhirquery.startsWith("POST"))
                    {
                        body = body + t;
                    }
                }
            }
        });
    }
    else
    {
        newfhirquery = lines[0];
    }
    newfhirquery = newfhirquery.replace("[base]", fhirConfig.fhirEndpoint);
    if (newfhirquery.startsWith("GET ")) newfhirquery = newfhirquery.substring(4);
    if (newfhirquery.startsWith("POST ")) newfhirquery = newfhirquery.substring(5);
    //Filter Hacks until custom model can be trained
    if (newfhirquery.includes("Immunization?") && newfhirquery.includes("code=")) {
        newfhirquery=newfhirquery.replace("code=","vaccine-code=");
    } 
    retval["query"] = newfhirquery;
    retval["method"] = (body.length > 1 ? "POST" : "GET");
    retval["body"] = body;
    return retval;
}
function summaryModal(title,data) {
    document.getElementById("summodelLabel").innerHTML = title;
    sumbody.innerHTML="";
    var display=data;
    //var display="<pre>";
    //display+=data; 
    //display+="</pre>";
    sumbody.insertAdjacentHTML('afterbegin',display); 
    $('#myModal').modal('hide');
    $('#summarymodal').modal('show');
}
function updateUI(response, endpoint, data) {
    console.log(endpoint + ' responded at: ' + new Date().toString());
    if (endpoint === fhirConfig.fhirEndpoint) {
       fhirrespDiv.innerHTML='';
       var output='';
       if (data["method"]==="GET") { 
        output=constructCards(response);
       } else {
        output="<pre>" + JSON.stringify(response,null,4) + "</pre>";
       }
        // insert the HTML using .insertAdjacentHTML
        fhirrespDiv.insertAdjacentHTML('afterbegin', output)
        fhirrespDiv.style.display = 'initial';
        $('#myModal').modal('hide');

    } else if (endpoint === aiConfig.aiEndpoint) {
        if (response["aisummary"]) {
            var airesp = response["aisummary"]["choices"][0]["message"]["content"];
            summaryModal(data["sumtype"] +" Summary",airesp);
        } else {
            response=mineAIResponseforFHIR(response,data);
            if (response["query"]) {
                $("#airesp").text(JSON.stringify(response));
                airespDiv.style.display = 'initial';
                queryFHIR(response);
            } else {
                $('#myModal').modal('hide');
                fhirrespDiv.innerHTML='';
                airespDiv.style.display='none';
                var output="<pre style='white-space: pre-wrap'>" + response + "</pre>";
                // insert the HTML using .insertAdjacentHTML
                fhirrespDiv.insertAdjacentHTML('afterbegin', output)
                fhirrespDiv.style.display = 'initial';
            }
        }
    }
   
}