
$(document).ready(function(){
    // GLOBAL VARIABLES
    // Array includes all of the intial buttons to be displayed
    var topics = ["Hey Arnold", "Fresh Prince", "Aaahh!!! Real Monsters", "Daria", "All That", "Courage the Cowardly Dog", "Pokémon", "Sailor Moon", "CatDog", "PowerPuff Girls"];

    // Media Files    
    // Daria
    var daria = $("<audio>");
    daria.attr("src", "./assets/media/Daria.mp3");
    // Hey Arnold
    var arnold = $("<audio>");
    arnold.attr("src", "./assets/media/HeyArnold.mp3");
    // Fresh Prince
    var prince = $("<audio>");
    prince.attr("src", "./assets/media/FreshPrince.mp3");
    // Sailor Moon
    var sailor = $("<audio>");
    sailor.attr("src", "./assets/media/SailorMoon.mp3");
    // PowerPuff Girls
    var power = $("<audio>");
    power.attr("src", "./assets/media/PowerpuffGirls.mp3");
    // All That
    var allThat = $("<audio>");
    allThat.attr("src", "./assets/media/AllThat.mp3");
    
    // FUNCTIONS
    // Populates topic buttons
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
    // Populates gifs
    function renderGifs() {
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
                var imageStillSrc = `https://media0.giphy.com/media/${imageId}/200_s.gif`;
                var imageAnimateSrc = `https://media0.giphy.com/media/${imageId}/200.gif`;
                // var imageSource = response.data[i].images.fixed_height.url;
                var imageId = response.data[i].id;
                newMedia.attr("data-still", imageStillSrc);
                newMedia.attr("data-animate", imageAnimateSrc);
                newMedia.attr("data-state", "still");
                // assigns image source to <img> element
                newMedia.attr("src", imageStillSrc);
                newMedia.addClass("gif");
                var rating = $("<p>");
                rating.text(`Rating: ${response.data[i].rating.toUpperCase()}`);
                // creates button to add to favorites
                var addToFav = $("<button>");
                // text for add to favorites button
                addToFav.text("Add to Favorites");
                // adding classes for this button
                addToFav.addClass("btn btn-info add-fav");
                // appending image and button to new gif div
                newGif.append(newMedia, rating, addToFav);
                // adding class to newGif for later targeting
                newGif.addClass("new-gif");
                // prepends to the #gif-area div
                $("#gif-area").prepend(newGif);
            }
        });
    }
    // Allows toggling between animated and still states of each gif
    function animateGifs() {
        var state = $(this).attr("data-state");
        var animated = $(this).attr("data-animate");
        var still = $(this).attr("data-still");
        if (state === "still") {
            $(this).attr("src", animated);
            $(this).attr("data-state", "animate");
        } else if (state === "animate") {
            $(this).attr("src", still);
            $(this).attr("data-state", "still");
        }
    }
    // Enables addition of button via input field
    function addShow(event) {
        // prevent default method to avoid submit form default
        event.preventDefault();
        // Get value of the user's input and save to var
        var input = $("#tv-input").val().trim();
        // push new value into the topics array
        topics.push(input);
        // rerun function to populate buttons
        renderButtons();
    }
    // Enables individual addition of targeted gif under Favorites section
    function addFavorites() {
        // changing text of button with add-fav class
        var addBtn = $(this)[0];
        addBtn.firstChild.data = "Added to favorites";
        // creating a new div that will hold clone of favorite gif
        var newFav = $("<div>");
        newFav.addClass("new-fav");
        // grabs info from selected div and clones it
        var favGif = $(this).prevAll().clone();
        // creates button allowing for removal of favorited gif
        var removeFav = $("<button>");
        removeFav.addClass("btn btn-info my-fav remove");
        removeFav.text(`Remove from Favorites`);
        // appending gif and removal button to newFav div
        newFav.append(favGif[1], removeFav);
        // adding newFav div to favorites section
        $("#fav").append(newFav);
        // running function to allow for removal of favorite gifs
        removeFavs();
        // Local Storage 
        // save variable in cookies so that the page refresh won't wipe it clean
        // sessionStorage.setItem("favorite", $("img"));
        // console.log(sessionStorage);
        // var favoritesArea = $("#favorites-area");
    }
    // Enables individual removal of targeted gif under Favorites section
    function removeFavs() {
        if ($("button").hasClass("remove")) {
            $(".remove").on("click", function(){
                var gifContent = $(this).prevAll();
                var gifButton = $(this);
                gifContent.remove();
                gifButton.remove();
            });  
        }
    }
    // Empties everything from #favs section
    function clearFavs() {
        $("#fav").empty();
    }

    // GAME CLICK EVENTS
    // Renders gifs when one of the buttons is clicked
    $(document).on("click", ".tv-show", renderGifs);
    // Toggles animation of gifs when the image is clicked
    $(document).on("click", ".gif", animateGifs);
    // Adds button according to the user's input
    $("#add-show").on("click", addShow);
    // Enables functionality of adding to and removing from Favorites section
    $("#gif-area").on("click", ".add-fav", addFavorites);
    // Empties everything from #favs section
    $("#clear-favs").on("click", clearFavs);

    // MEDIA CLICK EVENTS
    $("#daria-play").on("click", function(){
        daria.get(0).play();
    });
    $("#arnold-play").on("click", function(){
        arnold.get(0).play();
    });
    $("#prince-play").on("click", function(){
        prince.get(0).play();
    });
    $("#sailor-play").on("click", function(){
        sailor.get(0).play();
    });
    $("#power-play").on("click", function(){
        power.get(0).play();
    });
    $("#all-play").on("click", function(){
        allThat.get(0).play();
    });
    // Pauses any of the buttons
    $("#pause").on("click", function(){
        daria.get(0).pause();
        arnold.get(0).pause();
        prince.get(0).pause();
        sailor.get(0).pause();
        power.get(0).pause();
        allThat.get(0).pause();
    });

    renderButtons();
});
