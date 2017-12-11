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

function setArgumentArray(callName, argumentsArray){
    console.log(Call2Url);
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
    exportIsAbort = true;
}

function abortGermplasmsExport() {
    exportGermplasmsIsAbort = true;
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

function array_big_intersect () {
    let args = Array.prototype.slice.call(arguments), aLower = [], aStack = [],
        count, i,nArgs, nLower,
        oRest = {}, oTmp = {}, value,
        compareArrayLength = function (a, b) {
            return (a.length - b.length);
        },
        indexes = function (array, oStack) {
            let i = 0,
                value,
                nArr = array.length,
                oTmp = {};
            for (; nArr > i; ++i) {
                value = array[i];
                if (!oTmp[value]) {
                    oStack[value] = 1 + (oStack[value] || 0); // counter
                    oTmp[value] = true;
                }
            }
            return oStack;
        };
    args.sort(compareArrayLength);
    aLower = args.shift();
    nLower = aLower.length;
    if (0 === nLower) {
        return aStack;
    }
    nArgs = args.length;
    i = nArgs;
    while (i--) {
        oRest = indexes(args.shift(), oRest);
    }
    for (i = 0; nLower > i; ++i) {
        value = aLower[i];
        count = oRest[value];
        if (!oTmp[value]) {
            if (nArgs === count) {
                aStack.push(value);
                oTmp[value] = true;
            }
        }
    }
    return aStack;
}

String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

