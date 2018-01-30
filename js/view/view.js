/**
 * insert matrix in result table
 * @function
 * @param {Array} firstinformations - array containing the maps and studies that were found
 */
function setup_select_tag(){
    let htmlString='<option value="">---Select one---</option>\n';
    if($_GET("mapDbId")===null){
        for(let i=0; i<firstInformation.length; i++){
            htmlString += '<option id="'+i+'" value="' + firstInformation[i].map[0].mapDbId + '">' + firstInformation[i].map[0].name + '</option>\n';
		}
    }else{
    	isMapIdInUrl=true;
    	htmlString = '<option id="0" value="' + firstInformation[0].map + '">' + firstInformation[0].map + '</option>\n';
    }
    $('#selectionMap').html(htmlString);
    console.log(htmlString);
    selectStudies();
}


/**
 * Set htmp of studies widget
 * @function
 */
function selectStudies(){
	setEmptyTheFields();
    let selectedMapDbId =$('#selectionMap').find('option:selected').val();
    $('select#selectionStudies').html('');
    let htmlString='<option value="">---Select one---</option>';
    for(let i=0; i<firstInformation.length; i++){
        if(selectedMapDbId === firstInformation[i].map[0].mapDbId){
            for(let j=0; j<firstInformation[i].studies.length; j++){
            	console.log(firstInformation[i].studies[j]);
                htmlString += '<option id="'+i+'" value="' + firstInformation[i].studies[j].studyDbId + '">' + firstInformation[i].studies[j].name + '</option>\n';
            }
        }else if(selectedMapDbId === firstInformation[i].map){
            for(let j=0; j<firstInformation[i].studies.length; j++){
                console.log(firstInformation[i].studies[j]);
                htmlString += '<option id="'+i+'" value="' + firstInformation[i].studies[j].studyDbId + '">' + firstInformation[i].studies[j].name + '</option>\n';
            }
		}
    }
    $('#selectionStudies').html(htmlString);
    if($("#selectionStudies option").length===2){
        $($('#selectionStudies option')[1]).prop('selected', true);
        launch_selection();
    }
}

/**
 * Set empty all fields
 * @function
 */
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
    enmptResultTab();
}

/**
 * Set Empty Marker field
 * @function
 */
function setEmptyMarkerSelect() {
	$('#Markers').html("");
    $('#markersLabel').hide();
}

/**
 * Set up html of Germplasms widget
 * @function
 * @param {Array} response - array of marker profile
 */
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

/**
 * Set up html of Markers Profils widget
 * @function
 */
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

/**
 * Set up Html of LinkageGroup and MarkersType widget
 * @function
 * @param {Array} arrayOfLinkageGroup - array Of LinkageGroup
 * @param {Array} arrayOfMarkersType - array Of MarkersType
 */
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

/**
 * Set up Html of Marker widget
 * @function
 * @param {Array} arrayMarkersIds - array of MarkersIds
 */
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

/**
 * update the label of the current select
 * @function
 * @param {Array} idLabel - selected label
 * @param {Array} idSelect - selected select
 */
function updateSelection(idLabel, idSelect){
	let nbSelectionOption = $('#'+idSelect+" option:selected").map(function(){return $(this).val().split(",");}).get();
	nbSelectionOption = removeAll(nbSelectionOption, "");
	nbSelectionOption=nbSelectionOption.length;
	let nbOption = $('#'+idSelect+" option").map(function(){return $(this).val().split(",");}).get();
	nbOption = removeAll(nbOption,"");
	nbOption=nbOption.length;
	$('#'+idLabel).text(nbSelectionOption + ' / ' + nbOption);
	if(nbSelectionOption === 0){
        $('#'+idLabel).hide();
    }else{
        $('#'+idLabel).show();
    }

}

/**
 * Handle Errors
 * @function
 * @param {Error} err - current error
 */
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

/**
 * Set html object disabled or undisabled
 * @function
 * @param {Boolean} bool - true or false
 */
function setDisabled(bool){
    $('#selectionMap').prop('disabled', bool);
    $('#selectionStudies').prop('disabled', bool);
    $('#Search').prop('disabled', bool);
    $('#Export').prop('disabled', bool);
    $('#ExportGermplasmsTsv').prop('disabled', bool);
    $('#ExportGermplasmsDetails').prop('disabled', bool);
}

/**
 * Animate html page
 * @function
 */
function animatForm(){
	if(!$('#UserId2').is(':visible')){
		$('#btnChangeName').text('Use one url');
        $('#UserId2').show();
        $('#Password2').show();
        $('#urltoget2').show();
        $('#UserId2').text('');
        $('#Password2').text('');
        $('#urltoget2').text('');
        $('#UserId2').addClass('animated bounceInRight');
        $('#Password2').addClass('animated bounceInRight');
        $('#urltoget2').addClass('animated bounceInRight');
	}else{
        $('#btnChangeName').text('Use tow url');
        $('#UserId2').hide();
        $('#Password2').hide();
        $('#urltoget2').hide();
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
