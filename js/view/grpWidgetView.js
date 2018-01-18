function  addUrl(caller){
    $(caller).parent().append('<div class=" row space container-fluid animated pulse">\n' +
        '                        <input class="form-control col-8" type="text" value="http://localhost:8080/gigwa/rest/Rice-MSU7/brapi/v1" placeholder="Url">\n' +
        '                        <input class="form-control col-2" type="text" value="pierre" placeholder="UserName">\n' +
        '                        <input class="form-control col-2" type="text" value="test" placeholder="Password">\n' +
        '                    </div>');
}

async function  rmUrl(caller){
    if($(caller).parent().children().length>4){
        $(caller).parent().children().last().addClass('fadeOut');
        sleep(300).then(function () {
            $(caller).parent().children().last().remove();
        });
    }else{

    }

}
function addGrp(caller){
    $(caller).parent().append('<div class="row col-12 lol animated pulse" style="background-color: #2980b9;">\n' +
                    '<button type="button" class="space col-5 btn btn-light" onclick="addUrl(this);">Add one URL</button>\n' +
                    '<button type="button" class="space col-5 btn btn-dark" onclick="rmUrl(this);">Remove one URL</button>\n' +
                    '<button type="button" class="space col-2 btn btn-outline-danger close" aria-label="Close" onclick="rmThisGrp(this);">\n' +
                    '<span aria-hidden="true">&times;</span>\n' +
                    '</button>\n' +
                '<div class=" row space container-fluid animated pulse">\n' +
                    '<input class="form-control  col-8" type="text" value="http://localhost:8080/gigwa/rest/Rice-MSU7/brapi/v1" placeholder="Url">\n' +
                    '<input class="form-control col-2" type="text" value="pierre" placeholder="UserName">\n' +
                    '<input class="form-control col-2" type="text" value="test" placeholder="Password">\n' +
                '</div>\n' +
            '</div>\n' +
        '</div>');
}

async function rmThisGrp (caller) {
    $(caller).parent().addClass('fadeOut');
    await sleep(400).then(function () {
        $(caller).parent().remove();
    });
}