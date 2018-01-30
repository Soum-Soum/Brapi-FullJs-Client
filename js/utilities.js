/**
 * Return true if value is present in the table, wrong if not
 * @function
 * @param {array} array - The array you want to scan.
 * @param {string} value - The value you search .
 */
function isInArray(array, value){
	for (let i = 0; i < array.length; i++) {
		if (array[i]==value){
			return true;
		}
	}
	return false;
}

/**
 * Stop the program for a given period of time
 * @function
 * @param {int} ms - The number of ms you want to wait befor the resolution of the promise .
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns the standard header
 * @function
 * @param {strint} token - A token.
 */
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

/**
 * Allows you to get information from the url of the page
 * @function
 * @param {string} param - The tag you want to check.
 */
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

/**
 * Remove all occurrence of a value from an array
 * @function
 * @param {array} array - The array you want to scan.
 * @param {string} value - The value you want to remove .
 */
function removeAll(array, value){
	for (let i = 0; i < array.length; i++) {
		if (array[i]===value) {
			array.splice(i,1);
			i--;
		}
	}
	return array;
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

/**
 * Set up the argumentArray for the call you want to call
 * @function
 * @param {string} callName - The call you want to call
 * @param {Array} argumentsArray - Array containing the parameters required by the function
 */
function setArgumentArray(callName, argumentsArray){
	if(argumentsArray=== undefined || argumentsArray === null){
        let argumentsArray = [];
        if(call2UrlTab[currentGroupId][callName]!== undefined){
            argumentsArray.urlEndPoint = call2UrlTab[currentGroupId][callName].split(';')[0];
            argumentsArray.token = call2UrlTab[currentGroupId][callName].split(';')[1];
            return argumentsArray;
        }else{
            return[]
        }
	}else if(call2UrlTab[currentGroupId][callName]!== undefined){
        argumentsArray.urlEndPoint = call2UrlTab[currentGroupId][callName].split(';')[0];
        argumentsArray.token = call2UrlTab[currentGroupId][callName].split(';')[1];
        return argumentsArray;
    }else{
	    return [];
    }
}

/**
 * Abort the export of datamatrix
 * @function
 */
function abortExport(){
    exportIsAbort = true;
}

/**
 * Abort the export of Germplasms Details tsv
 * @function
 */
function abortGermplasmsExport() {
    exportGermplasmsIsAbort = true;
}

/**
 * Get type list from a marker tab
 * @function
 * @param {array} arrayMarker - Marker table
 */
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

/**
 * Return intersection of 2 array
 * @function
 */
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

/**
 * Return the hash of a string
 */
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

function StringBuffer() {
    this.buffer = [];
}
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};
