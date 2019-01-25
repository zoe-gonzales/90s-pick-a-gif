
$(document).ready(function(){
    // Array includes all of the intial buttons to be displayed
    var topics = ["Hey Arnold", "Fresh Prince", "Aaahh!!! Real Monsters", "Daria", "All That", "Courage the Cowardly Dog", "Pokémon", "Sailor Moon", "CatDog", "PowerPuff Girls"];

    // FUNCTIONS
    // Function displays buttons dynamically - loops through the topics array
    function renderButtons() {
        // start by emptying the button-area div every time so that there are no duplicates
        $("#button-area").empty();
        for (var i=0; i < topics.length; i++) {
            // create button element for each array item
            var button = $("<button>");
            // Add classes
            button.addClass("btn btn-info tv-show");
            // Add data attribute
            button.attr("data-name", topics[i]);
            // Add text
            button.text(topics[i]);
            // Append to #button-area
            $("#button-area").append(button);
        }
        
    }

    // CLICK EVENTS
    // When user clicks on one of the pre-populated buttons
    $(document).on("click", ".tv-show", function(event){
        // saves data of clicked button
        var show = $(this).data("name");
        var queryURL = `https://api.giphy.com/v1/gifs/search?q=${show}&limit=10&rating=pg-13&api_key=naqRbjAruZNru757XG6cSQyLUVmUQ3EC`;

        // AJAX call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            // loops through array of available gifs (should be 10 in total)
            for (var i=0; i < response.data.length; i++) {
                // makes div to hold gif and other info
                var newGif = $("<div>");
                // makes new image element for each gif
                var newMedia = $("<img>");
                // retrieves image url from object and saving to variable
                var imageSource = response.data[i].images.fixed_height.url;
                // assigns image source to <img> element
                newMedia.attr("src", imageSource);
                // creates button to add to favorites
                var addToFav = $("<button>");
                addToFav.text("Add to Favorites");
                addToFav.addClass("btn btn-info add-fav");
                newGif.append(newMedia);
                newGif.append(addToFav);
                newGif.addClass("new-gif");
                // prepends to the #gif-area div
                $("#gif-area").prepend(newGif);
            }
        });
    });
        
    // When user inputs new topic into the #tv-input div and clicks #add-show
    $("#add-show").on("click", function(event){
        // prevent default method to avoid submit form default
        event.preventDefault();
        // Get value of the user's input and save to var
        var input = $("#tv-input").val();
        // push new value into the topics array
        topics.push(input);
        // rerun function to populate buttons
        renderButtons();
    });

    $(document).on("click", ".add-fav", function(){
        $("#favorites-area").prepend(".new-gif");
    });
        
    renderButtons();
})
