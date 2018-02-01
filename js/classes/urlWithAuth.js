/**
 * urlWithAuth's class
 * @class
 */
class urlWithAuth{
    constructor(){

    }
    /**
     * constructor 2
     * @async
     * @static
     * @function
     * @generator
     * @param {String} url2Pars - Url to pars for create object
     */
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

    /**
     * constructor
     * @async
     * @static
     * @function
     * @generator
     * @param {String} url - the brapiendpoint
     * @param {String} userName - the user Name
     * @param {String} pswrs - the password
     */
    static async staticConstructor(url, userName, pswrs){
        let tempUrl = new urlWithAuth();
        if(await urlBrapiEndPointIsOk(url)){
            tempUrl.url=url;
            tempUrl.pswrd=pswrs;
            tempUrl.userName=userName;
            await tempUrl.connect();
            await tempUrl.allocateCall();
        }
        tempUrl.printUrl();
        return tempUrl;
    }

    /**
     * Conect the current UrlWithAuth
     * @async
     * @function
     */
    async connect(){
        this.token = "";
        if(this.pswrd === "" || this.userName === ""){
            //alert("No Username or Password for this url : " + this.url);
        }else{
            this.token= await getToken(this.userName, this.pswrd, this.url);
        }
    }

    /**
     * allocate call to the current UrlWithAuth
     * @async
     * @function
     */
    async allocateCall(){
        this.callsImplemented=[];
        let tempcalls = await getCalls(this);
        for(let k =0; k<tempcalls.length;k++){
            if(!isInArray(this.callsImplemented, tempcalls[k]['call'])){
                this.callsImplemented.push(tempcalls[k]['call']);
            }
        }
    }

    async reconect(username, pswrd){
        this.userName=username;
        this.pswrd=pswrd;
        await this.connect();
        await this.allocateCall();
    }

    /**
     * print the current UrlWithAuth
     * @function
     */
    printUrl(){
        console.log(this.url);
        console.log(this.userName);
        console.log(this.pswrd);
        console.log(this.callsImplemented)
    }
}