async function ExportDetailsGermplasms(){
    let jsonHmap = [],  argumentsArray;
    let selectedGermplasms = $("#Germplasms option:selected").map(function(){return $(this).text().split(",");}).get();
    let germplasmId;
    let finalHmap = [];
    selectedGermplasms = removeAll(selectedGermplasms, "");
    console.log(selectedGermplasms);
    for(let i=0; i<selectedGermplasms.length; i++){
        germplasmId=selectedGermplasms[i];
        argumentsArray = {urlEndPoint, token, germplasmId};
        let resp = await getGermplasmsDetails(argumentsArray);
        jsonHmap[germplasmId]=resp.result;
    }
    console.log(jsonHmap);
    let fieldTab = getFieldFormJson(jsonHmap);
    console.log(fieldTab);
    let tsvString = buildTsvString(jsonHmap, selectedGermplasms, fieldTab);
    download('GermplasmsDetails.tsv',jsonHmap,tsvString);
}

function getFieldFormJson(HMap){
    let fieldTab = [];
    Object.keys(HMap).forEach(function(element){
        for(let key in HMap[element]){
            if(!isInArray(fieldTab,key) && key !== 'germplasmDbId'){
                fieldTab.push(key);
            }
        }
    });
    return fieldTab;
}

function buildTsvString(jsonHamp, selectedGermplasms, fieldTab){
    let tsvString = '';
    fieldTab.forEach(function (element){
       tsvString += element + '\t';
    });
    tsvString+='\n';
    selectedGermplasms.forEach(function (element){
        cpyResp[element].forEach(function(element2){
            tsvString+=(element2.germplasmDbId + "\t" + element2.markerProfileDbId + "\t");
        });
        fieldTab.forEach(function (element2){
            if(jsonHamp[element][element2]!==null && jsonHamp[element][element2]!== undefined){
                tsvString+= jsonHamp[element][element2] + '\t'
            }else{
                tsvString+='\t';
            }
        });
        tsvString+='\n';
    });
    console.log(tsvString);
    return tsvString;
}

function download(filename,hmap, tsvData) {
    let element = document.createElement('a');
    let text;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tsvData));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
