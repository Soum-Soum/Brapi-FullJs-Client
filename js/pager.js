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
                console.log(arrayOfResp);
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

	async is1Page(function_to_launch, argumentsArray){
		try{
			argumentsArray.askedPage=0;
			let resp = await function_to_launch(argumentsArray);
			let totalPages = resp.metadata.pagination.totalPages;
			let currentPage = resp.metadata.pagination.currentPage;
			return currentPage === totalPages - 1;
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
