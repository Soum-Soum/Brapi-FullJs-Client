/**
 * fill result table
 * @function
 * @param {Array} sendedMarkers - Matrix marker list
 * @param {Array} sendedMarkersProlis - Matrix marker-profil list
 * @param {Array} response - The response to getMatrix function
 */
function fill_result_table(sendedMarkers,sendedMarkersProlis,response) {
    $('table').show();
    let htmlString="";
    console.log(sendedMarkers);
    console.log(sendedMarkersProlis);
    for(let i=0;i<sendedMarkersProlis.length;i++){
        for(let j=0;j<sendedMarkers.length;j++){
            htmlString += '<tr><td>'+sendedMarkers[j]+'</td><td>'+markerDetailsHmap[sendedMarkers[j]]+'</td><td>'+response[sendedMarkersProlis[i]]+'</td><td>'+sendedMarkersProlis[i]+'</td><td id="'+(sendedMarkers[j]+sendedMarkersProlis[i]).hashCode()+'"></td></tr>';
        }
    }
    $("#resulttable").find("> tbody").html(htmlString);
}

/**
 * Remove missing data from result tab
 * @function
 * @param {Array} sendedMarkers - Matrix marker list
 * @param {Array} sendedMarkersProlis - Matrix marker-profil list
 */
function cleanTab(sendedMarkers,sendedMarkersProlis){
    for(let i=0;i<sendedMarkersProlis.length;i++){
        for(let j=0;j<sendedMarkers.length;j++){
            let id = '#' + (sendedMarkers[j]+sendedMarkersProlis[i]).hashCode();
            let temp = $(id);
            if(temp.text()===''){
                temp.parent().remove();
            }
        }
    }
}

/**
 * insert matrix in result table
 * @function
 * @param {Array} sendedMarkers - Matrix marker list
 * @param {Array} sendedMarkersProlis - Matrix marker-profil list
 * @param {Array} response - The response to getMatrix function
 */
function insetMatrixInResultTable(matrix){
    for(let i=0; i<matrix.length;i++){
        matrix[i].forEach(function (element) {
            let tempString = (element[0]+element[1]).hashCode();
            $('#'+tempString).text(element[2]);
        });
    }
}

/**
 * Set result table empty
 * @function
 */
function  enmptResultTab(){
    $('tbody').html('');
}
