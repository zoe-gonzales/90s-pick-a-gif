
$(document).ready(function(){
    // GLOBAL VARIABLES
    // Array includes all of the intial buttons to be displayed
    var topics = ["Hey Arnold", "Fresh Prince", "Aaahh!!! Real Monsters", "Daria", "All That", "Courage the Cowardly Dog", "Pokémon", "Sailor Moon", "CatDog", "PowerPuff Girls"];
    var currentTopic = "";
    var offsetNum = 0;
    var musicPlaying = false;
    var favNum = 0;

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
        currentTopic = show;
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
                // saving image Id to var to be used in src url
                var imageId = response.data[i].id;
                // retrieves image url from object and saving to variable
                var imageStillSrc = `https://media0.giphy.com/media/${imageId}/200_s.gif`;
                var imageAnimateSrc = `https://media0.giphy.com/media/${imageId}/200.gif`;
                // defining attributes for the new gif
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
        // Clearing values in input field
        $("#tv-input").val("");
        // push new value into the topics array
        topics.push(input);
        // rerun function to populate buttons
        renderButtons();
    }
    // Enables individual addition of targeted gif under Favorites section
    function addFavorites() {
        // changing text of button with add-fav class
        var addBtn = $(this)[0];
        addBtn.firstChild.data = "Added to Favorites";
        // creating a new div that will hold clone of favorite gif
        var newFav = $("<div>");
        newFav.addClass("new-fav");
        // grabs info from selected div and clones it
        var favGif = $(this).prevAll().clone();
        // creates button allowing for removal of favorited gif
        var removeFav = $("<button>");
        removeFav.addClass("btn btn-info my-fav remove");
        removeFav.text(`Remove from Favorites`);
        removeFav.attr("data-id", favNum);
        // appending gif and removal button to newFav div
        newFav.append(favGif[1], removeFav);

        // saving key info to localStorage for later
        localStorage.setItem("num-favorites", favNum);
        localStorage.setItem("rating-" + favNum, JSON.stringify(favGif[0].innerHTML));
        localStorage.setItem("gif-dataset-" + favNum, JSON.stringify(favGif[1].dataset));

        // adding newFav div to favorites section
        $("#fav").append(newFav);
        // running function to allow for removal of favorite gifs
        removeFavs();
        favNum++;
    }
    // Enables individual removal of targeted gif under Favorites section
    function removeFavs() {
        // targets only buttons with class of 'remove'
        if ($("button").hasClass("remove")) {
            $(".remove").on("click", function(){
                // removing elements from DOM
                var gifContent = $(this).prevAll();
                var gifButton = $(this);
                gifContent.remove();
                gifButton.remove();
                // targeting localStorage items with data-id
                var itemId = $(this).attr("data-id");
                // removing items from localStorage
                localStorage.removeItem("rating-" + itemId);
                localStorage.removeItem("gif-dataset-" + itemId);
                // getting value of "num-favorites" to determine whether or not to remove it or decrement
                var currentStoredNum = parseInt(localStorage.getItem("num-favorites"));
                if (currentStoredNum > 0) {
                    currentStoredNum = currentStoredNum - 1;
                    localStorage.setItem("num-favorites", JSON.stringify(currentStoredNum));
                } else {
                    localStorage.removeItem("num-favorites");
                    favNum = 0;
                }
            });  
        }
        
    }
    // Empties everything from #favs section
    function clearFavs() {
        $("#fav").empty();
        // clear localStorage
        favNum = 0;
        localStorage.clear();
    }
    // Retrieves 10 new gifs with each click
    function addTen() {  
        offsetNum += 10;
        var queryURL = `https://api.giphy.com/v1/gifs/search?q=${currentTopic}&limit=10&rating=pg-13&offset=${offsetNum}&api_key=naqRbjAruZNru757XG6cSQyLUVmUQ3EC`;
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
                // saves image Id to variable for use below.
                var imageId = response.data[i].id;
                // retrieves image url from object and saving to variable
                var imageStillSrc = `https://media0.giphy.com/media/${imageId}/200_s.gif`;
                var imageAnimateSrc = `https://media0.giphy.com/media/${imageId}/200.gif`;                
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
            };
        });
        
    }
    // Saves favorite gifs in localStorage and retrieves and displays them on page load
    function getStoredFavs() {
        var savedCount = localStorage.getItem("num-favorites");
        // checking that there is something in localStorage 
        // if true, adds to the value currently held in localStorage
        if (savedCount) {
            favNum = parseInt(savedCount) + 1;
        } else { // else sets to 0
            favNum = 0;
        }     
        // re-appending divs and data from localStorage to Favorites section
        for (var i=0; i < favNum; i++) {
            var savedDiv = $("<div>");
            savedDiv.addClass("new-fav saved-fav");
            var savedGif = $("<img>");
            var animateImgSrc = JSON.parse(localStorage.getItem("gif-dataset-" + i)).animate;
            var stillImgSrc = JSON.parse(localStorage.getItem("gif-dataset-" + i)).still;
            savedGif.attr("data-animate", animateImgSrc);
            savedGif.attr("data-still", stillImgSrc);
            savedGif.attr("data-state", JSON.parse(localStorage.getItem("gif-dataset-" + i)).state);
            savedGif.attr("src", stillImgSrc);
            savedGif.addClass("gif");
            var savedRating = $("<p>");
            var removeBtn = $("<button>");
            removeBtn.addClass("btn btn-info my-fav remove");
            removeBtn.text("Remove from favorites");
            removeBtn.attr("data-id", i);
            savedRating.text(JSON.parse(localStorage.getItem("rating-" + i)));
            savedDiv.append(savedGif, savedRating, removeBtn);
            $("#fav").append(savedDiv);
        }
        // Allows the re-populated gifs to be removed
        removeFavs();
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
    // Adds 10 of the current topics's gifs to the page
    $("#add-10").on("click", addTen);

    // MEDIA CLICK EVENTS - checks for whether or not music is playing, if the track has ended
    $("#daria-play").on("click", function(){
        if (!musicPlaying) {
            daria.get(0).play();
            musicPlaying = true;
        }
    });

    daria.on("ended", function(){
        musicPlaying = false;
    });

    $("#arnold-play").on("click", function(){
        if (!musicPlaying) {
            arnold.get(0).play();
            musicPlaying = true;
        }
    });

    arnold.on("ended", function(){
        musicPlaying = false;
    });

    $("#prince-play").on("click", function(){
        if (!musicPlaying) {
            prince.get(0).play();
            musicPlaying = true;
        }
    });

    prince.on("ended", function(){
        musicPlaying = false;
    });

    $("#sailor-play").on("click", function(){
        if (!musicPlaying) {
            sailor.get(0).play();
            musicPlaying = true;
        }
    });

    sailor.on("ended", function(){
        musicPlaying = false;
    });

    $("#power-play").on("click", function(){
        if (!musicPlaying) {
            power.get(0).play();
            musicPlaying = true;
        }
    });

    power.on("ended", function(){
        musicPlaying = false;
    });

    $("#all-play").on("click", function(){
        if (!musicPlaying) {
            allThat.get(0).play();
            musicPlaying = true;
        }
    });

    allThat.on("ended", function(){
        musicPlaying = false;
    });

    // Pauses any of the buttons
    $("#pause").on("click", function(){
        if (musicPlaying) {
            daria.get(0).pause();
            arnold.get(0).pause();
            prince.get(0).pause();
            sailor.get(0).pause();
            power.get(0).pause();
            allThat.get(0).pause();
            musicPlaying = false;
        }
    });

    renderButtons();
    getStoredFavs();
});
