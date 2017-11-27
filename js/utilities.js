function isInArray(array, a){
	for (let i = 0; i < array.length; i++) {
		if (array[i]===a){
			return true;
		}
	}
	return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function returnInit(token){
	let myHeaders = new Headers();
	myHeaders = token==='' ? {} : {'Authorization': 'Bearer '+token};
    return {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
}

function $_GET(param) {
    let vars = {};
    window.location.href.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function (m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
    );
    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

function removeAll(tab, val){
	for (let i = 0; i < tab.length; i++) {
		if (tab[i]===val) {
			tab.splice(i,1);
			i--;
		}
	}
	return tab;
}

function sortAlphaNum(a,b) {
	let reA = /[^a-zA-Z]/g;
	let reN = /[^0-9]/g;
    let aA = a.replace(reA, "");
    let bA = b.replace(reA, "");
    if(aA === bA) {
        let aN = parseInt(a.replace(reN, ""), 10);
        let bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}

function callsAreInArray(resp, requCall){
    try {
        let foundCalls = [];
        console.log(resp);
        removeAll(resp, undefined);
        removeAll(resp, null);
        resp.forEach(function (element){
            element.result.data.forEach(function (element2){
                if(!isInArray(foundCalls, element2.call)){
                    foundCalls.push(element2.call);
                }
            });
        });
        requCall.forEach(function (element){
            if(!isInArray(foundCalls, element)){
                console.log(false);
                return false;
            }
        });
        return true;
    }catch(err){
        handleErrors('Bad Url')
    }

}

function setArgumentArray(callName, argumentsArray){
	if(argumentsArray=== undefined || argumentsArray === null){
        let argumentsArray = [];
        argumentsArray.urlEndPoint = Call2Url[callName];
        argumentsArray.token = url2Token[Call2Url[callName]];
        return argumentsArray;
	}else{
        argumentsArray.urlEndPoint = Call2Url[callName];
        argumentsArray.token = url2Token[Call2Url[callName]];
        return argumentsArray;
    }
}

function abortExport(){
    isAbort = true;
}

function getTypeList(arrayMarker){
    console.log(arrayMarker);
    let arrayMarkerType =[];
    for(let i=0; i<arrayMarker.length;i++){
        for(let j=0; j<arrayMarker[i].length; j++){
            if(arrayMarker[i][j].type !== undefined && arrayMarker[i][j].type !== null && !isInArray(arrayMarkerType, arrayMarker[i][j].type)){
                arrayMarkerType.push(arrayMarker[i][j].type);
            }
        }
    }
    console.log(arrayMarkerType);
    return arrayMarkerType;
}