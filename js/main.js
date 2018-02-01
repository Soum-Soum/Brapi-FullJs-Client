

async function init(){
	await setVisibleField();
	if (window !== top){
		$('#title').hide();
	}
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
    $('#groupManager').hide();
    if($_GET("manage") === 'false'){
        $('#advancedMode').hide();
    }
	if ($_GET("baseUrl") !== null) {
		let temp = $_GET("baseUrl").split(';');
		for (let i = 0; i < temp.length; i++) {
			groupTab[i] = temp[i].split(',');
		}
		for (let i = 0; i < groupTab.length; i++){
			for (let j = 0; j < groupTab[i].length; j++) {
				groupTab[i][j] = await urlWithAuth.staticConstructor2(groupTab[i][j]);
				if (groupTab[i][j].url===undefined) {
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
		if (groupTab.length > 0) {
			$('#urltoget').hide();
			$('#labelUse2Url').hide();
			$('#loginForm').hide();
			isEndPointInUrl = true;
			fillWidget(groupTab);
		}
		if ($_GET("auth") === "true" && groupTab.length===1) {
			$('#loginForm').show();
			auth = true;
		}
		if (isEndPointInUrl && auth !== true) {
			$('#Submit1').hide();
			await login();
		}
	}
}

async function geneateGroupTab(caller) {
    grpTabFromUrlAsChanged=true; isMapIdInUrl=false;
	groupTab=[];
	let groups = $(caller).parent().children();
	for(let i=2; i<groups.length;i++){
		let urls = $(groups[i]).children();
		for(let j=3; j<urls.length;j++){
			if(undefined ===groupTab[i-2]){groupTab[i-2]=[];}
			let tempUrl = await urlWithAuth.staticConstructor(urls[j].children[0].value,urls[j].children[1].value,urls[j].children[2].value);
			if(tempUrl.token!==undefined){
                groupTab[i-2].push(tempUrl);
				$(urls[j].children[3]).hide(100);
                $(urls[j].children[4]).show(100);
                $(urls[j].children[5]).hide(100);
			}else{
                $(urls[j].children[3]).hide(100);
                $(urls[j].children[4]).hide(100);
                $(urls[j].children[5]).show(100);
			}
		}
	}
	console.log(groupTab);
	login();
}

async function login(){
	console.log(groupTab);
	if((groupTab.length===0 && !$('#advancedMode input').is(':checked'))){
		let tempGroup =[];
		tempGroup.push(await urlWithAuth.staticConstructor($("#urltoget").val(),$("#UserId").val(),$("#Password").val()));
		groupTab.push(tempGroup);
	}else if(groupTab.length===1 && auth=== true){
        await groupTab[0][0].reconect($('#UserId').val(),$('#Password').val());
	}
	//}
    console.log(groupTab);
    setMainFormVisible();
    $('#toAnimate').addClass('animated fadeIn');
    startment();

}

/*async function login(){
||(groupTab.length!==0 && $('#urltoget').val()!==groupTab[0].url)
	if(groupTab.length===0 || $("#urltoget").val()!== groupTab[0].urlEndPoint ){
        if(!isEndPointInUrl){
            let tempGroup =[];
            tempGroup.push(await urlWithAuth.staticConstructor($("#urltoget").val(),$("#UserId").val(),$("#Password").val()));
            groupTab.push(tempGroup);
        }
	}else{
		if(isEndPointInUrl){
            fillWidget(groupTab);
		}
	}
    console.log(groupTab);
	setMainFormVisible();
	$('#toAnimate').addClass('animated fadeIn');
	startment();
}*/


async function startment() {
	let argumentsArray = groupTab;
	if(await requCallareImplement(argumentsArray)){
		await getFirstInformation(argumentsArray);
        setup_select_tag(firstInformation);
	}
}

async function getFirstInformation(){
    try{
    	firstInformation=[];
        let argumentsArray =[];
        bindCall2Url(groupTab, ALL_CALLS);
        if($_GET("mapDbId")!==null && !grpTabFromUrlAsChanged){
            $('#selectionMap').hide();
            $('#labelSelectionMap').hide();
            for(let i=0; i<groupTab.length;i++){
                argumentsArray = {urlEndPoint : call2UrlTab[i]['studies-search'].split(';')[0], token : call2UrlTab[i]['studies-search'].split(';')[1]};
                let tempStudies = await readStudyList(argumentsArray);
                let tempMap = $_GET("mapDbId");
                firstInformation[i]={map : tempMap, studies : tempStudies};
            }
        }else{
            $('#selectionMap').show();
            $('#labelSelectionMap').show();
            for(let i=0; i<groupTab.length;i++){
                argumentsArray = {urlEndPoint : call2UrlTab[i]['studies-search'].split(';')[0], token : call2UrlTab[i]['studies-search'].split(';')[1]};
                let tempStudies = await readStudyList(argumentsArray);
                argumentsArray = {urlEndPoint : call2UrlTab[i]['maps'].split(';')[0], token : call2UrlTab[i]['maps'].split(';')[1]};
                let tempMap = await readMaps(argumentsArray);
                firstInformation[i]={map : tempMap, studies : tempStudies};
            }
        }
    }catch (err){
        handleErrors('Unable to load preliminary information  ')
    }
}

async function launch_selection(){
    setEmptyMarkerSelect();
    $('#topTypeDiv').hide();
    setDisabled(true);
	if ($("#selectionStudies").find("option:selected").text()==="---Select one---") {
		setEmptyTheFields();
	}else{
		if(!isMapIdInUrl){
			selectedMap = $('#selectionMap').find('option:selected').val();
            currentGroupId =$('#selectionMap').find('option:selected').attr('id');
            console.log(selectedMap);
		}else{
			selectedMap=$_GET("mapDbId");
		}
		let arrayOfLinkageGroup=[],  arrayMarkers=[];
		selectedStudy = $('#selectionStudies').find('option:selected').val();
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
                tempArray = await paginationManager.pager(getMarkersPosition, argumentsArray);
                for(let p=0; p<tempArray.length;p++){
                    arrayMarkers=arrayMarkers.concat(tempArray[p]);
				}
			}
            arrayMarkers = [arrayMarkers];
		}
        console.log(arrayMarkers[0]);
        setLocalStorage(arrayMarkers);
        setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers);
		setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType);
	}
    setDisabled(false);
}

function selectionMarkers(){
	let selectedType = $("#typeMarker").val();
	let selectedLinkageGroup = $("#chromosome").val();
	console.log(selectedLinkageGroup);
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
		return selectedMarkers
	}else{
        let intersection = [];
        for(let i=0; i<selectedType.length; i++){
        	intersection = intersection.concat(array_big_intersect(selectedMarkers, hmapsType[selectedType[i]]));
		}
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

