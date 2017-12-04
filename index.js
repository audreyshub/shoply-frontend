let itemExists = function(name) {
	let allTheSpans = $('span')
	
	allTheSpans.forEach((element, index) => {
		console.log(element.target.value)

        
    });
}


console.log('hello')
let createItemHTML = function(element) {

    let html = ''
    if (element.check === true) {
        html += `<div class="checked">`
        html += `<span>${element.name} (${element.quantity}) - $${element.price}  </span>`
        html += `<i class="fa fa-trash delete" value="${element._id}" aria-hidden="true" title="Click here to delete item"></i>`
        html += `<i class="fa fa-check-square check" value="${element._id}" aria-hidden="true" title="Click here to check/uncheck item"></i>`
        html += `</div>`
    } else {
        html += `<div>`
        html += `<span>${element.name} (${element.quantity}) - $${element.price}  </span>`
        html += `<i class="fa fa-trash delete" value="${element._id}" aria-hidden="true" title="Click here to delete item"></i>`
        html += `<i class="fa fa-check-square check" value="${element._id}" aria-hidden="true" title="Click here to check/uncheck item"></i>`
        html += `</div>`
    };
    return html;
}

$.get('http://localhost:3232/item/all', (result, error) => {
    console.log(result);
    result.forEach((element, index) => {
        $('.shopping-list').append(createItemHTML(element));
    });
})


$('.send').click(() => {
    console.log('button click');
    itemExists();
    return
    let newItem = {
        name: $('.name').val(),
        price: $('.price').val(),
        quantity: $('.quantity').val()
    }

    $.ajax({
        url: 'http://localhost:3232/item/create',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(newItem),
        success: function(data) {
            console.log(data);
            $('.shopping-list').append(createItemHTML(data));
            $('input').val(''); //reset inputs
        },
        error: function(error) {
            console.log(error);
        }
    });
    


})

$('body').delegate('.delete', 'click', (event) => {

    console.log(event.target.attributes.value.nodeValue);
    $.ajax({
        url: 'http://localhost:3232/item/remove/' + event.target.attributes.value.nodeValue,
        dataType: 'json',
        type: 'delete',
        contentType: 'application/json',

        success: function(data) {

            $(event.target).parent().remove();
        },
        error: function(error) {
            swal("Oh no!", "An error happened!", "error");
        }
    });
})

$('body').delegate('.check', 'click', (event) => {
    if ($(event.target).parent().css("text-decoration") == "line-through solid rgb(128, 128, 128)") {
        //to make uncheck
        $.ajax({
            url: 'http://localhost:3232/item/uncheck/' + event.target.attributes.value.nodeValue,
            dataType: 'json',
            type: 'patch',
            contentType: 'application/json',

            success: function(data) {
                $(event.target).parent().css("text-decoration", "none");
                $(event.target).parent().css("color", "black");
                console.log(data);
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:3232/item/check/' + event.target.attributes.value.nodeValue,
            dataType: 'json',
            type: 'patch',
            contentType: 'application/json',

            success: function(data) {
                $(event.target).parent().css("text-decoration", "line-through");
                $(event.target).parent().css("color", "gray");
                console.log(data);
            },
            error: function(error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    }
})