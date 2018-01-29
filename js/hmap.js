/**
 * Generate germplasmDbId to germplasm Hmap
 * @function
 * @param {Array} arrayGermplasms - Array of germplasm
 */
function getMarkerProfileHmap(arrayGermplasms){
    let hmap=[], alreadyTreated = [];
    for (let i = 0; i < arrayGermplasms.length; i++) {
        for (let j = 0; j < arrayGermplasms[i].length; j++) {
            if(!isInArray(alreadyTreated, arrayGermplasms[i][j].germplasmDbId)){
                alreadyTreated.push(arrayGermplasms[i][j].germplasmDbId);
                hmap[arrayGermplasms[i][j].germplasmDbId]=[];
                hmap[arrayGermplasms[i][j].germplasmDbId].push(arrayGermplasms[i][j]);
            }else{
                hmap[arrayGermplasms[i][j].germplasmDbId].push(arrayGermplasms[i][j]);
            }
        }
    }
    return hmap;
}


/**
 * Revers any hmap;
 * @function
 * @param {Array} hMap- The current Hmap.
 */
function reversHmap(hMap){
    let newHMap = [];
    Object.keys(hMap).forEach(function(element){
        for(let i=0; i<hMap[element].length;i++){
            newHMap[hMap[element][i].markerProfileDbId]=element;
        }
    });
    return newHMap;
}

/**
 * Generate call to url hmap
 * @function
 * @param {Array} resp - result of getCall function
 * @param {Array} calls - Url tab
 */
function bindCall2Url(resp, calls) {
    call2UrlTab=[];
    console.log(resp);
    for(let i=0; i<resp.length; i++){
        let hmapCall2Url=[];
        for(let j=0; j<resp[i].length;j++) {
            /*for(let k=0; k<calls.length; k++){
                if (isInArray(resp[i][j].callsImplemented, calls[k])) {
                    hmapCall2Url[calls[k]] = resp[i][j].url + ';' + resp[i][j].token;
                }
            }*/
            calls.forEach(function (element) {
                if (isInArray(resp[i][j].callsImplemented, element)) {
                    hmapCall2Url[element] = resp[i][j].url + ';' + resp[i][j].token;
                }
            });
        }
        call2UrlTab.push(hmapCall2Url);
    }
}

/**
 * Generate LinkageGroup to Marker Hmap
 * @function
 * @param {Array} arrayOfLinkageGroup - All LinkageGroup
 * @param {Array} arrayMarkers - All Markers
 */
function setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers){
    hmapsLinkageGroup=[];
    for(let i =0; i<arrayOfLinkageGroup.length; i++){
        hmapsLinkageGroup[arrayOfLinkageGroup[i]]=[];
    }
    for (let i = 0; i < arrayMarkers.length; i++) {
        for (let j = 0; j < arrayMarkers[i].length; j++) {
            hmapsLinkageGroup[arrayMarkers[i][j].linkageGroup].push(arrayMarkers[i][j].markerDbId);
        }
    }
}

/**
 * Generate Type to Marker Hmap
 * @function
 * @param {Array} arrayOfMarkersType - All Marker Type
 * @param {Array} arrayMarkers - All Markers
 */
function setHmapType(arrayOfMarkersType,arrayMarkers){
    hmapsType = [];
    for(let i =0; i<arrayOfMarkersType.length; i++){
        hmapsType[arrayOfMarkersType[i]]=[];
    }
    for (let i = 0; i < arrayMarkers.length; i++) {
        for (let j = 0; j < arrayMarkers[i].length; j++) {
            for (let k = 0; k < arrayMarkers[i][j].length; k++) {
                hmapsType[arrayMarkers[i][j][k].type].push(arrayMarkers[i][j][k].markerDbId);
            }
        }
    }
    console.log(hmapsType);
    return hmapsType;
}