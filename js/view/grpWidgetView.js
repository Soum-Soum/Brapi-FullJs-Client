/**
 * Add another url to caller's Group
 * @function
 * @param {String} caller - The Caller of the function
 */
function  addUrl(caller){
    $('.badgeToShow').show();
    $(caller).parent().append('<div class=" row  space container-fluid animated pulse ">\n' +
            '<input class="form-control col-7" type="text" value="http://localhost:8080/gigwa/rest/Rice-MSU7/brapi/v1" placeholder="Url">\n' +
            '<input class="form-control col-2" type="text" value="pierre" placeholder="UserName">\n' +
            '<input class="form-control col-2" type="text" value="test" placeholder="Password">\n' +
        '<div class="btn btn-secondary badgeToShow"></div>\n' +
            '<div class="btn btn-success badgeToHide">\n' +
                '<i class="fas fa-check"></i>\n' +
            '</div>\n' +
            '<div class="btn btn-danger badgeToHide">\n' +
                '<i class="fas fa-minus-circle"></i>\n' +
            '</div>\n' +
        '</div>');
    $('.badgeToHide').hide();
}

/**
 * Add another url with preset value to caller's Group
 * @function
 * @param {String} caller - The Caller of the function
 * @param {Urlwithauth} caller - The urlwithauth used for get the preset value
 */
function  addUrl2(caller, urlwithauth){
    $('.badgeToShow').show();
    $(caller).parent().append('<div class=" row  space container-fluid animated pulse ">\n' +
            '<input class="form-control col-7" type="text" value="'+urlwithauth.url+'" placeholder="Url">\n' +
            '<input class="form-control col-2" type="text" value="'+urlwithauth.userName+'" placeholder="UserName">\n' +
            '<input class="form-control col-2" type="text" value="'+urlwithauth.pswrd+'" placeholder="Password">\n' +
        '<div class="btn btn-secondary badgeToShow"></div>\n' +
            '<div hidden class="btn btn-success badgeToHide">\n' +
                '<i class="fas fa-check"></i>\n' +
            '</div>\n' +
            '<div hidden class="btn btn-danger badgeToHide">\n' +
                '<i class="fas fa-minus-circle"></i>\n' +
            '</div>\n' +
        '</div>');
    $('.badgeToHide').hide();
}

/**
 * Remove last url of caller's Group
 * @async
 * @function
 * @param {String} caller - The Caller of the function
 */
async function  rmUrl(caller){
    $('.badgeToHide').hide();
    $('.badgeToShow').show();
    if($(caller).parent().children().length>4){
        $(caller).parent().children().last().addClass('fadeOut');
        sleep(300).then(function () {
            $(caller).parent().children().last().remove();
        });
    }else{

    }

}

/**
 * Add another url group
 * @function
 * @param {String} caller - The Caller of the function
 */
function addGrp(caller){
    $('.badgeToShow').show();
    $(caller).parent().append(
        '<div class="row col-12 lol animated pulse" style="background-color: #2980b9;">\n' +
            '<button type="button" class="space col-5 btn btn-light" onclick="addUrl(this);">Add one URL</button>\n' +
            '<button type="button" class="space col-5 btn btn-dark" onclick="rmUrl(this);">Remove one URL</button>\n' +
            '<button type="button" class="space col-2 btn btn-outline-danger close" aria-label="Close" onclick="rmThisGrp(this);">\n' +
                '<span aria-hidden="true">&times;</span>\n' +
            '</button>\n' +
            '<div class=" row  space container-fluid animated pulse ">\n' +
                '<input class="form-control col-7" type="text" value="http://localhost:8080/gigwa/rest/Rice-MSU7/brapi/v1" placeholder="Url">\n' +
                '<input class="form-control col-2" type="text" value="pierre" placeholder="UserName">\n' +
                '<input class="form-control col-2" type="text" value="test" placeholder="Password">\n' +
                '<div class="btn btn-secondary badgeToShow"></div>\n' +
                '<div class="btn btn-success badgeToHide">\n' +
                    '<i class="fas fa-check"></i>\n' +
                '</div>\n' +
                '<div class="btn btn-danger badgeToHide">\n' +
                    '<i class="fas fa-minus-circle"></i>\n' +
                '</div>\n' +
            '</div>\n' +
        '</div>');
    $('.badgeToHide').hide();
}

/**
 * Add another url to caller's Group without any url inside
 * @function
 * @param {String} caller - The Caller of the function
 */
function  addGrp2(caller) {
    $(caller).parent().append('<div class="row col-12 lol animated pulse" style="background-color: #2980b9;">\n' +
                '<button type="button" class="space col-5 btn btn-light" onclick="addUrl(this);">Add one URL</button>\n' +
                '<button type="button" class="space col-5 btn btn-dark" onclick="rmUrl(this);">Remove one URL</button>\n' +
                '<button type="button" class="space col-2 btn btn-outline-danger close" aria-label="Close" onclick="rmThisGrp(this);">\n' +
                '<span aria-hidden="true">&times;</span>\n' +
                '</button>\n' +
            '</div>\n' +
        '</div>');
}

/**
 * Remove the url group of the caller
 * @async
 * @function
 * @param {String} caller - The Caller of the function
 */
async function rmThisGrp (caller) {
    $(caller).parent().addClass('fadeOut');
    await sleep(400).then(function () {
        $(caller).parent().remove();
    });
}

/**
 * Fill the widget with the group tab generated from the client url
 * @function
 * @param {Array} array - the current GroupTab
 */
function  fillWidget(array) {
    let caller = $('#addGrpId');
    for(let i=0; i<array.length-1; i++){
        addGrp2($(caller));
    }
    let callerChildren = caller.parent().children();
    console.log(callerChildren);
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array[i].length;j++){
            addUrl2($(callerChildren[i+2].children[1]),array[i][j]);
        }
    }
}