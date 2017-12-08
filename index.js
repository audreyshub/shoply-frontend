//Hoisting: Declare on top of the functions and variables to keep organized code
let appId = "fa748d22";
let apiKey = "a51720f32aa7289581710a82264086eb";

let itemExists = function (name) {
    let text;
    let nameRegExp;
    let match;
    let toReturn = false;

    $("span").each(function (index, elem) {
        text = $(elem).text();
        nameRegExp = new RegExp(name);
        match = text.match(nameRegExp);

        if (match) {
            swal("Oh no!", "This item already exist", "error");
            toReturn = true;
            return;
        }
    });

    return toReturn;
};

let createItemHTML = function (element) {
    let html = '';

    if (element.check === true) {
        html += `<div class="checked">`;
    } else {
        html += `<div>`;
    }

    html += `<span>${element.name} (${element.quantity}) - $${element.price}</span>`;
    html += `<i class="fa fa-trash delete" value="${element._id}" aria-hidden="true" title="Click to delete item"></i>`;
    html += `<i class="fa fa-check-square-o check" value="${element._id}" aria-hidden="true" title="Click to check/uncheck item"></i>`;
    html += `<i class="fa fa-cutlery recipes" value="${element.name}" aria-hidden="true" title="Click to see recipes"></i>`;
    html += `</div>`;

    return html;
};

let createRecipeHtml = function (element) {
    let html = "";
    html += `<div class ="recipe">`;
    html += `<h2><a href="${element.recipe.url}" target="blank" class="recipe-link">${element.recipe.label}</a></h2>`;
    html += `<img src="${element.recipe.image}" class="recipe-img" alt="${element.recipe.label}">`;
    html += `</div>`;
    return html;
};

$(document).ready(() => {
    $.get('http://localhost:3232/item/all', (result, error) => {
        if (error) {
            console.log(error);
        }
        if (result.length === 0) {
        	$('.shopping-list').append('<p class="no-items">There are currently no items in shopping list.</p>');
        }
        result.forEach((element) => {
            $('.shopping-list').append(createItemHTML(element));
        });
    });

    $('.send').click(() => {
        if(!($('.name').val())) {
            swal("Oh no!", "You have to fill something in the input", "error");
            return false;
        }

        if (itemExists($('.name').val())) {
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
                $('.no-items').remove();
                $('.shopping-list').append(createItemHTML(data));
                $('input').val(''); //reset inputs
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('body').delegate('.delete', 'click', (event) => {
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
    });

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
                },
                error: function (error) {
                    swal("Oh no!", "An error happened!", "error");
                }
            });
        }
    });

    $('body').delegate('.recipes', 'click', (event) => {
        let query = event.target.attributes.value.nodeValue;
        $.get(`https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${apiKey}`, (result, error) => {
            $('.recipes-container').html("");
            console.log(result);
            $('.recipes-container').append(`<h1>Recipe ideas for ${query}:</h1>`);
            $('html, body').animate({
                scrollTop: ($('.recipes-container').offset().top)
            }, 500);
            for (let i = 0; i < result.hits.length; i++) {
                $('.recipes-container').append(createRecipeHtml(result.hits[i]));
            }
        });
    });

    $('.tutorial').click(() => {
        swal({
            title: "Tutorial",
            text: "Start by adding items to shopping list. DELETE button deletes item. CHECK button checks or unchecks item. Fork and knife button shows RECIPES for an item. Scroll right on recipes to see more recipes. Click on a recipe name to go to recipe page. ENJOY!",
            icon: "images/icons.png"
        })
    });

    $('.color-blind').on('click', () => {
        $('.normal-color').show();
        $('.color-blind').hide();
        $('.check').css("color", "gray");
        $('.delete').css("color", "blue");
        $('.send').css("background-color", "red");
        $('html, body').animate({
                scrollTop: ($('.shopping-list').offset().top)
            }, 500);
    });

    $('.normal-color').on('click', () => {
        $('.normal-color').hide();
        $('.color-blind').show();
        $('.check').css("color", "green");
        $('.delete').css("color", "red");
        $('.send').css("background-color", "#4CAF50");
        $('html, body').animate({
                scrollTop: ($('.shopping-list').offset().top)
            }, 500);
    });
});