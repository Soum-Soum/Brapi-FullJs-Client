
async function getToken(stringUserId, stringPassword, urlEndPoint){
	let myURL = urlEndPoint + "/" + URL_TOKEN, tokenString="";
	let body = {username : stringUserId, password : stringPassword}
	body = JSON.stringify(body);
	try {
    	let resp = await fetch(myURL,{method: "POST",body: body, headers: {'Content-Type': 'application/json'}});
    	if (resp.status>199 && resp.status<300){
		tokenString = await resp.json();
		return tokenString.access_token;
		}else{return tokenString;}
	}
	catch(err) {
	    handleErrors('Impossible to take the tokenUrl1');
	}
}

async function urlMapIdIsOk(brapiEndPoint, mapDbId){
    try {
        await fetch(brapiEndPoint + "/" + URL_MAPS + "/" + mapDbId);
    } catch (err) {
        handleErrors("Bad map id in Url");
        return false;
    }
	return true;
}

async function urlBrapiEndPointIsOk(brapiEndPoint){
	try{
        await fetch(brapiEndPoint + "/" + URL_CALLS);
    }catch(err){
		handleErrors("Bad barpi end point in Url");
		return false;
	}
	return true;
}

async function getCalls(argumentsArray){
	console.log(argumentsArray);
    let myURL1 = argumentsArray.urlEndPoint1 + "/" + URL_CALLS;
    let myHeaders1 = new Headers();
    let Authorization = argumentsArray.tokenUrl1==='' ? '' : "Bearer " + argumentsArray.tokenUrl1;
    myHeaders1 = {Authorization};
	if(argumentsArray.urlEndPoint2===undefined){
        try {
            let resp1 = await fetch(myURL1, myHeaders1);
            resp1 = await resp1.json();
            return [resp1];
        }
		catch(err) {
			handleErrors('impossible to load call calls');
		}
	}else{
        let myURL2 = argumentsArray.urlEndPoint2 + "/" + URL_CALLS;
        let myHeaders2 = new Headers();
        let Authorization = argumentsArray.tokenUrl2==='' ? '' : "Bearer " + argumentsArray.tokenUrl2;
        myHeaders2 = {Authorization};
        try {
            let resp1 = await fetch(myURL1, myHeaders1);
            let resp2 = await fetch(myURL2, myHeaders2);
            resp1 = await resp1.json();
            resp2 = await resp2.json();
            return [resp1, resp2];
        }
        catch(err) {
            handleErrors('impossible to load call calls');
        }
	}
}

async function readMaps(argumentsArray){
	let myURL = argumentsArray.urlEndPoint + "/" + URL_MAPS;
	let foundMaps = [];
	let myInit = returnInit(argumentsArray.token);
    try {
    	let resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		resp.result.data.forEach(function(element){foundMaps.push(element);});
		return foundMaps;
	}
	catch(err) {
	     handleErrors('impossible to load call maps');
	}  
}

async function readStudyList(argumentsArray){
	let myURL = argumentsArray.urlEndPoint + "/" + URL_STUDIES + "?studyType=genotype";
	let foundStudies = new Array();
	let myInit = returnInit(argumentsArray.token);
    try {
    	let resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		resp.result.data.forEach(function(element){foundStudies.push(element);});
		return foundStudies;
	}
	catch(err) {
	     handleErrors('impossible to load call studies');
	}    
}

async function getmarkerProfileDbId(argumentsArray){
    let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES : argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES +"?page="+argumentsArray.askedPage ;
	let myInit = returnInit(argumentsArray.token);
	try {
		let resp = await fetch(myURL, myInit);
    	resp = await resp.json();
    	console.log(resp);
		return resp;
	}
	catch(err) {
	     handleErrors('impossible to load call Maker Profile');
	} 
}

async function getMarkers(argumentsArray){
    let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint + "/" + URL_MARKERS : argumentsArray.urlEndPoint + "/" + URL_MARKERS +"?page="+argumentsArray.askedPage ;
	if(argumentsArray.arrayOfMarkersType !== undefined){
		myURL += '&' + argumentsArray.arrayOfMarkersType[i] + '&pageSize=1';
	}
    let myInit = returnInit(argumentsArray.token);
	try {
		console.log(myURL);
		let resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		return resp;	
	}
	catch(err) {
	     handleErrors('impossible to load call Marker');
	} 
}

async function getMapDetails(argumentsArray){
	let myURL=argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap;
	let myInit = returnInit(argumentsArray.token);
	try {
		let resp = await fetch(myURL, myInit);
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	} 
}

async function getMarkersPosition(argumentsArray){
    let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap+"/positions" : argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap+"/positions?page="+argumentsArray.askedPage;
    if(argumentsArray.selectedLKG!==undefined){myURL = myURL + '&linkageGroupId=' + argumentsArray.selectedLKG;}
    let myInit = returnInit(argumentsArray.token);
	console.log(myURL);
	try {
		let resp = await fetch(myURL, myInit);
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors('impossible to load call map/id/position');
	}
}

async function getMatrix(argumentsArray){
    try {
		let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint + "/" +URL_ALLELE_MATRIX : argumentsArray.urlEndPoint + "/" +URL_ALLELE_MATRIX+ "?pageSize="+argumentsArray.clientPageSize+"&page="+argumentsArray.askedPage;
		let matrixString = "";
		argumentsArray.sendedMarkersProlis = removeAll(argumentsArray.sendedMarkersProlis, undefined);
		for(i=0;i<argumentsArray.sendedMarkersProlis.length; i++){
			matrixString+= 'markerprofileDbId=' + argumentsArray.sendedMarkersProlis[i] + '&';
		}
		argumentsArray.sendedMarkers = removeAll(argumentsArray.sendedMarkers, undefined);
		for(i=0;i<argumentsArray.sendedMarkers.length; i++){
			matrixString+= (i==0 ? '' : '&') + 'markerDbId=' +argumentsArray.sendedMarkers[i];
		}
		matrixString+='&unknownString=';
		if(argumentsArray.isAnExport == true){matrixString += "&format=tsv";}
		let myHeaders = new Headers();
		if(argumentsArray.token!=='""'){
			myHeaders = {'Authorization': 'Bearer '+argumentsArray.token,
				'Content-Type':'application/x-www-form-urlencoded'
			};
		}else {
			myHeaders = {
				'Content-Type':'application/x-www-form-urlencoded'
			};
		}
		console.log(myURL);
    	let resp = await fetch(myURL,{method: "POST",body: matrixString, headers: myHeaders});
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors('impossible to load call matix');
	}
}

async function getExportStatus(argumentsArray){
    try {
		let myURL = argumentsArray.urlEndPoint + "/" + URL_ALLELE_MATRIX + "/status/" + argumentsArray.asynchid;
		let myInit = returnInit(argumentsArray.token);
		let resp = await fetch(myURL, myInit);
		resp = await resp.json();
		console.log(resp);
		console.log(argumentsArray.asynchid);
		console.log(myURL);
		while(resp.metadata.status[0].message==="INPROCESS" && isAbort===false){
			console.log(myURL);
			resp = await fetch(myURL, myInit);
			resp = await resp.json();
			console.log(resp.metadata.pagination.currentPage);
			$('#EvolutionLoadingScreen').html("Loading : " + resp.metadata.pagination.currentPage + "%");
			await sleep(1500);
		}
		if(isAbort===false){
            console.log(resp);
            //window.location = resp.metadata.datafiles[0];
		}
	}
	catch(err) {
		handleErrors(err);
	}
	$.modal.close();
}

async function getGermplasmsDetails(argumentsArray){
    let myURL = argumentsArray.urlEndPoint + "/germplasm/" + argumentsArray.germplasmId;
    let myInit = returnInit(argumentsArray.token);
    let resp = await fetch(myURL, myInit);
    return await resp.json();
}
