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
                tempUrl.token= await getToken(tempUrl.userName, tempUrl.pswrd, tempUrl.url);
                tempUrl.callsImplemented=[];
                let tempcalls = await getCalls(tempUrl);
                for(let k =0; k<tempcalls.length;k++){
                    if(!isInArray(tempUrl.callsImplemented, tempcalls[k]['call'])){
                        tempUrl.callsImplemented.push(tempcalls[k]['call']);
                    }
                }
            }else{
                tempUrl.userName=null;
                tempUrl.pswrd=null;
                tempUrl.url=null;
                tempUrl.token=null;
                //a changer ???
            }

        }
        return tempUrl;
    }

    static staticConstructor(url, userName, pswrs, token){
        let tempUrl = new urlWithAuth();
        tempUrl.url=url;
        tempUrl.pswrd=pswrs;
        tempUrl.userName=userName;
        tempUrl.token=token;
        return tempUrl;
    }

    printUrl(){
        console.log(this.url);
        console.log(this.userName);
        console.log(this.pswrd);
        console.log(this.callsImplemented)
    }
}