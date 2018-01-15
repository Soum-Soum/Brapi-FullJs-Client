"use strict";

async function init(){
	await setVisibleField();
	if (window !== top){
		$('#title').hide();
	}
    animatForm();
}

async function setVisibleField() {
	$('#mainForm').hide();
	$('#secondForm').hide();
	$('#resulttable').hide();
	$('#loadingScreen').hide();
	$('#ErrorMessage').hide();
	$('#topMarkerDiv').hide();
	$('#topTypeDiv').hide();
	$('#AbortExport').hide();
	$('#AbortExportGermplasmsDetails').hide();
	if ($_GET("baseUrl") !== null) {
		let temp = $_GET("baseUrl").split(';');
		for (let i = 0; i < temp.length; i++) {
			groupTab[i] = temp[i].split(',');
		}
		for (let i = 0; i < groupTab.length; i++){
			for (let j = 0; j < groupTab[i].length; j++) {
				groupTab[i][j] = await urlWithAuth.staticConstructor2(groupTab[i][j]);
				if (groupTab[i][j].url===null) {
					groupTab[i].splice(j, 1);
					if(groupTab[i].length>0){
                        j--;
					}
				}
			}
            if(groupTab[i].length===0){
                groupTab.splice(i, 1);
                if(i!==groupTab.length){
                    i--;
                }
            }
		}
		console.log(groupTab);
		if (groupTab.length > 0) {
			$('#urlForm').hide();
			$('#labelUse2Url').hide();
			isEndPointInUrl = true;
		}
		if ($_GET("auth") !== "true") {
			$('#loginForm').hide();
			auth = false;
		}
		if (isEndPointInUrl && auth === false) {
			$('#Submit1').hide();
			await login();
		}
	}
}

async function login(){
	let stringUserId = $("#UserId").val(), stringPassword = $("#Password").val(), stringUserId2 = $("#UserId2").val(), stringPassword2 = $("#Password2").val();
	let urlEndPoint1, urlEndPoint2;
    if(!isEndPointInUrl){
		urlEndPoint1 = $("#urltoget").val();
		urlEndPoint2 = $('#urltoget2').val();
		is2EndPoint = urlEndPoint2 !== '' && urlEndPoint2 !== undefined;
	}
	if(stringPassword === "" || stringUserId === ""){
		setMainFormVisible();
		startment();
	}else{
		console.log("lol")
        groupTab.push(urlWithAuth.staticConstructor(urlEndPoint1,stringUserId,stringPassword));
		if(is2EndPoint){ groupTab.push(urlWithAuth.staticConstructor(urlEndPoint2,stringUserId2,stringPassword2));}
        groupTab.forEach(function (element) {
            if(element.token===""){alert("Bad Username or password, You're are loged as public user to " + element.url +  ", so you only have acces to public data");}
			else{alert("You're loged as private user to " + element.url);}
        });
		setMainFormVisible();
        $('#toAnimate').addClass('animated fadeIn');
        console.log(groupTab);
		startment();
	}
}

async function startment() {
	let argumentsArray = groupTab;
	if(await requCallareImplement(argumentsArray)){
		firtstInformation = await getFirstInformation(argumentsArray);
        setup_select_tag(firtstInformation);
	}
}

async function getFirstInformation(){
    try{
        let arrayOfStudies=[], arrayOfMaps = [];
		bindCall2Url(groupTab, ALL_CALLS);
		console.log(call2UrlTab);
		if($_GET("mapDbId")!==null){
			console.log($_GET("mapDbId"));
			$('#selectionMap').hide();
			$('#labelSelectionMap').hide();
            for(let i=0; i<groupTab.length;i++){
                let argumentsArray = {urlEndPoint : call2UrlTab[i]['studies-search'].split(';')[0], token : call2UrlTab[i]['studies-search'].split(';')[1]}
                arrayOfStudies = arrayOfStudies.concat(await readStudyList(argumentsArray));
            }
		}else{
            for(let i=0; i<groupTab.length;i++){
                let argumentsArray = {urlEndPoint : call2UrlTab[i]['studies-search'].split(';')[0], token : call2UrlTab[i]['studies-search'].split(';')[1]}
                arrayOfStudies = arrayOfStudies.concat(await readStudyList(argumentsArray));
				arrayOfMaps = arrayOfMaps.concat(await readMaps(argumentsArray));
            }
		}
		console.log({maps : arrayOfMaps, studies : arrayOfStudies});
		return {maps : arrayOfMaps, studies : arrayOfStudies};
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
            currentGroupId =$('#selectionMap').find('option:selected').attr('id');
            console.log(selectedMap);
		}
		let arrayOfLinkageGroup=[],  arrayMarkers=[];
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
            hmapsType = setHmapType(arrayOfMarkersType,arrayMarkers);
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
                tempArray = await paginationManag
				er.lol(getMarkersPosition, argumentsArray);
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
		if(selectedType.length!==0){
            selectedMarkers = compareOrSubtract(selectedType);
		}else{
			handleErrors('No type are selected');
		}

		setupMarkersId(selectedMarkers);
		console.log(selectedMarkers);
	}
}

function compareOrSubtract(selectedType){
	if(isInArray(selectedType, mostPresentType)){
        let set = new Set(selectedType);
		let unselectedType = [...new Set([...arrayOfMarkersType].filter(x => !set.has(x)))];
		for(let i=0; i<unselectedType.length; i++){
			let tempSet = new Set(hmapsType[unselectedType[i]]);
			selectedMarkers = [...new Set([...selectedMarkers].filter(x => !tempSet.has(x)))];
		}
		console.log(selectedMarkers);
		return selectedMarkers
	}else{
        let intersection = [];
        for(let i=0; i<selectedType.length; i++){
        	intersection = intersection.concat(array_big_intersect(selectedMarkers, hmapsType[selectedType[i]]));
		}
		console.log(intersection);
		return intersection;
	}
}

function getRequestParameter(){
    enmptResultTab();
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
                if(!$('#missingData').prop('checked')){
					cleanTab(sendedMarkers,sendedMarkersProlis);
                }
			});
		}
	}else{
		startmentindex = parseInt(clientPageSize)*(totalPage-1);
        launchMatrixRequest(startmentindex);
	}
}

