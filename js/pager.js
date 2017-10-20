class PaginationManager{
	
	costructor(evolutionOfPagination){
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
			var arrayOfResp = new Array();
			argumentsArray.askedPage=0;
			var resp = await function_to_launch(argumentsArray);
			argumentsArray.askedPage++;
			var totalPages = resp.metadata.pagination.totalPages;
			var currentPage = resp.metadata.pagination.currentPage;
			arrayOfResp.push(resp.result.data);
			if (currentPage == totalPages-1) {
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
			return arrayOfResp
			}
		}catch(err){
			handleErrors(err);
		}
	}
	updateEvolution(){
		$('.Evolution').show();
		if (this.getEvolutionOfPagination()==100) {$('.Evolution').hide();}
		$('.Evolution').html("Loading : " + this.getEvolutionOfPagination() + "%");
	}
}
