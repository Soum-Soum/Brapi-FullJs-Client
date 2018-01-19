class urlWithAuth{
    constructor(){

    }

    static async staticConstructor2(url2Pars){
        let tempUrl = new urlWithAuth();
        if(url2Pars!==""){
            let tempString = url2Pars.substring(7);
            let tab = tempString.substring(0,tempString.lastIndexOf('@')).split(':');
            let url = tempString.substring(tempString.lastIndexOf('@')+1);
            url=url2Pars.substring(0,7) + url;
            if(await urlBrapiEndPointIsOk(url)){
                tempUrl.url=url;
                tempUrl.userName = tab[0];
                tempUrl.pswrd=tab[1];
                await tempUrl.connect();
                await tempUrl.allocateCall();
            }
        }
        tempUrl.printUrl();
        return tempUrl;
    }

    static async staticConstructor(url, userName, pswrs){
        let tempUrl = new urlWithAuth();
        if(await urlBrapiEndPointIsOk(url)){
            tempUrl.url=url;
            tempUrl.pswrd=pswrs;
            tempUrl.userName=userName;
            tempUrl.connect();
            tempUrl.allocateCall();
        }
        tempUrl.printUrl();
        return tempUrl;
    }

    async connect(){
        this.token = "";
        if(this.pswrd === "" || this.userName === ""){
            alert("No Username or Password for this url : " + this.url);
        }else{
            this.token= await getToken(this.userName, this.pswrd, this.url);
            if(isEndPointInUrl){
                if(this.token===""){alert("Bad Username or password, You're are loged as public user to " + this.url +  ", so you only have acces to public data");}
                else{alert("You're loged as private user to " + this.url);}
            }
        }
    }

    async allocateCall(){
        this.callsImplemented=[];
        let tempcalls = await getCalls(this);
        for(let k =0; k<tempcalls.length;k++){
            if(!isInArray(this.callsImplemented, tempcalls[k]['call'])){
                this.callsImplemented.push(tempcalls[k]['call']);
            }
        }
    }

    printUrl(){
        console.log(this.url);
        console.log(this.userName);
        console.log(this.pswrd);
        console.log(this.callsImplemented)
    }
}