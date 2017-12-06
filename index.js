let itemExists = function (name) {
    let text;
    let nameRegExp;
    let match;
    let toReturn = false;

    $("span").each(function (index, elem) {
        text = $(elem).text();
        nameRegExp = new RegExp(name);
        match = text.match(nameRegExp);

        if(match) {
            swal("Oh no!", "This item already exist", "error");
            toReturn = true;
            return;
        }
    });

    return toReturn;
};


let createItemHTML = function (element) {
    let html = ''
    if (element.check === true) {
        html += `<div class="checked">`
        html += `<span>${element.name} (${element.quantity}) - $${element.price}</span>`

        html += `<i class="fa fa-trash delete" value="${element._id}" aria-hidden="true" title="Click to delete item"></i>`
        html += `<i class="fa fa-check-square-o check" value="${element._id}" aria-hidden="true" title="Click to check/uncheck item"></i>`
        html += `<i class="fa fa-cutlery recipes" value="${element.name}" aria-hidden="true" title="Click to see recipes"></i>`
        html += `</div>`
    } else {
        html += `<div>`
        html += `<span>${element.name} (${element.quantity}) - $${element.price}  </span>`

        html += `<i class="fa fa-trash delete" value="${element._id}" aria-hidden="true" title="Click to delete item"></i>`
        html += `<i class="fa fa-check-square-o check" value="${element._id}" aria-hidden="true" title="Click to check/uncheck item"></i>`
        html += `<i class="fa fa-cutlery recipes" value="${element.name}" aria-hidden="true" title="Click to see recipes"></i>`
        html += `</div>`
    }
    ;
    return html;
}

$.get('http://localhost:3232/item/all', (result, error) => {
    console.log(result);
    result.forEach((element, index) => {
        $('.shopping-list').append(createItemHTML(element));
    });
})


$('.send').click(() => {
    if(itemExists($('.name').val())) {
        return;
    }
    let newItem = {
        name: $('.name').val(),
        price: $('.price').val(),
        quantity: $('.quantity').val()
    };

    $.ajax({
        url: 'http://localhost:3232/item/create',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(newItem),
        success: function (data) {
            console.log(data);
            $('.shopping-list').append(createItemHTML(data));
            $('input').val(''); //reset inputs
        },
        error: function (error) {
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

        success: function (data) {

            $(event.target).parent().remove();
        },
        error: function (error) {
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

            success: function (data) {
                $(event.target).parent().css("text-decoration", "none");
                $(event.target).parent().css("color", "black");
                console.log(data);
            },
            error: function (error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    } else {
        $.ajax({
            url: 'http://localhost:3232/item/check/' + event.target.attributes.value.nodeValue,
            dataType: 'json',
            type: 'patch',
            contentType: 'application/json',

            success: function (data) {
                $(event.target).parent().css("text-decoration", "line-through");
                $(event.target).parent().css("color", "gray");
                console.log(data);
            },
            error: function (error) {
                swal("Oh no!", "An error happened!", "error");
            }
        });
    }
})

let appId = "fa748d22";
let apiKey = "a51720f32aa7289581710a82264086eb";


let createRecipeHtml = function(element) {
    let html = ""
    html += `<div class ="recipe">`
    html += `<img src="${element.recipe.image}" class="recipe-img">`
    html += `<h2><a href="${element.recipe.url}" target="blank" class="recipe-link">${element.recipe.label}</a></h2>`
    html += `</div>`
    return html;
}

$('body').delegate('.recipes', 'click', (event) => {
    console.log(event.target.attributes.value.nodeValue);
    let query = event.target.attributes.value.nodeValue;
    $.get(`https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${apiKey}`, (result, error) => {
        $('.recipes-container').html("");
        console.log(result);
        $('.recipes-container').append(`<h2>Recipe ideas for ${query}:</h2>`);
        for (let i = 0; i < result.hits.length; i++) {

            $('.recipes-container').append(createRecipeHtml(result.hits[i]));
            console.log(result.hits[i].recipe.label);
            //swal(`Here's a recipe idea for ${query}!`, `${result.hits[i].recipe.label}${result.hits[i].recipe.image}`);
            //swal({
            //title: `Recipe idea for ${query}:`,
            //text: `${result.hits[0].recipe.label}`,
            //icon: `${result.hits[0].recipe.image}`


            //});
        }

    })
})

$('.tutorial').click(() => {
	swal({
		title: "Tutorial",
		text: "START by adding items to shopping list. DELETE button deletes item. CHECK button checks or unchecks item. Fork and knife button shows RECIPES for an item. Scroll right on recipes to see more recipes. Click on a recipe name to go to recipe page. ENJOY!",
		icon: "info"
		
	})

})





