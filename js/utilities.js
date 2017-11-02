function trasform_matrix(matrix){
	let newMatrix = [];
	matrix.forEach(function(element){
		element.forEach(function(element2){
			newMatrix.push(element2); 		
		});		
	});
	return newMatrix;
}

function isInArray(array, a){
	for (let i = 0; i < array.length; i++) {
		if (array[i]===a){
			return true;
		}
	}
	return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function returnInit(token){
	let myHeaders = new Headers();
	myHeaders = token==='' ? {} : {'Authorization': 'Bearer '+token};
    return {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
}

function $_GET(param) {
    let vars = {};
    window.location.href.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function (m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
    );
    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

function getMarkerProfileHmap(arrayGermplasmsIDs){
	console.log(arrayGermplasmsIDs);
	let hmap=[], alreadyTreated = [];
	for (let i = 0; i < arrayGermplasmsIDs.length; i++) {
		for (let j = 0; j < arrayGermplasmsIDs[i].length; j++) {
			if(!isInArray(alreadyTreated, arrayGermplasmsIDs[i][j].germplasmDbId)){
				alreadyTreated.push(arrayGermplasmsIDs[i][j].germplasmDbId);
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId]=[];
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId].push(arrayGermplasmsIDs[i][j]);
			}else{
				hmap[arrayGermplasmsIDs[i][j].germplasmDbId].push(arrayGermplasmsIDs[i][j]);
			}
		}
	}
	return hmap;
}

function is1For1(hmap){
	console.log(hmap);
	hmap.forEach(function(element){
		if(element.length>1){
			return false;
		}
	});
	return true;
}

function removeAll(tab, val){
	for (let i = 0; i < tab.length; i++) {
		if (tab[i]===val) {
			tab.splice(i,1);
			i--;
		}
	}
	return tab;
}

function sortAlphaNum(a,b) {
	let reA = /[^a-zA-Z]/g;
	let reN = /[^0-9]/g;
    let aA = a.replace(reA, "");
    let bA = b.replace(reA, "");
    if(aA === bA) {
        let aN = parseInt(a.replace(reN, ""), 10);
        let bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}

function reversHmap(hMap){
	let newHMap = [];
	Object.keys(hMap).forEach(function(element){
        console.log(element);
		for(let i=0; i<hMap[element].length;i++){
            newHMap[hMap[element][i].markerProfileDbId]=element;
		}
	});
	return newHMap;
}


