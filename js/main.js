"use strict";
let urlEndPoint = "", token = "", selectedMap = "";
let selectedMarkersProfils=[], selectedMarkers=[], hmapsType=null , hmapsLinkageGroup = [], response = [], cpyResp = [];
let clientPageSize=1000, startmentindex=0, sizeOfResquestedMatrix=0;
let isEndPointInUrl=false, isMapIdInUrl=false, auth=true;

async function init(){
	await setVisibleField();
	if (window !== top){
		$('#title').hide();
	}
}

async function setVisibleField(){
	// $('#mainForm').hide();
	// $('#secondForm').hide();
	// $('#resulttable').hide();
	// $('#loadingScreen').hide();
	// $('#ErrorMessage').hide();
	if($_GET("brapiV1EndPoint")!==null && await urlBrapiEndPointIsOk($_GET("brapiV1EndPoint"))){
		urlEndPoint = $_GET("brapiV1EndPoint");
		$('#urlForm').hide();
		isEndPointInUrl=true;
		if ($_GET("mapDbId")!==null && await urlMapIdIsOk(urlEndPoint,$_GET("mapDbId"))){
			selectedMap=$_GET("mapDbId");
			$('#mapForm').hide();
			isMapIdInUrl=true;
		}
	}
	if ($_GET("auth")!=="true"){
		$('#loginForm').hide();
		auth = false;
	}
	if (isEndPointInUrl && auth===false){
		console.log("ptdr");
		$('#Submit1').hide();
		await login();
	}
}

async function login(){
	let stringUserId = $("#UserId").val(), stringPassword = $("#Password").val();
	if(!isEndPointInUrl){urlEndPoint = $("#urltoget").val()}
	if(stringPassword === "" || stringUserId === ""){
		$('#mainForm').show();
		startment();
	}else{
		token = await getToken(stringUserId, stringPassword, urlEndPoint);
		if(token === ""){alert("Bad Username or password, You're are loged as public user, so you only have acces to public data");}
		else{alert("You're loged as private user");}
		$('#mainForm').show();
		startment();
	}
}

async function startment() {
	let argumentsArray = {urlEndPoint, token};
	let firtstInformation = await getFirstInformation(argumentsArray);
	setup_select_tag(firtstInformation);
}	

async function launch_selection(){
	if ($("#selectionStudies").find("option:selected").text()==="---Select one---") {
		setEmptyTheFields();
	}else{
		if(!isMapIdInUrl){
			selectedMap = $('#selectionMap').find('option:selected').val();
		}
		let arrayOfLinkageGroup=[], arrayOfMarkersType=[], arrayMarkers=[];
		let selectedStudy = $('#selectionStudies').find('option:selected').val();
		let paginationManager = new PaginationManager(0);
		let argumentsArray = {urlEndPoint, token, selectedStudy, selectedMap};
        await paginationManager.pager(getmarkerProfileDbId,argumentsArray).then(function(arrayGermplasmsIDs){
			response = getMarkerProfileHmap(arrayGermplasmsIDs);
			setUpGermplasms(response);
			setUpMarkerProfils(response);
			cpyResp = response;
			response=reversHmap(response);
		});
		let mapDetails = await getMapDetails(argumentsArray);
		console.log(argumentsArray.selectedMap);
		mapDetails.result.data[0].linkageGroups.forEach(function(element){
			arrayOfLinkageGroup.push(element.linkageGroupId);
		});
		if (await paginationManager.is1Page(getMarkers,argumentsArray)){
			arrayMarkers = await paginationManager.pager(getMarkers,argumentsArray);
			arrayOfMarkersType = setHmapType(arrayMarkers);
		}
		arrayMarkers = await paginationManager.pager(getMarkersPosition,argumentsArray);
		setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers);
		setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType);
		arrayMarkers=null;
	}
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
	console.log(arrayMarkers);
	hmapsType = [];
	let arrayOfMarkersType=[];
	for (let i = 0; i < arrayMarkers.length; i++) {
		for (let j = 0; j < arrayMarkers[i].length; j++) {
			hmapsType[arrayMarkers[i][j].markerDbId]=arrayMarkers[i][j].type;
			if(!isInArray(arrayOfMarkersType, arrayMarkers[i][j].type)){
					arrayOfMarkersType.push(arrayMarkers[i][j].type);
			}
		}
	}
	return arrayOfMarkersType;
}

function selectionMarkers(){
	let selectedType = $("#typeMarker").val();
	let selectedLinkageGroup = $("#chromosome").val();
	if((selectedType.length!==0 && selectedLinkageGroup.length!==0)||(selectedLinkageGroup.length!==0 && $("#typeMarker>option").length===0)){
		selectedMarkers=[];
		for(let i=0; i<selectedLinkageGroup.length;i++){
			selectedMarkers = selectedMarkers.concat(hmapsLinkageGroup[selectedLinkageGroup[i]]);	
		}
		if (hmapsType!==null){
			for (let i = 0; i < selectedMarkers.length; i++) {
				if (!isInArray(selectedType,hmapsType[selectedMarkers[i]])){
					selectedMarkers.splice(i,1);
					i--;
				}
			}
		}
		setupMarkersId(selectedMarkers);
		console.log(selectedMarkers);
	}
}


function getRequestParameter(){
	selectedMarkersProfils=null;
	$('#secondForm').show();
	if($('#MarkersProfils').is('visible')){
		selectedMarkersProfils = $("#MarkersProfils option:selected").map(function(){return $(this).val();}).get();
	}else{
		selectedMarkersProfils = $("#Germplasms option:selected").map(function(){return $(this).val().split(",");}).get();
		selectedMarkersProfils = removeAll(selectedMarkersProfils, "");	
	}
	if($('#Markers').html()!==""){
		selectedMarkers = $('#Markers').find('option:selected').map(function(){return $(this).val();}).get();
	}
	if(selectedMarkers.length!==0 && selectedMarkersProfils.length!==0){
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
		let sendedMarkers = [], sendedMarkersProlis = [];
		let paginationManager = new PaginationManager(0);
		let isAnExport= false;
		if (selectedMarkers.length*selectedMarkers.length<clientPageSize){
			sendedMarkers = selectedMarkers;
			sendedMarkersProlis = selectedMarkersProfils;
			let argumentsArray = {urlEndPoint, token, sendedMarkers, sendedMarkersProlis, clientPageSize, isAnExport};
			paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
				matrix=trasform_matrix(matrix,sendedMarkersProlis);
				fill_result_table(matrix,0);
			});
		}else{
			let count =0 ,rest = index%selectedMarkers.length ,quotient = Math.trunc(index/selectedMarkers.length);
			while(count<clientPageSize && index <= sizeOfResquestedMatrix){
				if(selectedMarkers[rest]!==null && !isInArray(sendedMarkers, selectedMarkers[rest])){
					sendedMarkers.push(selectedMarkers[rest]);
				}
				if (!isInArray(sendedMarkersProlis, selectedMarkersProfils[quotient]) && selectedMarkersProfils[quotient]!==null ){
					sendedMarkersProlis.push(selectedMarkersProfils[quotient]);
				}
				index++;
				count++;
				rest = index%selectedMarkers.length;
				quotient = Math.trunc(index/selectedMarkers.length);
			}
			let argumentsArray = {urlEndPoint,token,sendedMarkers,sendedMarkersProlis, clientPageSize};
			paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
				matrix=trasform_matrix(matrix,sendedMarkersProlis);
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
	let sendedMarkersProlis = $("select#MarkersProfils option:selected").map(function(){return $(this).val().split(",");}).get();
	sendedMarkersProlis = removeAll(sendedMarkersProlis, "");
	let sendedMarkers = selectedMarkers
	console.log(sendedMarkers);
	let isAnExport= true, askedPage = null;
	let argumentsArray = {urlEndPoint, token, sendedMarkers, sendedMarkersProlis, clientPageSize, isAnExport, askedPage};
	let link = await getMatrix(argumentsArray);
	console.log(link);
	argumentsArray.asynchid = link.metadata.status[0].message;
	console.log(argumentsArray.asynchid);
	await getExportStatus(argumentsArray);
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
	if (parseInt($('#customPageSize').val())<5000){
		clientPageSize=parseInt($('#customPageSize').val())
	}else{
		clientPageSize=5000;
		$('#customPageSize').val(5000);
	}	
}

function setCustomIndex(){
	let pageNumber = parseInt($('#customIndex').val());
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

function exportGermplasmeTsv(){
	download('Germplasm2Sample.tsv',cpyResp);
}

function download(filename,hmap) {
    let element = document.createElement('a');
    let text = genearteTsvData(hmap);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


function genearteTsvData(hmap){
	let tsvData = "";
	Object.keys(hmap).forEach(function(element){
		hmap[element].forEach(function(element2){
			tsvData+=(element2.germplasmDbId + "\t" + element2.markerProfileDbId + "\n");
		})
	});
	console.log(tsvData);
	return tsvData
}