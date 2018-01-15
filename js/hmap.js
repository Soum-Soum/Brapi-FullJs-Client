function getMarkerProfileHmap(arrayGermplasmsIDs){
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

function reversHmap(hMap){
    let newHMap = [];
    Object.keys(hMap).forEach(function(element){
        for(let i=0; i<hMap[element].length;i++){
            newHMap[hMap[element][i].markerProfileDbId]=element;
        }
    });
    return newHMap;
}

function bindCall2Url(resp, calls) {
    console.log(resp);
    for(let i=0; i<resp.length; i++){
        let hmapCall2Url=[];
        for(let j=0; j<resp[i].length;j++) {
            calls.forEach(function (element) {
                if (isInArray(resp[i][j].callsImplemented, element)) {
                    hmapCall2Url[element] = resp[i][j].url + ';' + resp[i][j].token;
                }
            });
        }
        call2UrlTab.push(hmapCall2Url);
    }
}

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