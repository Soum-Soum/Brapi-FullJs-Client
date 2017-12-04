function setup_select_tag(first_informations){
	let htmlString ="";
	if($_GET("mapDbId")===null){
		first_informations.maps.forEach(function(element){
		htmlString += '<option value="' + element.mapDbId + '">' + element.name + '</option>\n';
    });
    $('select#selectionMap').html(htmlString);
	}	
    htmlString='<option value="">---Select one---</option>';
    first_informations.studies.forEach(function(element){
    	htmlString += '<option value="' + element.studyDbId + '">' + element.name + '</option>\n';
    });
    $('select#selectionStudies').html(htmlString);
}

function setEmptyTheFields(){
	$("#MarkersProfils").html("");
	$("#typeMarker").html("");
	$("#chromosome").html("");
	$("#Markers").html("");
	$('#Germplasms').html("");
	$('#labelGermplasms').hide();
    $('#markerProfileLabel').hide();
    $('#typeLabel').hide();
    $('#chromosomeLabel').hide();
    $('#markersLabel').hide();
    $('#topMarkerDiv').hide();
    $('#topTypeDiv').hide();
}

function setUpGermplasms(response){
	let htmlString ="";
	Object.keys(response).forEach(function(element){
        let valueString = "";
        for (let i = 0; i < response[element].length; i++) {
			valueString+=response[element][i].markerProfileDbId + ",";
		}
		htmlString +='<option selected value="'+valueString+'">'+element+'</option>\n';
	});
	$('select#Germplasms').html(htmlString);
	updateSelection('labelGermplasms','Germplasms');
}

function setUpMarkerProfils(){
    let selectedGermplasms = $("select#Germplasms option:selected").map(function () {
        return $(this).val().split(",");
    }).get();
    selectedGermplasms=removeAll(selectedGermplasms,"");
	let htmlString="";
	selectedGermplasms.forEach(function(element){
		htmlString +='<option selected value="'+element+'">'+element+'</option>\n';
	});
	$('#MarkersProfils').html(htmlString);
    updateSelection('markerProfileLabel','MarkersProfils');
	if ($('#MarkersProfils>option').length===$('#Germplasms>option:selected').length){
		$('#MarkersProfils').attr("disabled", true);
	}else{
		$('#MarkersProfils').attr("disabled", false);
	}
}

function setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType){
	arrayOfLinkageGroup.sort(sortAlphaNum);
    let htmlString="";
    arrayOfLinkageGroup.forEach(function(element){
		htmlString += '<option value="' + element+ '">' + element+ '</option>';
    });
    $('select#chromosome').html(htmlString);
    updateSelection('chromosomeLabel','chromosome');
    htmlString="";
    arrayOfMarkersType.forEach(function(element){
		htmlString += '<option selected value="' + element+ '">' + element+ '</option>';
    });
    $('select#typeMarker').html(htmlString);
}

function setupMarkersId(arrayMarkersIds){
	if (arrayMarkersIds.length<=10000) {
		$('#Markers').show();
		$('#numberOfMarkers').hide();
		$('#labelToHide').show();
        $('#markersLabel').show();
        $('#topMarkerDiv').hide();
		let htmlString ="";
		arrayMarkersIds.forEach(function(element){
			htmlString +='<option selected value="'+element+'">'+element+'</option>\n';
		});
		$('#Markers').html(htmlString);
        updateSelection('markersLabel','Markers');
	}else{
		$('#Markers').html("");
		$('#markersLabel').hide();
		$('#numberOfMarkers').html(arrayMarkersIds.length);
		$('#numberOfMarkers').show();
		$('#topMarkerDiv').show();
	}
}

function fill_result_table(sendedMarkers,sendedMarkersProlis,response) {
    $('table').show();
    let htmlString="";
    console.log(sendedMarkers);
    console.log(sendedMarkersProlis);
    for(let i=0;i<sendedMarkersProlis.length;i++){
    	for(let j=0;j<sendedMarkers.length;j++){
            htmlString += '<tr><td>'+sendedMarkers[j]+'</td><td>'+response[sendedMarkersProlis[i]]+'</td><td>'+sendedMarkersProlis[i]+'</td><td id="'+sendedMarkers[j]+'--'+sendedMarkersProlis[i]+'"></td></tr>';
		}
	}
    $("#resulttable").find("> tbody").html(htmlString);
}

function cleanTab(sendedMarkers,sendedMarkersProlis){
    for(let i=0;i<sendedMarkersProlis.length;i++){
        for(let j=0;j<sendedMarkers.length;j++){
            let id = '#' + sendedMarkers[j]+'--'+sendedMarkersProlis[i];
            let temp = $(id);
            if(temp.text()===''){
                temp.parent().remove();
            }
        }
    }
}

function insetMatrixInResultTable(matrix){
    for(let i=0; i<matrix.length;i++){
        matrix[i].forEach(function (element) {
			let tempString = element[0] + '--' + element[1];
			$('#'+tempString).text(element[2]);
        });
    }
}

function updateSelection(idLabel, idSelect){
	let nbSelectionOption = $('#'+idSelect+" option:selected").map(function(){return $(this).val().split(",");}).get();
	nbSelectionOption = removeAll(nbSelectionOption, "");
	nbSelectionOption=nbSelectionOption.length;
	let nbOption = $('#'+idSelect+" option").map(function(){return $(this).val().split(",");}).get();
	nbOption = removeAll(nbOption,"");
	nbOption=nbOption.length;
	$('#'+idLabel).text(nbSelectionOption + ' / ' + nbOption);
    $('#'+idLabel).show();
}

function setloader(){
	$('#loadingScreen').show();
	$('#loadingScreen').modal({
		escapeClose: false,
        closeExisting: false,
		clickClose: false,
		showClose: false
	});
}

async function handleErrors(err) {
	if (typeof err === "string"){
		$('#ErrorMessage').show();
	    $('#ErrorMessage').text(err);
	    await sleep(3000);
	    $('#ErrorMessage').hide();
	}else{
		$('#ErrorMessage').show();
	    $('#ErrorMessage').text(err.message);
	    await sleep(3000);
	    $('#ErrorMessage').hide();
	}
}

function setDisabled(bool){
    $('#selectionMap').prop('disabled', bool);
    $('#selectionStudies').prop('disabled', bool);
    $('#Search').prop('disabled', bool);
    $('#Export').prop('disabled', bool);
    $('#ExportGermplasmsTsv').prop('disabled', bool);
    $('#ExportGermplasmsDetails').prop('disabled', bool);
}

function animatForm(){
	if($('#Use2Url').is(':checked')){
        $('#UserId2').show();
        $('#Password2').show();
        $('#urltoget2').show();
        $('#UserId2').addClass('animated bounceInRight');
        $('#Password2').addClass('animated bounceInRight');
        $('#urltoget2').addClass('animated bounceInRight');
	}else{
        $('#UserId2').hide(300);
        $('#Password2').hide(300);
        $('#urltoget2').hide(300);
        $('#UserId2').removeClass('animated bounceInRight');
        $('#Password2').removeClass('animated bounceInRight');
        $('#urltoget2').removeClass('animated bounceInRight');
	}
}

function setMainFormVisible(){
    $('#mainForm').show();
	if($('#Use2Url').is(':checked')){
		$('#ExportGermplasmsDetails').attr("disabled", true);
	}else{
        $('#ExportGermplasmsDetails').attr("disabled", false);
	}
}