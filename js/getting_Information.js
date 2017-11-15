const URL_CALLS = "calls";
const URL_MAPS = "maps";
const URL_STUDIES = "studies-search";
const URL_MARKERS = "markers";
const URL_MARKER_PROFILES = "markerprofiles";
const URL_ALLELE_MATRIX = "allelematrix-search";
const URL_TOKEN="token";
const REQUIRED_CALLS = [URL_MAPS, URL_MARKERS, URL_STUDIES, URL_MARKER_PROFILES, URL_ALLELE_MATRIX];

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
	    handleErrors(err);
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

async function getFirstInformation(argumentsArray){
	try{
        let arrayOfStudies, arrayOfMaps = [];
        let paginationManager = new PaginationManager(0);
        let calls = await paginationManager.pager(getCalls, argumentsArray);
        let all_Calls_Are_Detected = callsAreInArray(calls, REQUIRED_CALLS);
        if(all_Calls_Are_Detected){
            arrayOfStudies= await readStudyList(argumentsArray);
            if($_GET("mapDbId")!==null){console.log($_GET("mapDbId"));$('select#selectionMap').hide();$('#labelSelectionMap').hide();}
            else{arrayOfMaps = await readMaps(argumentsArray);}
            let firstInformation = {};
            firstInformation.maps=arrayOfMaps;
            firstInformation.studies=arrayOfStudies;
            return firstInformation;
        }else{
            return null;
        }
	}catch (err){
		handleErrors('Bad URL')
	}
}

async function getCalls(argumentsArray){
	let myURL = argumentsArray.urlEndPoint + "/" + URL_CALLS;
	let myHeaders = new Headers();
	let Authorization = argumentsArray.token==='' ? '' : "Bearer " + argumentsArray.token;
	myHeaders = {Authorization};
	try {
    	let resp = await fetch(myURL, myHeaders);
	    resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	}
}

function callsAreInArray(resp, required_calls_array){
	let foundCalls = [];
	let result=false;
	resp.forEach(function(element){
		element.forEach(function(element2){foundCalls.push(element2.call);});
	});
	required_calls_array.forEach(function(element){
    	result = false;
	    for(i=0; i<foundCalls.length; i++){
	        if(foundCalls[i] === element){result = true;}
	    }
	});
	if (result) {console.log("All required calls are detected");}
	else{console.log("one or more required calls are not detected");}
	return result;
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
	     handleErrors(err); 
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
	     handleErrors(err); 
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
	     handleErrors(err); 
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
	     handleErrors(err); 
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
	     handleErrors(err);
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
		if(argumentsArray.isAnExport == true){matrixString += "&format=tsv&unknownString=MissingData";}
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
	     handleErrors(err); 
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
