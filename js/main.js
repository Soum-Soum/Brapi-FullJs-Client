"use strict";

async function init(){
	await setVisibleField();
	if (window !== top){
		$('#title').hide();
	}
}

async function setVisibleField(){
	$('#mainForm').hide();
	$('#secondForm').hide();
	$('#resulttable').hide();
	$('#loadingScreen').hide();
	$('#ErrorMessage').hide();
    $('#topMarkerDiv').hide();
    $('#topTypeDiv').hide();
	if($_GET("baseUrl")!==null){
		let urlTab = $_GET("baseUrl").split(';');
   		if(await urlBrapiEndPointIsOk(urlTab[0])){
            urlEndPoint1 = urlTab[0];
            $('#urlForm').hide();
            isEndPointInUrl=true;
            if ($_GET("mapDbId")!==null && await urlMapIdIsOk(urlEndPoint1,$_GET("mapDbId"))){
                selectedMap=$_GET("mapDbId");
                $('#mapForm').hide();
                isMapIdInUrl=true;
            }
        }
        if(urlTab[1]!==undefined && await urlBrapiEndPointIsOk(urlTab[1])){
            urlEndPoint2 = urlTab[1];
            is2EndPoint=true;
		}
		console.log(urlEndPoint1);
        console.log(urlEndPoint2);
	}

	if ($_GET("auth")!=="true"){
		$('#loginForm').hide();
		auth = false;
	}
	if (isEndPointInUrl && auth===false){
		$('#Submit1').hide();
		await login();
	}
}

async function login(){
	let stringUserId = $("#UserId").val(), stringPassword = $("#Password").val(), stringUserId2 = $("#UserId2").val(), stringPassword2 = $("#Password2").val();
	if(!isEndPointInUrl){
		urlEndPoint1 = $("#urltoget").val();
		urlEndPoint2 = $('#urltoget2').val();
        if(urlEndPoint2!=='' && urlEndPoint2!== undefined){
			is2EndPoint=true;
		}else{
        	is2EndPoint=false;
		}
        console.log(urlEndPoint1);
        console.log(urlEndPoint2);
	}
	if(stringPassword === "" || stringUserId === ""){
		$('#mainForm').show();
		startment();
	}else{
		tokenUrl1 = await getToken(stringUserId, stringPassword, urlEndPoint1);
		if(is2EndPoint){tokenUrl2 = await getToken(stringUserId2, stringPassword2, urlEndPoint2);}
        url2Token = createUrl2Token(urlEndPoint1, tokenUrl1, urlEndPoint2, tokenUrl2);
		if(tokenUrl1 === ""){alert("Bad Username or password, You're are loged as public user, so you only have acces to public data");}
		else{alert("You're loged as private user");}
		$('#mainForm').show();
        $('#toAnimate').addClass('animated fadeIn');
		startment();
	}
}

async function startment() {
	console.log(is2EndPoint);
	let argumentsArray = is2EndPoint ? {urlEndPoint1, tokenUrl1, urlEndPoint2, tokenUrl2} :  {urlEndPoint1, tokenUrl1};
	if(await requCallareImplement(argumentsArray)){
        let firtstInformation = await getFirstInformation(argumentsArray);
        setup_select_tag(firtstInformation);
	}
}

async function requCallareImplement(argumentsArray) {
	try{
        let allCallsAreDetected;
        calls= await getCalls(argumentsArray);
        allCallsAreDetected= callsAreInArray(calls, REQUIRED_CALLS);
        console.log(allCallsAreDetected);
        return allCallsAreDetected;
	}catch (err){
		handleErrors(err);
	}
}

async function getFirstInformation(){
    try{
        let arrayOfStudies, arrayOfMaps = [];
		Call2Url = bindCall2Url(calls, ALL_CALLS);
		console.log(Call2Url);
		let argumentsArray = setArgumentArray("studies-search");
		arrayOfStudies= await readStudyList(argumentsArray);
		if($_GET("mapDbId")!==null){console.log($_GET("mapDbId"));$('select#selectionMap').hide();$('#labelSelectionMap').hide();}
		else{argumentsArray = setArgumentArray("maps");arrayOfMaps = await readMaps(argumentsArray);}
		let firstInformation = {};
		firstInformation.maps=arrayOfMaps;
		firstInformation.studies=arrayOfStudies;
		console.log(firstInformation);
		return firstInformation;
    }catch (err){
        handleErrors('Bad URL')
    }
}

async function launch_selection(){
    $('#topTypeDiv').hide();
    setDisabled(true);
	if ($("#selectionStudies").find("option:selected").text()==="---Select one---") {
		setEmptyTheFields();
	}else{
		if(!isMapIdInUrl){
			selectedMap = $('#selectionMap').find('option:selected').val();
		}
		let arrayOfLinkageGroup=[], arrayOfMarkersType,  arrayMarkers=[];
		let selectedStudy = $('#selectionStudies').find('option:selected').val();
		let paginationManager = new PaginationManager(0);
		let argumentsArray = {selectedStudy, selectedMap};
        argumentsArray = setArgumentArray("markerprofiles",argumentsArray);
		let askedType=null;
        await paginationManager.pager(getmarkerProfileDbId,argumentsArray).then(function(arrayGermplasmsIDs){
			response = getMarkerProfileHmap(arrayGermplasmsIDs);
			setUpGermplasms(response);
			setUpMarkerProfils(response);
			cpyResp = response;
			response=reversHmap(response);
		});
        argumentsArray = setArgumentArray("maps/{id}",argumentsArray);
		let mapDetails = await getMapDetails(argumentsArray);
		mapDetails.result.linkageGroups.forEach(function(element){
			arrayOfLinkageGroup.push(element.linkageGroupId);
		});
        argumentsArray = setArgumentArray("markers",argumentsArray);
        arrayOfMarkersType = getTypeList(await paginationManager.getFirstPage(getMarkers,argumentsArray));
        console.log(arrayOfMarkersType);
        if(! await paginationManager.isCompleteTypeList(getMarkers,argumentsArray,arrayOfMarkersType)){
            console.log('uncomplete');
            $('#topTypeDiv').show();
        }else{
            console.log('complete');
            argumentsArray = {selectedStudy, selectedMap, askedType, pageSize : undefined};
            argumentsArray = setArgumentArray("markers",argumentsArray);
            for(let i=0 ; i<arrayOfMarkersType.length; i++){
            	if(arrayOfMarkersType[i]!== mostPresentType){
            		argumentsArray.askedType=arrayOfMarkersType[i];
                    arrayMarkers.push(await paginationManager.pager(getMarkers,argumentsArray));
				}
			}
            hmapsType = setHmapType(arrayMarkers);
        }
		if(arrayOfLinkageGroup.length>100 || arrayMarkers.length<100000){
            argumentsArray = setArgumentArray("maps/{id}/positions",argumentsArray);
            arrayMarkers = await paginationManager.pager(getMarkersPosition,argumentsArray);
		}else{
			arrayMarkers=[];
			let tempArray=[];
			for(let i=0; i<arrayOfLinkageGroup.length;i++){
                let argumentsArray = {selectedStudy, selectedMap, selectedLKG: selectedLKG};
                argumentsArray = setArgumentArray("maps/{id}/positions",argumentsArray);
                tempArray = await paginationManager.pager(getMarkersPosition, argumentsArray);
                for(let p=0; p<tempArray.length;p++){
                    arrayMarkers=arrayMarkers.concat(tempArray[p]);
				}
			}
            arrayMarkers = [arrayMarkers];
		}
        setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers);
		setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType);
	}
    setDisabled(false);
}

function selectionMarkers(){
	let selectedType = $("#typeMarker").val();
	console.log(selectedType);
	let selectedLinkageGroup = $("#chromosome").val();
	if((selectedType.length!==0 && selectedLinkageGroup.length!==0)||(selectedLinkageGroup.length!==0 && $("#typeMarker>option").length===0)){
		selectedMarkers=[];
		for(let i=0; i<selectedLinkageGroup.length;i++){
			selectedMarkers = selectedMarkers.concat(hmapsLinkageGroup[selectedLinkageGroup[i]]);	
		}
		console.log(selectedMarkers);
		if (hmapsType!==undefined){
			for (let i = 0; i < selectedMarkers.length; i++) {
				if((hmapsType[selectedMarkers[i]]===undefined && !isInArray(selectedType, mostPresentType))){
                    selectedMarkers.splice(i,1);
                    i--;
				}else if((hmapsType[selectedMarkers[i]]!==undefined && !isInArray(selectedType,hmapsType[selectedMarkers[i]]))){
                    selectedMarkers.splice(i,1);
                    i--
				}
			}
		}
		setupMarkersId(selectedMarkers);
		console.log(selectedMarkers);
	}
}

function getRequestParameter(){
	selectedMarkersProfils=null;
    startmentindex=0;
	$('#customIndex').val(1);
	console.log($('#customIndex').val());
	$('#secondForm').show();
	if($('#MarkersProfils').is('[disabled=disabled]')){
        selectedMarkersProfils = $("#Germplasms option:selected").map(function(){return $(this).val().split(",");}).get();
        selectedMarkersProfils = removeAll(selectedMarkersProfils, "");
    }else{
        selectedMarkersProfils = $("#MarkersProfils option:selected").map(function(){return $(this).val();}).get();
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
	totalPage = Math.floor(1+(sizeOfResquestedMatrix)/clientPageSize);
	$('#pageNumber').text("/" + totalPage);
	$('#customIndex').val(Math.floor(startmentindex/clientPageSize)+1);
	if (index < sizeOfResquestedMatrix){
		let sendedMarkers = [], sendedMarkersProlis = [];
		let paginationManager = new PaginationManager(0);
		let isAnExport= false;
		if (selectedMarkers.length*selectedMarkers.length<clientPageSize){
			sendedMarkers = selectedMarkers;
			sendedMarkersProlis = selectedMarkersProfils;
			let argumentsArray = {sendedMarkers, sendedMarkersProlis, clientPageSize, isAnExport};
            argumentsArray = setArgumentArray("allelematrix-search",argumentsArray);
			paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
                fill_result_table(sendedMarkers,sendedMarkersProlis,response);
                insetMatrixInResultTable(matrix);
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
            sendedMarkersProlis = removeAll(sendedMarkersProlis, undefined);
			console.log(sendedMarkersProlis);
			let argumentsArray = {sendedMarkers,sendedMarkersProlis, clientPageSize};
            argumentsArray = setArgumentArray("allelematrix-search",argumentsArray);
			paginationManager.pager(getMatrix,argumentsArray).then(function(matrix){
				fill_result_table(sendedMarkers,sendedMarkersProlis,response);
                insetMatrixInResultTable(matrix);
                if($('#missingData').prop('checked')){
					cleanTab(sendedMarkers,sendedMarkersProlis);
                }
			});
		}
	}else{
		startmentindex = parseInt(clientPageSize)*(totalPage-1);
        launchMatrixRequest(startmentindex);
	}
}

