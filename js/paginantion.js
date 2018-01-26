/**
 * Advance one page in the matrix
 * @function
 */
function nextPage(){
    if (startmentindex+=clientPageSize<sizeOfResquestedMatrix){
        startmentindex += clientPageSize;
        launchMatrixRequest(startmentindex);
    }else{
        startmentindex=parseInt(clientPageSize)*(totalPage-1);
        launchMatrixRequest(startmentindex);
    }
}

/**
 * Moves one page backwards in the matrix
 * @function
 */
function prevPage(){
    if(startmentindex-clientPageSize>=0){
        startmentindex -= clientPageSize;
        launchMatrixRequest(startmentindex);
    }else{
        startmentindex = 0;
        launchMatrixRequest(startmentindex)
    }
}

/**
 * Set the page size too another value
 * @function
 */
function setCustomPageSize(){
    if (parseInt($('#customPageSize').val())<5000){
        clientPageSize=parseInt($('#customPageSize').val())
    }else{
        clientPageSize=5000;
        $('#customPageSize').val(5000);
    }
}

/**
 * Set the index too another value
 * @function
 */
function setCustomIndex(){
    startmentindex = parseInt($('#customIndex').val()-1)*clientPageSize;
    if(startmentindex>=0 && startmentindex<=totalPage*clientPageSize){
        launchMatrixRequest(startmentindex);
    }else if(startmentindex<0){
        startmentindex=0;
        launchMatrixRequest(0);
    }else if(startmentindex>totalPage*clientPageSize){
        startmentindex = (selectedMarkers.length*selectedMarkersProfils.length)-(clientPageSize);
        launchMatrixRequest(startmentindex);
    }
}