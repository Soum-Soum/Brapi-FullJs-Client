

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
		$('#loadingModal').modal('show');
		setMainBadgeText('Get selected Map and Study');
		if(!isMapIdInUrl){
			selectedMap = $('#selectionMap').find('option:selected').val();
            setMainBadgeText('Selected Map : '+selectedMap);
            currentGroupId =$('#selectionMap').find('option:selected').attr('id');
            //console.log(selectedMap);
		}else{
			selectedMap=$_GET("mapDbId");
            setMainBadgeText('Slected Map : '+selectedMap);
		}
		let arrayOfLinkageGroup=[],  arrayMarkers=[];
		selectedStudy = $('#selectionStudies').find('option:selected').val();
        setMainBadgeText('Selected Study '+selectedMap);
		let paginationManager = new PaginationManager(0,0);
		let argumentsArray = {selectedStudy, selectedMap};
        argumentsArray = setArgumentArray("markerprofiles",argumentsArray);
		let askedType=null;
		setMainBadgeText('Start loading Markers Profiles');
        await paginationManager.pager(getmarkerProfileDbId,argumentsArray).then(function(arrayGermplasmsIDs){
			setMainBadgeText('Markers Profiles hmap making');
        	response = getMarkerProfileHmap(arrayGermplasmsIDs);
            setMainBadgeText('Set up Markers Profiles and Germplasms');
			setUpGermplasms(response);
			setUpMarkerProfils(response);
			cpyResp = response;
			response=reversHmap(response);
		});
        argumentsArray = setArgumentArray("maps/{id}",argumentsArray);
        setMainBadgeText('Map details loading...');
		let mapDetails = await getMapDetails(argumentsArray);
		mapDetails.result.linkageGroups.forEach(function(element){
			arrayOfLinkageGroup.push(element.linkageGroupId);
		});
        argumentsArray = setArgumentArray("markers",argumentsArray);
        paginationManager.currentLoadingBarId++;
        setMainBadgeText('Type List making');
        arrayOfMarkersType = getTypeList(await paginationManager.getFirstPage(getMarkers,argumentsArray));
        //console.log(arrayOfMarkersType);
        setMainBadgeText('Testing Type List');
        if(! await paginationManager.isCompleteTypeList(getMarkers,argumentsArray,arrayOfMarkersType)){
            //console.log('uncomplete');
            $('#topTypeDiv').show();
        }else{
            //console.log('complete');
            argumentsArray = {selectedStudy, selectedMap, askedType, pageSize : undefined};
            argumentsArray = setArgumentArray("markers",argumentsArray);
            paginationManager.currentLoadingBarId++;
            for(let i=0 ; i<arrayOfMarkersType.length; i++){
            	if(arrayOfMarkersType[i]!== mostPresentType){
            		setMainBadgeText('Loading ' + arrayOfMarkersType[i] + ' Markers');
            		argumentsArray.askedType=arrayOfMarkersType[i];
                    arrayMarkers.push(await paginationManager.pager(getMarkers,argumentsArray));
				}
			}
            hmapsType = setHmapType(arrayOfMarkersType,arrayMarkers);
        }
        if(arrayMarkers.length===0 && arrayOfMarkersType.length<=1){
        	setProgresBarValue(paginationManager.currentLoadingBarId,100);
		}
        paginationManager.currentLoadingBarId++;
		if(arrayOfLinkageGroup.length>100 || arrayMarkers.length<100000){
			setMainBadgeText('Positions Loading... (could take few minutes)');
            argumentsArray = setArgumentArray("maps/{id}/positions",argumentsArray);
            arrayMarkers = await paginationManager.pager(getMarkersPosition,argumentsArray);
		}else{
			arrayMarkers=[];
			let tempArray=[];
			for(let i=0; i<arrayOfLinkageGroup.length;i++){
                let argumentsArray = {selectedStudy, selectedMap, selectedLKG: selectedLKG};
                argumentsArray = setArgumentArray("maps/{id}/positions",argumentsArray);
                setMainBadgeText('Positions Loading... (could take few minutes)');
                tempArray = await paginationManager.pager(getMarkersPosition, argumentsArray);
                for(let p=0; p<tempArray.length;p++){
                    arrayMarkers=arrayMarkers.concat(tempArray[p]);
				}
			}
            arrayMarkers = [arrayMarkers];
		}
        //console.log(arrayMarkers[0]);
        setMainBadgeText('Local Storage making');
        setLocalStorage(arrayMarkers);
        setMainBadgeText('Sequence Hmap making');
        setHmapLinkageGroup(arrayOfLinkageGroup, arrayMarkers);
        setMainBadgeText('Linkage groupe to Marker Type Hmap making');
		setUpLinkageGroupAndMarkersType(arrayOfLinkageGroup,arrayOfMarkersType);
		setProgresBarValue(5,100);
		await sleep(1500);
        $('#loadingModal').modal('hide');
        cleanWaitingModal();
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

