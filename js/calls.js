/**
 * Removes url group that do not implement the required calls
 * @function
 * @async
 */
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
        return groupTab.length>0;

    }catch (err){
        handleErrors('Unable to check if required calls are available');
    }
}

/**
 * True if requ calls are in the resp array
 * @function
 * @param {array} resp - reponse of GetCall function
 * @param {array} requCall - Array of requ call
 */
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
        handleErrors('Unable to check if the current call is in the table')
    }

}