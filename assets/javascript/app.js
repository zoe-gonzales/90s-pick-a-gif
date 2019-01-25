
// GLOBAL VARIABLES
// Create array (topics) that includes all of the intial buttons to be displayed



// FUNCTIONS
// Function to display buttons dynamically - loops through the array above
    // Dynamically create divs for each array item
    // start by emptying the button-area div every time so that there are no duplicates
    // Make button
    // Add class
    // Add data attribute
    // Add text
    // Append to #button-area

// CLICK EVENTS
// When user clicks on one of the pre-populated divs =>
    // So, this is where the api will be access to pull the selectef gifs
        // Function will:
        // take topic as argument
        // loop through array of available gifs (should be 10 in total)
        // prepend to the #gif-area div
// the first 10 gifs for that topic should appear appended to the #gif-area div

// When user inputs new topic into the #tv-input div and clicks #add-show =>
    // prevent default method to avoid submit default
    // Get value of the user's input
    // push new value into the topics array
    // rerun function to populate buttons
