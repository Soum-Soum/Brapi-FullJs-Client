/**
 * Get a Token.
 * @async
 * @function
 * @param {string} stringUserName - The User Name.
 * @param {string} stringPassword - The Password.
 * @param {string} urlEndPoint - The brapi endpoint.
 */
async function getToken(stringUserName, stringPassword, urlEndPoint){
	let myURL = urlEndPoint + "/" + URL_TOKEN, tokenString="";
	let body = {username : stringUserName, password : stringPassword};
	body = JSON.stringify(body);
	try {
    	let resp = await fetch(myURL,{method: "POST",body: body, headers: {'Content-Type': 'application/json'}});
    	if (resp.status>199 && resp.status<300){
		tokenString = await resp.json();
		return tokenString.access_token;
		}else{return tokenString;}
	}
	catch(err) {
	    handleErrors('Impossible to take one tokenUrl');
	}
}

/**
 * Check the map coming from the url.
 * @async
 * @function
 * @param {string} brapiEndPoint - The brapi endpoint.
 * @param {string} mapDbId - The Password.
 */
async function urlMapIdIsOk(brapiEndPoint, mapDbId){
    try {
        await fetch(brapiEndPoint + "/" + URL_MAPS + "/" + mapDbId);
    } catch (err) {
        handleErrors("Bad map id in Url");
        return false;
    }
	return true;
}

/**
 * Check the brapiEndPoint coming from the url.
 * @async
 * @function
 * @param {string} brapiEndPoint - The brapi endpoint.
 */
async function urlBrapiEndPointIsOk(brapiEndPoint){
	try{
        let reponse = await fetch(brapiEndPoint + "/" + URL_CALLS);
        if(!reponse.ok){
            handleErrors("Bad barpi end point in Url");
            return false;
		}
    }catch(err){
		handleErrors("Bad barpi end point in Url");
		return false;
	}
	return true;
}

/**
 * Get the liste of call implemented by the brapi endpoint you passed
 * @async
 * @function
 * @param {urlWithAuth} urlWithToken - The Url
 */
async function getCalls(urlWithToken){
        let myURL1 = urlWithToken.url + "/" + URL_CALLS;
        let myHeaders1 = new Headers();
        let Authorization = urlWithToken.token==='' ? '' : "Bearer " + urlWithToken.tokenUrl1;
        myHeaders1 = {Authorization};
		try{
			let resp1 = await fetch(myURL1, myHeaders1);
			resp1 = await resp1.json();
			return resp1.result.data;
		}catch(err){
			handleErrors('Bad Url');
		}

}

/**
 * Return the list of maps for a given url
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
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

/**
 * Return the list of studies for a given url
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
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

/**
 * Return the list of Marker Profile for a given url
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
async function getmarkerProfileDbId(argumentsArray){
    let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES + "?studyDbId=" + argumentsArray.selectedStudy : argumentsArray.urlEndPoint + "/" + URL_MARKER_PROFILES +"?page="+argumentsArray.askedPage + "&studyDbId=" + argumentsArray.selectedStudy;
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

/**
 * Return the list of Marker for a given url
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
async function getMarkers(argumentsArray){
    let myURL = argumentsArray.askedPage===undefined ? argumentsArray.urlEndPoint + "/" + URL_MARKERS : argumentsArray.urlEndPoint + "/" + URL_MARKERS +"?page="+argumentsArray.askedPage ;
    if(argumentsArray.askedType !== undefined && argumentsArray.askedType !== null){
		myURL += '&type=' + argumentsArray.askedType;
	}
	if(argumentsArray.pageSize !== undefined && argumentsArray.pageSize !== null){
        myURL += '&pageSize=' + argumentsArray.pageSize;
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

/**
 * Return the details for a given map
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
async function getMapDetails(argumentsArray){
	let myURL=argumentsArray.urlEndPoint+"/"+URL_MAPS+"/"+argumentsArray.selectedMap;
	let myInit = returnInit(argumentsArray.token);
	try {
		let resp = await fetch(myURL, myInit);
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors('unable to get map details');
	} 
}

/**
 * Return the list of Marker Position for a given url
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
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

/**
 * Return the data matrix for a given marker list/ marker profile list
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
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
			matrixString+= (i===0 ? '' : '&') + 'markerDbId=' +argumentsArray.sendedMarkers[i];
		}
		matrixString+='&unknownString=';
		if(argumentsArray.isAnExport === true){matrixString += "&format=tsv";}
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
/*		// console.log(matrixString);*/
    	let resp = await fetch(myURL,{method: "POST",body: matrixString, headers: myHeaders});
		resp = await resp.json();
		return resp;
	}
	catch(err) {
	     handleErrors('impossible to load call matix');
	}
}

/**
 * Function responsible for exporting the matrix
 * @async
 * @exports allelematrix
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
async function getExportStatus(argumentsArray){
    let l = Ladda.create( document.querySelector( '#Export'));
    try {
        l.start();
		let myURL = argumentsArray.urlEndPoint + "/" + URL_ALLELE_MATRIX + "/status/" + argumentsArray.asynchid;
		let myInit = returnInit(argumentsArray.token);
		let resp = await fetch(myURL, myInit);
		resp = await resp.json();
		console.log(resp);
		console.log(argumentsArray.asynchid);
		console.log(myURL);
		while(resp.metadata.status[0].message==="INPROCESS" && exportIsAbort===false){
			console.log(myURL);
			console.log(resp.metadata.status[0].message);
			resp = await fetch(myURL, myInit);
			resp = await resp.json();
			console.log(resp.metadata.pagination.currentPage);
			l.setProgress(resp.metadata.pagination.currentPage/100);
			console.log(resp.metadata.pagination.currentPage/100);
			await sleep(1500);
		}
		if(exportIsAbort===false && resp.metadata.status[0].message!=="FAILED"){
            console.log(resp);
            l.setProgress(1);
            window.location = resp.metadata.datafiles[0];
		}
	}
	catch(err) {
		handleErrors('unable to export data');
	}
    $('#AbortExport').hide();
    l.stop();
}

/**
 * Return the details for a given Germplasms
 * @async
 * @function
 * @param {array} argumentsArray - Array containing the parameters required by the function
 */
async function getGermplasmsDetails(argumentsArray){
    try{
        let myURL = argumentsArray.urlEndPoint + "/germplasm-search";//?germplasmDbId=";
        let temp = {germplasmDbIds : argumentsArray.germplasmIdArray};
        let myHeaders = new Headers();
        temp = JSON.stringify(temp);
        if(argumentsArray.token!=='""'){
            myHeaders = {'Authorization': 'Bearer '+argumentsArray.token,
                'Content-Type': 'application/json'
            };
        }else {
            myHeaders = {
                'Content-Type': 'application/json'
            };
        }
        let resp = await fetch(myURL,{method: "POST",body: temp, headers: myHeaders});
        return await resp.json();
	}catch (err){
		handleErrors('unable to export data');
	}

}
