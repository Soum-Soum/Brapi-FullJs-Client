class PaginationManager{
    constructor(evolutionOfPagination){
		this.evolutionOfPagination=evolutionOfPagination;
	}

	getEvolutionOfPagination(){
		return this.evolutionOfPagination;
	}

	setEvolutionOfPagination(newValue){
		this.evolutionOfPagination=newValue;
	}

	async pager(function_to_launch, argumentsArray){
		try{
			let arrayOfResp = [];
			argumentsArray.askedPage=0;
			let resp = await function_to_launch(argumentsArray);
			argumentsArray.askedPage++;
			let totalPages = resp.metadata.pagination.totalPages;
			let currentPage = resp.metadata.pagination.currentPage;
			arrayOfResp.push(resp.result.data);
			if (currentPage === totalPages-1) {
				this.setEvolutionOfPagination(100);
				this.updateEvolution();
				return arrayOfResp;
			}else{
				while(argumentsArray.askedPage <= totalPages-1){
					resp = await function_to_launch(argumentsArray);
					this.setEvolutionOfPagination(Math.round(argumentsArray.askedPage/(totalPages-1)*100));
					this.updateEvolution();
					argumentsArray.askedPage++;
					arrayOfResp.push(resp.result.data);
				}
			    return arrayOfResp;
			}
		}catch(err){
			handleErrors(err);
		}
	}

	async getFirstPage(function_to_launch, argumentsArray){
        try{
            argumentsArray.askedPage=0;
            let resp = await function_to_launch(argumentsArray);
            return [resp.result.data];
        }catch (err){
            handleErrors();
        }

	}

	async isCompleteTypeList(function_to_launch, argumentsArray,arrayOfMarkersType){
		let tantamount= 0, count = 0, currentNumber = 0 , max = 0, resp=null;
        try{
            argumentsArray.askedPage=0;
            argumentsArray.pageSize=1;
            console.log(argumentsArray);
            resp= await function_to_launch(argumentsArray);
            console.log(resp);
            tantamount=resp.metadata.pagination.totalCount;
            console.log(tantamount);
		    for(let i=0; i<arrayOfMarkersType.length;i++){
		    	console.log(arrayOfMarkersType[i]);
		    	if(arrayOfMarkersType[i]!== undefined && arrayOfMarkersType[i]!== null && arrayOfMarkersType[i]!==''){
		    		argumentsArray.askedType=arrayOfMarkersType[i];
                    resp = await function_to_launch(argumentsArray);
                    console.log(resp);
                    currentNumber = resp.metadata.pagination.totalCount;
                    if(currentNumber>max){
                    	max=currentNumber;
                    	mostPresentType =arrayOfMarkersType[i];
                    }
                    count += currentNumber;
                    console.log(count);
				}
            }
            return tantamount === count;
		}catch(err){
			handleErrors(err);
		}
	}

	updateEvolution(){
		$('.Evolution').show();
		if (this.getEvolutionOfPagination()===100) {$('.Evolution').hide();}
		$('.Evolution').html("Loading : " + this.getEvolutionOfPagination() + "%");
	}
}
