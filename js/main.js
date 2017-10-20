"use strict";
var urlEndPoint= "",token = "", selectedMap="";
var selectedMarkersProfils=new Array(), selectedMarkers=new Array(), hmapsType=new Array() , hmapsLinkageGroup = new Array(), response = new Array();
var clientPageSize=1000, startmentindex=0, sizeOfResquestedMatrix=0;	
var isEndPointInUrl=false, isMapIdInUrl=false, isOneForOne = true, auth=true;

async function init(){
	await setVisibleField();
	if (window != top){
		$('#title').hide();
	}
}

async function setVisibleField(){
	$('#mainForm').hide();
	$('#secondForm').hide();
	$('#resulttable').hide();
	$('#loadingScreen').hide();
	if($_GET("brapiV1EndPoint")!=null && await urlBrapiEndPointIsOk($_GET("brapiV1EndPoint"))){
		urlEndPoint = $_GET("brapiV1EndPoint");
		$('#urlForm').hide(); 
		isEndPointInUrl=true;
		if ($_GET("mapDbId")!=null && await urlMapIdIsOk(urlEndPoint,$_GET("mapDbId"))){
			selectedMap=$_GET("mapDbId"); 
			$('#mapForm').hide();
			isMapIdInUrl=true;
		}
	}
	if ($_GET("auth")!="true"){
		$('#loginForm').hide();
		auth = false;
	}
	if (isEndPointInUrl && auth==false){
		console.log("ptdr");
		$('#Submit1').hide();
		await login();
	}
}

async function login(){
	var stringUserId = $("input#UserId").val(), stringPassword = $("input#Password").val();
	if(!isEndPointInUrl){urlEndPoint = $("#urltoget").val()}
	if(stringPassword == "" || stringUserId == ""){
		$('form#mainForm').show();
		startment();
	}else{
		token = await getToken(stringUserId, stringPassword, urlEndPoint);
		if(token == ""){alert("Bad Username or password, You're are loged as public user, so you only have acces to public data");}
		else{alert("You're loged as private user");}
		$('form#mainForm').show();
		startment();
	}
}

async function startment() {
	var argumentsArray = {urlEndPoint, token}
	var firtstInformation = await getFirstInformation(argumentsArray);
	setup_select_tag(firtstInformation);
}	

async function launch_selection(){
	if ($("select#selectionStudies option:selected").text()=="---Select one---") {
		setEmptyTheFields();
	}else{
		if(!isMapIdInUrl){
			selectedMap = $('select#selectionMap option:selected').val();
		}
		var arrayOfLinkageGroup=new Array(), arrayOfMarkersType=new Array(), arrayMarkers=new Array();
		var selectedStudy = $('select#selectionStudies option:selected').val();
		var paginationManager = new PaginationManager(0);
		var argumentsArray = {urlEndPoint, token, selectedStudy, selectedMap}
		var arraymarkerProfileDbId = await paginationManager.pager(getmarkerProfileDbId,argumentsArray).then(function(arrayGermplasmsIDs){
			response = getMarkerProfileHmap(arrayGermplasmsIDs);
			setUpGermplasms(response);
			console.log(response);
			setUpMarkerProfils(response);
			console.log(response);
			response=reversHmap(response);
			console.log(response);
		});
		var mapDetails = await getMapDetails(argumentsArray);
		console.log(argumentsArray.selectedMap);
		mapDetails.result.data[0].linkageGroups.forEach(function(element){
			arrayOfLinkageGroup.push(element.linkageGroupId);
		});
		arrayMarkers = await paginationManager.pager(getMarkers,argumentsArray);
		arrayOfMarkersType = setHmapType(arrayMarkers);
		arrayMarkers = await paginationManager.pager(getMarkersPosition,argumentsArray);
		setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers);
		setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType);
		arrayMarkers=null;
	}
}

function setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers){
	hmapsLinkageGroup=null;
	hmapsLinkageGroup=new Array();
	for(var i =0; i<arrayOfLinkageGroup.length; i++){
		hmapsLinkageGroup[arrayOfLinkageGroup[i]]=new Array();
	}
	for (var i = 0; i < arrayMarkers.length; i++) {
		for (var j = 0; j < arrayMarkers[i].length; j++) {
						hmapsLinkageGroup[arrayMarkers[i][j].linkageGroup].push(arrayMarkers[i][j].markerDbId);
		}
	}
}

function setHmapType(arrayMarkers){
	console.log(arrayMarkers);
	var arrayOfMarkersType=new Array();
	for (var i = 0; i < arrayMarkers.length; i++) {
		for (var j = 0; j < arrayMarkers[i].length; j++) {
			hmapsType[arrayMarkers[i][j].markerDbId]=arrayMarkers[i][j].type;
			if(!isInArray(arrayOfMarkersType, arrayMarkers[i][j].type)){
					arrayOfMarkersType.push(arrayMarkers[i][j].type);
			}
		}
	}
	return arrayOfMarkersType;
}

function selectionMarkers(){
	var selectedType = $("#typeMarker").val();
	var selectedLinkageGroup = $("#chromosome").val();
	console.log(selectedType);
	console.log(hmapsLinkageGroup);
	if(selectedType.length!=0 && selectedLinkageGroup.length!=0){
		selectedMarkers=new Array();
		for(var i=0; i<selectedLinkageGroup.length;i++){
			selectedMarkers = selectedMarkers.concat(hmapsLinkageGroup[selectedLinkageGroup[i]]);	
		}
		console.log(selectedMarkers);
		for (var i = 0; i < selectedMarkers.length; i++) {
			if (!isInArray(selectedType,hmapsType[selectedMarkers[i]])){
				selectedMarkers.splice(i,1);
				i--;
			}
		}
		setupMarkersId(selectedMarkers);
	}
}


function getRequestParameter(){
	selectedMarkersProfils=null;
	$('form#secondForm').show();
	if($('#MarkersProfils').is('visible')){
		selectedMarkersProfils = $("select#MarkersProfils option:selected").map(function(){return $(this).val();}).get();
	}else{
		selectedMarkersProfils = $("select#Germplasms option:selected").map(function(){return $(this).val().split(",");}).get(); 
		selectedMarkersProfils = removeAll(selectedMarkersProfils, "");	
	}
	if($('select#Markers').html()!=""){
		selectedMarkers = $('select#Markers option:selected').map(function(){return $(this).val();}).get();
	}
	if(selectedMarkers.length!=0 && selectedMarkersProfils.length!=0){
		$('#nbResult').text("RESULT : " + (selectedMarkers.length*selectedMarkersProfils.length) + " records found");
		launchMatrixRequest(0);
	}else{
		handleErrors("You must specify markers and germplasmes");
	}	
}

function launchMatrixRequest(index){
	sizeOfResquestedMatrix = selectedMarkers.length*selectedMarkersProfils.length;
	$('#pageNumber').text("/" + Math.floor((selectedMarkers.length*selectedMarkersProfils.length)/clientPageSize));
	$('#customIndex').val(Math.floor(startmentindex/clientPageSize));
	console.log(Math.floor(startmentindex/clientPageSize));
	if (index < sizeOfResquestedMatrix){
		var sendedMarkers = new Array(), sendedMarkersProlis = new Array();
		var paginationManager = new PaginationManager(0);
		var isAnExport= false;
		if (selectedMarkers.length*selectedMarkers.length<clientPageSize){
			sendedMarkers = selectedMarkers;
			sendedMarkersProlis = selectedMarkersProfils;
			var argumentsArray = {urlEndPoint, token, sendedMarkers, sendedMarkersProlis, clientPageSize, isAnExport};
			var matrix = paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
				matrix=trasform_matrix(matrix);
				fill_result_table(matrix,0);
			});
		}else{
			var count =0 ,cpyIndex = index ,rest = index%selectedMarkers.length ,quotient = Math.trunc(index/selectedMarkers.length);
			while(count<clientPageSize && index <= sizeOfResquestedMatrix){
				if(selectedMarkers[rest]!=null && !isInArray(sendedMarkers, selectedMarkers[rest])){
					sendedMarkers.push(selectedMarkers[rest]);
				}
				if (!isInArray(sendedMarkersProlis, selectedMarkersProfils[quotient]) && selectedMarkersProfils[quotient]!=null ){
					sendedMarkersProlis.push(selectedMarkersProfils[quotient]);
				}
				index++;
				count++;
				rest = index%selectedMarkers.length;
				quotient = Math.trunc(index/selectedMarkers.length);
			}
			argumentsArray = {urlEndPoint,token,sendedMarkers,sendedMarkersProlis, clientPageSize};
			var matrix = paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
				matrix=trasform_matrix(matrix,isOneForOne);
				fill_result_table(matrix, response);
			});
		}
	}else{
		console.log(startmentindex-clientPageSize);
		startmentindex-=clientPageSize;
		launchMatrixRequest(startmentindex);
	}
}

async function exportMatrix(){
	setloader();
	var sendedMarkersProlis = $("select#MarkersProfils option:selected").map(function(){return $(this).val().split(",");}).get(); 
	sendedMarkersProlis = removeAll(sendedMarkersProlis, "");
	var sendedMarkers = $('select#Markers option:selected').map(function(){return $(this).val();}).get();
	var paginationManager = new PaginationManager(0);
	var isAnExport= true;
	var argumentsArray = {urlEndPoint, token, sendedMarkers, sendedMarkersProlis, clientPageSize, isAnExport};
	var link = await getMatrix(argumentsArray);
	console.log(link);
	argumentsArray.asynchid = link.metadata.status[0].message;
	console.log(argumentsArray.asynchid);
	getExportStatus(argumentsArray);
}

function nextPage(){
	if (startmentindex+=clientPageSize<sizeOfResquestedMatrix){
		startmentindex += clientPageSize;
		launchMatrixRequest(startmentindex);
	}else{
		launchMatrixRequest(sizeOfResquestedMatrix-parseInt(clientPageSize));
	}
}

function prevPage(){
	if(startmentindex-clientPageSize>=0){
		startmentindex -= clientPageSize; 
		launchMatrixRequest(startmentindex);
	}else{
		startmentindex = 0; 
		launchMatrixRequest(startmentindex)
	}
}

function setCustomPageSize(){
	if (parseInt($('input#customPageSize').val())<5000){
		clientPageSize=parseInt($('input#customPageSize').val())
	}else{
		clientPageSize=5000;
		$('input#customPageSize').val(5000);
	}	
}

function setCustomIndex(){
	var pageNumber = parseInt($('input#customIndex').val());
	startmentindex = pageNumber*clientPageSize;
	if(startmentindex>=0 && startmentindex<selectedMarkers.length*selectedMarkersProfils.length){
		launchMatrixRequest(startmentindex);
	}else if(startmentindex<0){
		startmentindex=0;
		launchMatrixRequest(0);
	}else if(startmentindex>=selectedMarkers.length*selectedMarkersProfils.length){
		startmentindex = (selectedMarkers.length*selectedMarkersProfils.length)-(clientPageSize);
		launchMatrixRequest(startmentindex);
	}
}