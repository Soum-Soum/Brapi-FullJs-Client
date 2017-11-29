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

function createUrl2Token(urlEndPoint1, tokenUrl1, urlEndPoint2, tokenUrl2) {
    let url2Token =[];
    url2Token[urlEndPoint1]=tokenUrl1;
    if(urlEndPoint2!==undefined && urlEndPoint2!== '' && urlEndPoint2!== null && tokenUrl2!==null &&  tokenUrl2!==undefined){
        url2Token[urlEndPoint2]=tokenUrl2;
    }
    return url2Token;
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
    return hmapCall2Url;
}

function setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers){
    hmapsLinkageGroup=null;
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

function setHmapType(arrayMarkers){
    hmapsType = [];
    for (let i = 0; i < arrayMarkers.length; i++) {
        for (let j = 0; j < arrayMarkers[i].length; j++) {
            for (let k = 0; k < arrayMarkers[i][j].length; k++) {
                hmapsType[arrayMarkers[i][j][k].markerDbId]=arrayMarkers[i][j][k].type;
            }
        }
    }
    return hmapsType;
}