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

function callsAreInArray(resp, requCall){
    try {
        let foundCalls = [];
        console.log(resp);
        removeAll(resp, undefined);
        removeAll(resp, null);
        resp.forEach(function (element){
            element.result.data.forEach(function (element2){
                if(!isInArray(foundCalls, element2.call)){
                    foundCalls.push(element2.call);
                }
            });
        });
        requCall.forEach(function (element){
            if(!isInArray(foundCalls, element)){
                console.log(false);
                return false;
            }
        });
        return true;
    }catch(err){
        handleErrors('Bad Url')
    }

}