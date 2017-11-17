function trasform_matrix(matrix){
	let hmapMatrix = [];
	matrix.forEach(function(element){
		element.forEach(function(element2){
            hmapMatrix[element2[0]+'/'+element2[1]]=element2[2];
		});		
	});
	return hmapMatrix;
}

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

function getMarkerProfileHmap(arrayGermplasmsIDs){
	console.log(arrayGermplasmsIDs);
	let hmap=[], alreadyTreated = [];
	for (let i = 0; i < arrayGermplasmsIDs.length; i++) {
		for (let j = 0; j < arrayGermplasmsIDs[i].length; j++) {
			if(!isInArray(alreadyTreated, arrayGermplasmsIDs[i][j].germplasmDbId)){
				alreadyTreated.push(arrayGermplasmsIDs[i][j].germplasmDbId);
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId]=[];
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId].push(arrayGermplasmsIDs[i][j]);
			}else{
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId].push(arrayGermplasmsIDs[i][j]);
			}
		}
	}
	return hmap;
}

function createUrl2Token(urlEndPoint1, tokenUrl1, urlEndPoint2, tokenUrl2) {
	let url2Token =[];
	url2Token[urlEndPoint1]=tokenUrl1;
	if(urlEndPoint2!==undefined && urlEndPoint2!== '' && urlEndPoint2!== null && tokenUrl2!==null &&  tokenUrl2!==undefined){
        url2Token[urlEndPoint2]=tokenUrl2;
	}
	console.log(url2Token);
	return url2Token;
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

function reversHmap(hMap){
	let newHMap = [];
	Object.keys(hMap).forEach(function(element){
		for(let i=0; i<hMap[element].length;i++){
            newHMap[hMap[element][i].markerProfileDbId]=element;
		}
	});
	return newHMap;
}

function callsAreInArray(resp, requCall){
    let foundCalls = [];
    console.log(resp);
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
}

function bindCall2Url(resp, calls) {
	let callUrl1= [], callUrl2=[], hmapCall2Url=[];
    resp[0].result.data.forEach(function (element){
    	callUrl1.push(element.call);
    });
    if(resp[1]!=undefined){
        resp[1].result.data.forEach(function (element){
            callUrl2.push(element.call);
        });
	}
    calls.forEach(function (element){
		if(isInArray(callUrl1, element)){
            hmapCall2Url[element]=urlEndPoint1;
		}else if(callUrl2!==[] && isInArray(callUrl2, element)){
			hmapCall2Url[element]=urlEndPoint2;
		}else{
			hmapCall2Url[element]="";
		}
    });
    console.log(hmapCall2Url);
    return hmapCall2Url;
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