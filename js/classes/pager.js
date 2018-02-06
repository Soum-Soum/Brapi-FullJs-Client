/**
 * urlWithAuth's class
 * @class
 */
class PaginationManager{
       /**
     * pager's constructor
     * @function
     * @generator
     * @param {Integer} evolutionOfPagination - the base evolution Of Pagination index
     */
    constructor(evolutionOfPagination, currentLoadingBarId){
		this.evolutionOfPagination=evolutionOfPagination;
        this.currentLoadingBarId = currentLoadingBarId;
    }

	getEvolutionOfPagination(){
		return this.evolutionOfPagination;
	}

	setEvolutionOfPagination(newValue){
		this.evolutionOfPagination=newValue;
	}

    /**
     * return the resp array
     * @async
     * @function
     * @param {Function} function_to_launch - function to launch
	 * @param {Array} argumentsArray - arguments Array
     */
	async pager(function_to_launch, argumentsArray){
		try{
			this.setEvolutionOfPagination(0);
			this.updateEvolution();
			let arrayOfResp = [];
			argumentsArray.askedPage=0;
			let resp = await function_to_launch(argumentsArray);
            argumentsArray.askedPage++;
			let totalPages = resp.metadata.pagination.totalPages;
			let currentPage = resp.metadata.pagination.currentPage;
            this.setEvolutionOfPagination(Math.round((currentPage+1)/(totalPages)*100));
            console.log(Math.round((currentPage+1)/(totalPages)*100));
            this.updateEvolution();
			arrayOfResp.push(resp.result.data);
			if (currentPage === totalPages-1) {
				this.setEvolutionOfPagination(100);
				this.updateEvolution();
				return arrayOfResp;
			}else{
				while(argumentsArray.askedPage <= totalPages-1){
					resp = await function_to_launch(argumentsArray);
					this.setEvolutionOfPagination(Math.round((argumentsArray.askedPage+1)/(totalPages)*100));
					console.log(Math.round((argumentsArray.askedPage+1)/(totalPages)*100));
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

    /**
     * return the first page
     * @async
     * @function
     * @param {Function} function_to_launch - function to launch
     * @param {Array} argumentsArray - arguments Array
     */
	async getFirstPage(function_to_launch, argumentsArray){
        try{
        	this.setEvolutionOfPagination(0);
        	this.updateEvolution();
            argumentsArray.askedPage=0;
            let resp = await function_to_launch(argumentsArray);
            this.setEvolutionOfPagination(100);
            this.updateEvolution();
            return [resp.result.data];
        }catch (err){
            handleErrors();
        }

	}

    /**
     * return true if the type liste is a complete list
     * @async
     * @function
     * @param {Function} function_to_launch - function to launch
     * @param {Array} argumentsArray - arguments Array
	 * @param {Array} arrayOfMarkersType - array Of MarkersType
     */
	async isCompleteTypeList(function_to_launch, argumentsArray,arrayOfMarkersType){
		let tantamount= 0, count = 0, currentNumber = 0 , max = 0, resp=null;
        try{
        	this.setEvolutionOfPagination(0);
        	this.updateEvolution();
            argumentsArray.askedPage=0;
            argumentsArray.pageSize=1;
            resp= await function_to_launch(argumentsArray);
            tantamount=resp.metadata.pagination.totalCount;
		    for(let i=0; i<arrayOfMarkersType.length;i++){
		    	if(arrayOfMarkersType[i]!== undefined && arrayOfMarkersType[i]!== null && arrayOfMarkersType[i]!==''){
		    		argumentsArray.askedType=arrayOfMarkersType[i];
                    resp = await function_to_launch(argumentsArray);
                    this.setEvolutionOfPagination(Math.round(((i+1)/(arrayOfMarkersType.length))*100));
                    if(this.evolutionOfPagination!==100){
                        this.updateEvolution();
                    }
                    currentNumber = resp.metadata.pagination.totalCount;
                    if(currentNumber>max){
                    	max=currentNumber;
                    	mostPresentType =arrayOfMarkersType[i];
                    }
                    count += currentNumber;
				}
            }
            this.evolutionOfPagination=100;
			this.updateEvolution();
            return tantamount === count;
		}catch(err){
			handleErrors(err);
		}
	}

    /**
     * update Evolution of pagination
     * @function
     */
	updateEvolution(){
        setProgresBarValue(this.currentLoadingBarId,this.getEvolutionOfPagination());
	}
}
