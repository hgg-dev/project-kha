

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAO_Gz79glGQcOnEg5cs4vi4sN3VQ5dYvM",
    authDomain: "lunchmocracy.firebaseapp.com",
    databaseURL: "https://lunchmocracy.firebaseio.com",
    projectId: "lunchmocracy",
    storageBucket: "",
    messagingSenderId: "264715414255",
    appId: "1:264715414255:web:6a32965e17f1d93f47491a"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();
  
  var eatery;
  var employeeName;
  var optionNumber;
  var displayEatery;
  var displayEmployee;

  var placeId;
  var address;
  var phone;
  var restaurantName;
  var priceLevel;
  var rating;
  var image;

  //on submit click
  $("#suggestSubmit").on("click", function(e){
  
    
var loading = "<div class='loader'></div>"
$(".container-fluid").prepend(loading);
$(".container-fluid").addClass('overlay');

    e.preventDefault();
    eatery = $("#restaurantSuggestion").val().trim();
    employeeName = $("#employeeName").val().trim();    
    runAPI(eatery);

    //saving options up to database 

      database.ref("/option/" + eatery).set({
        eatery: eatery,
        suggester: employeeName,
        votes: 1
      });


      database.ref("/option/" + eatery + "/voterName/" + employeeName).set({
        votes: 1
      });

      $("#restaurantSuggestion").val("");
      $("#employeeName").val("");

  });

  //display the options 
  database.ref("/option").on("child_added", function(snapshot){
    displayEatery = snapshot.val().eatery;
    displayEmployee = snapshot.val().suggester;

    optionID = snapshot.val().optionNo;
    displayAddress = snapshot.val().placeId;
    displayPhone = snapshot.val().phone;
    displayRestaurant = snapshot.val().restaurantName;
    displayPriceLevel = snapshot.val().priceLevel;
    displayRating = snapshot.val().rating;


    var firstVote = snapshot.val().votes;


    var newCard = $("<div>");
    var imageBanner = "<img src=" + displayImage + " >";
    var eateryH = $("<h3>" + displayRestaurant + "</h3>");
    var addressCard = $("<p>Address: " + displayAddress + "</p>");
    var priceCard = $("<p>Price: " + displayPriceLevel + "</p>");
    var ratingCard = $("<p>Rating: " + displayRating + "</p>");
    var suggesterP = $("<p>Suggested by: " + displayEmployee + "</p>");
    var voteCount = $("<p>Votes: " + firstVote + "</p>");

    // var noSpaces = displayEatery.replace(/\s/g, "");
    // noSpaces = noSpaces.replace("'","");
    // $(voteCount).addClass("voteCounter");

    var noSpaces = displayEatery.replace(/\s/g, "");
    noSpaces = noSpaces.replace("'","");
    $(voteCount).addClass("voteCounter" + noSpaces)

    var voteButton = $("<button type='button ' class='btn btn-primary btn-lg btn-block voteButton' id='suggest'>Vote Now!</button>")
    var voterName = $("<input type='text' class='form-control voterName' id='employeeName' placeholder='Employee Name'>");

    $(voterName).addClass("voterName" + noSpaces)
    
    $(voteButton).attr("OptionID", displayEatery);
    
    $(newCard).append(eateryH, suggesterP, voteCount, voterName, voteButton);
    
    $(newCard).addClass("card");

    $(".card-columns").prepend(newCard);

  });

  //voting function
$("body").on("click", ".voteButton", function(){
  
    var thisVote = $(this).attr("OptionID");
    var noSpaces = thisVote.replace(/\s/g, '');
    noSpaces = noSpaces.replace("'","");

    thisVoter = $(".voterName" + noSpaces).val().trim();
      
      database.ref("/option/" + thisVote + "/voterName/" + thisVoter).set({
        votes: 1
      });
      
  

    //adds to vote count on the database
    var thisDB = database.ref("/option/" + thisVote + "/votes")
    thisDB.transaction(function(votes){
      return votes +1;
    });

  //updates the visible vote count
  database.ref("/option/" + thisVote + "/votes").on("value", function(snapshot){
    var voteCount = snapshot.val();
    
    $(".voteCounter" + noSpaces).text("Votes: " + voteCount);
    
  });


  $(".voterName" + noSpaces).val("");

});

















