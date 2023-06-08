function constructCards(data) {
    var output='';
    if (data && data["entry"]) {
        output = '<div class="row row-cols-1 row-cols-md-3 g-4">';
        data['entry'].forEach(item => {
            var rid="cid"+item["resource"]["id"];
            sessionStorage.setItem(rid,"<pre style=\"zoom: 75%\">" + JSON.stringify(item["resource"],null,4) + "</pre>");
            output+=`<div class="col" id="rid${item["resource"]["id"]}">
                        <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${item["resource"]["resourceType"]}</h5>
                            <div style="display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%"><p style="margin-bottom: 0px">${item["resource"]["id"]}</p></div>`
                            output+="<img src='infoicon.png' alt='Display Full Resource' width='20' height='20' onclick='summaryModal(\"Resource\",sessionStorage.getItem(\"" + rid + "\"))'>";
                switch(item["resource"]["resourceType"]) {
                    case "Patient":
                        output+=patientTemplate(item);
                        break;
                    case "Device":
                        output+=baseTemplate(item);
                        break;
                    case "Observation":
                        output+=observationTemplate(item);
                        break;
                    case "Immunization":
                        output+=immunizationTemplate(item);
                        break;
                    default:
                        output+=baseTemplate(item);
                    // code block
                }
              output+=`</div>
                </div>
            </div>`
        })
        // close the row
        output += '</div>'
    } else {
        if (data) {
            output="<pre>" + JSON.stringify(data,null,4) + "</pre>";
        } else {
            output="<h5>No response</h5>";
        }
    }
    return output;
}
function baseTemplate(item) {
    let retval='';
        if (item["resource"]["text"] && item["resource"]["text"]["div"]) {
            retval += `<p class="card-text">${item["resource"]["text"]["div"]}</p>`
        }
    return retval;
}
function patientTemplate(item) {
    let retval='';
        if (item["resource"]["name"] && item["resource"]["name"][0]["family"]) {
            retval += `<p class="card-text">${item["resource"]["name"][0]["family"]}`;
            if (item["resource"]["name"][0]["given"]) {
                retval += `,${item["resource"]["name"][0]["given"][0]}`;
            }
            retval+="</p>";
            if (item["resource"]["gender"]) {
                retval += `<p class="card-text">${item["resource"]["gender"]}</p>`;
            }
            if (item["resource"]["birthDate"]) {
                var bd = Date.parse(item["resource"]["birthDate"]);
                var diff_ms = Date.now() - bd;
                var age_dt = new Date(diff_ms);
                retval+=`<p class="card-text">${Math.abs(age_dt.getUTCFullYear() - 1970)} Y</p>`;
            }
            if (item["resource"]["address"]) {
                var addr = '';
                if (item["resource"]["address"][0]["line"]) {
                    addr+=item["resource"]["address"][0]["line"][0]+"</br>";
                    addr+=item["resource"]["address"][0]["city"]+", "+item["resource"]["address"][0]["state"];
                    if (item["resource"]["address"][0]["postalCode"]) {
                        addr+=" " +item["resource"]["address"][0]["postalCode"];
                    }
                    addr+="</br>";
                }
                retval+=`<p class="card-text">${addr}</p>`;
            }
            retval+=`<a href="javascript:generateSummary('Patient','${item["resource"]["id"]}')" class="btn btn-primary">Condition Summary</a>`;
            
        } else {
            return baseTemplate(item);
        }
    return retval;
}
function observationTemplate(item) {
    let retval='';
    if (item["resource"]["code"] && item["resource"]["code"]["coding"]) {
        var i = item["resource"]["code"]["coding"][0];
        retval=`<p class="card-text">`;
        if (i["code"]) retval+=i["code"]+"-";
        if (i["display"]) retval+=i["display"];
        if (i["system"]) {
            if (i["system"].includes("loinc")) {
                retval+=" (LOINC)";
            } else if(i["system"].includes("snomed")) {
                retval+=" (SNOMED)";
            }
             
        }
        retval+="</p>";
        if (item["resource"]["effectiveDateTime"]) {
            var d = new Date(Date.parse(item["resource"]["effectiveDateTime"]));
            retval+=`<p class="card-text">Date/Time: ${d.toUTCString()}</p>`;
        }
        if (item["resource"]["valueQuantity"]) {
            retval+=`<p class="card-text">Result: ${item["resource"]["valueQuantity"]["value"]} ${item["resource"]["valueQuantity"]["unit"]}</p>`;
        }
        if (item["resource"]["valueCodeableConcept"]) {
            var i = item["resource"]["valueCodeableConcept"]["coding"][0];
            retval+=`<p class="card-text">Result: `;
            if (i["code"]) retval+=i["code"]+"-";
            if (i["display"]) retval+=i["display"];
            if (i["system"]) {
            if (i["system"].includes("loinc")) {
                retval+=" (LOINC)"
                } else if(i["system"].includes("snomed")) {
                    retval+=" (SNOMED)"
                }
           
            }
            retval+="</p>";
        }
        if (item["resource"]["subject"]["reference"]) {
            var patid=item["resource"]["subject"]["reference"].substring(8);
            retval+=`<a href="javascript:generateSummary('Observation','${patid}')" class="btn btn-primary">Generate Summary</a>`;
        }    
    }
    return retval;
}
function immunizationTemplate(item) {
    let retval='';
    if (item["resource"]["vaccineCode"] && item["resource"]["vaccineCode"]["coding"]) {
        var i = item["resource"]["vaccineCode"]["coding"][0];
        retval=`<p class="card-text">`;
        if (i["code"]) retval+=i["code"]+"-";
        if (i["display"]) retval+=i["display"];
        if (i["system"]) {
            if (i["system"].includes("cvx")) {
                retval+=" (CVX)";
            } else if(i["system"].includes("snomed")) {
                retval+=" (SNOMED)";
            }
             
        }
        retval+="</p>";
        if (item["resource"]["occurrenceDateTime"]) {
            var d = new Date(Date.parse(item["resource"]["occurrenceDateTime"]));
            retval+=`<p class="card-text">Date/Time: ${d.toUTCString()}</p>`;
        }
        if (item["resource"]["patient"]["reference"]) {
            var patid=item["resource"]["patient"]["reference"].substring(8);
            retval+=`<a href="javascript:generateSummary('${patid}')" class="btn btn-primary">Generate Summary</a>`;
        }    
    }
    return retval;
}