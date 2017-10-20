const URL_CALLS = "calls";
const URL_MAPS = "maps";
const URL_STUDIES = "studies-search";
const URL_MARKERS = "markers";
const URL_MARKER_PROFILES = "markerprofiles";
const URL_ALLELE_MATRIX = "allelematrix-search";
const URL_TOKEN="token";
const REQUIRED_CALLS = new Array(URL_MAPS, URL_MARKERS, URL_STUDIES, URL_MARKER_PROFILES, URL_ALLELE_MATRIX);

async function getToken(stringUserId, stringPassword, urlEndPoint){
	var myURL = urlEndPoint + "/" + URL_TOKEN, tokenString="";
	var body = {username : stringUserId, password : stringPassword}
	body = JSON.stringify(body);
	try {
    	var resp = await fetch(myURL,{method: "POST",body: body, headers: {'Content-Type': 'application/json'}});
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
	try{
		resp =  await fetch(brapiEndPoint + "/" + URL_MAPS + "/" + mapDbId);
	}catch(err){
		handleErrors("Bad map id in Url");
		return false;
	}
	return true;
}

async function urlBrapiEndPointIsOk(brapiEndPoint){
	try{
        let resp = await fetch(brapiEndPoint + "/" + URL_CALLS);
    }catch(err){
		handleErrors("Bad barpi end point in Url");
		return false;
	}
	return true;
}

async function getFirstInformation(argumentsArray){
    let arrayOfStudies, arrayOfMaps = [];
    paginationManager = new PaginationManager(0);
    let calls = await paginationManager.pager(getCalls, argumentsArray);
    let all_Calls_Are_Detected = callsAreInArray(calls, REQUIRED_CALLS);
    if(all_Calls_Are_Detected){
		arrayOfStudies= await readStudyList(argumentsArray);
		if($_GET("mapDbId")!==null){console.log($_GET("mapDbId"));$('select#selectionMap').hide();$('#labelSelectionMap').hide();}
		else{arrayOfMaps = await readMaps(argumentsArray);}	
		var firstInformation = new Object();
		firstInformation.maps=arrayOfMaps;
		firstInformation.studies=arrayOfStudies;
		return firstInformation;
	}else{
		return;
	}
}

async function getCalls(argumentsArray){
	var myURL = argumentsArray.urlEndPoint + "/" + URL_CALLS;
	var myHeaders = new Headers();
	var Authorization = "Bearer " + argumentsArray.token;
	myHeaders = {Authorization}
	try {
    	var resp = await fetch(myURL, myHeaders);
	    resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	}
}

function callsAreInArray(resp, required_calls_array){
	var foundCalls = new Array();
	var result=false;
	resp.forEach(function(element){
		element.forEach(function(element2){foundCalls.push(element2.call);});
	});
	required_calls_array.forEach(function(element){
    	result = false;
	    for(i=0; i<foundCalls.length; i++){
	        if(foundCalls[i] == element){result = true;}
	    }
	});
	if (result) {console.log("All required calls are detected");}
	else{console.log("one or more required calls are not detected");}
	return result;
}

async function readMaps(argumentsArray){
	var myURL = argumentsArray.urlEndPoint + "/" + URL_MAPS;
	var foundMaps = new Array();
	var myInit = returnInit(argumentsArray.token);
    try {
    	var resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		resp.result.data.forEach(function(element){foundMaps.push(element);});
		return foundMaps;
	}
	catch(err) {
	     handleErrors(err); 
	}  
}

async function readStudyList(argumentsArray){
	var myURL = argumentsArray.urlEndPoint + "/" + URL_STUDIES + "?studyType=genotype";
	var foundStudies = new Array();
	var myInit = returnInit(argumentsArray.token);
    try {
    	var resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		resp.result.data.forEach(function(element){foundStudies.push(element);});
		return foundStudies;
	}
	catch(err) {
	     handleErrors(err); 
	}    
}

async function getmarkerProfileDbId(argumentsArray){
	if(argumentsArray.askedPage == null){var myURL = argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES;}
	else{var myURL = argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES +"?page="+argumentsArray.askedPage;}
	var myURL = argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES + "?" + argumentsArray.askedPage;
	var myInit = returnInit(argumentsArray.token);
	try {
		var resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		return resp;;
	}
	catch(err) {
	     handleErrors(err); 
	} 
}

async function getMarkers(argumentsArray){
	if(argumentsArray.askedPage == null){var myURL = argumentsArray.urlEndPoint + "/" + URL_MARKERS;}
	else{var myURL = argumentsArray.urlEndPoint + "/" + URL_MARKERS +"?page="+argumentsArray.askedPage;}
	var myInit = returnInit(argumentsArray.token);
	try {
		console.log(myURL);
		var resp = await fetch(myURL, myInit);
    	resp = await resp.json();
		return resp;	
	}
	catch(err) {
	     handleErrors(err); 
	} 
}

async function getMapDetails(argumentsArray){
	var myURL=argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap;
	var myInit = returnInit(argumentsArray.token);
	try {
		var resp = await fetch(myURL, myInit);
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	} 
}

async function getMarkersPosition(argumentsArray){
	if(argumentsArray.askedPage==null){var myURL=argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap+"/positions";}
	else{var myURL = argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap+"/positions?page="+argumentsArray.askedPage;}
	var myInit = returnInit(argumentsArray.token);
	console.log(myURL);
	
	try {
		var resp = await fetch(myURL, myInit);
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	}
}

async function getMatrix(argumentsArray){
	if(argumentsArray.askedPage==null){ myURL = argumentsArray.urlEndPoint + "/" +URL_ALLELE_MATRIX;}
	else{ myURL = argumentsArray.urlEndPoint + "/" +URL_ALLELE_MATRIX+"?pageSize="+argumentsArray.clientPageSize+"&page="+argumentsArray.askedPage;}
	var matrixString = "";
	for(i=0;i<argumentsArray.sendedMarkersProlis.length; i++){
		matrixString+= 'markerprofileDbId=' + argumentsArray.sendedMarkersProlis[i] + '&';
	}
	for(i=0;i<argumentsArray.sendedMarkers.length; i++){
		matrixString+= (i==0 ? '' : '&') + 'markerDbId=' +argumentsArray.sendedMarkers[i];
	}
	if(argumentsArray.isAnExport == true){matrixString += "&format=tsv&unknownString=N";}
	var myHeaders = new Headers();
	myHeaders = {'Authorization': 'Bearer '+argumentsArray.token,
				 'Content-Type':'application/x-www-form-urlencoded'
				}	
	try {
		console.log(myURL);
    	var resp = await fetch(myURL,{method: "POST",body: matrixString, headers: myHeaders});
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors(err); 
	}
}

async function getExportStatus(argumentsArray){
	var myURL = argumentsArray.urlEndPoint + "/" + URL_ALLELE_MATRIX + "/status/" + argumentsArray.asynchid;
	var myInit = returnInit(argumentsArray.token);
	var resp = await fetch(myURL, myInit)
	try{
		console.log(myURL);
		var resp = await fetch(myURL, myInit)
	}catch(err){
		handleErrors(err);
	}
	resp = await resp.json();
	console.log(resp);
	console.log(argumentsArray.asynchid);
	console.log(myURL);
	try {
    	while(resp.metadata.status[0].message=="INPROCESS"){
			console.log(myURL);
			resp = await fetch(myURL, myInit);
			resp = await resp.json();
			console.log(resp.metadata.pagination.currentPage);
			$('#EvolutionLoadingScreen').html("Loading : " + resp.metadata.pagination.currentPage + "%");
			await sleep(1500);	
		}
		console.log(resp);
		window.location = resp.metadata.datafiles[0];
	}
	catch(err) {
	     handleErrors(err); 
	}
	$.modal.close();
}
