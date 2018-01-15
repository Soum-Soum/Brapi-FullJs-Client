async function requCallareImplement() {
    try{
        for(let i=0; i<groupTab.length; i++){
            let callsimplementInTheGroup = [];
            for(let j=0; j<groupTab[i].length; j++){
                for(let k =0; k<groupTab[i][j].callsImplemented.length;k++){
                    if(!isInArray(callsimplementInTheGroup, groupTab[i][j].callsImplemented[k])){
                        callsimplementInTheGroup.push(groupTab[i][j].callsImplemented[k]);
                    }
                }
            }
            if(!callsAreInArray(callsimplementInTheGroup, REQUIRED_CALLS)){
                groupTab.splice(i, 1);
                if(i!==groupTab.length){
                    i--;
                }
            }
        }
        console.log(groupTab);
        return groupTab.length>0;

    }catch (err){
        handleErrors(err);
    }
}

function callsAreInArray(resp, requCall){
    try {
        let foundCalls = [];
        removeAll(resp, undefined);
        removeAll(resp, null);
        resp.forEach(function (element){
            if(!isInArray(foundCalls, element)){
                foundCalls.push(element);
            }
        });
        requCall.forEach(function (element){
            if(!isInArray(foundCalls, element)){
                return false;
            }
        });
        return true;
    }catch(err){
        handleErrors('Bad Url')
    }

}