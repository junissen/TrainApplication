// Initialize Firebase
var config = {
  apiKey: "AIzaSyDlzruPjitjfOT0tV_QjbR-6Cz-SqBzKaw",
    authDomain: "umnbootcamp-hw6.firebaseapp.com",
    databaseURL: "https://umnbootcamp-hw6.firebaseio.com",
    projectId: "umnbootcamp-hw6",
    storageBucket: "umnbootcamp-hw6.appspot.com",
    messagingSenderId: "225381088274"
};

firebase.initializeApp(config);

var database = firebase.database();

var intervalId;
var clockRunning = false;

checkDatabase();

if (!clockRunning) {
	intervalId = setInterval(checkDatabase, 60000);
	clockRunning = true;
}


// Adding train data from form into Firebase
$('#addData').on("click", function() {
  event.preventDefault();

  var name = $('#trainName').val().trim();
  var destination = $('#trainDestination').val().trim();
  var time = $('#trainTime').val().trim();
  var frequency = $('#trainFrequency').val().trim();

  var newUser = database.ref().push();

  newUser.set({
    name: name,
    destination: destination,
    time: time, 
    frequency: frequency
  })

  $('#trainName').val("");
  $('#trainDestination').val("");
  $('#trainTime').val("");
  $('#trainFrequency').val("") 

});

// Calling firebase data nodes

function checkDatabase() {

	$('.user_input').empty();

	database.ref().on("child_added", function(childSnapshot) {

	  var table = $('.user_input');

	  var trainName = childSnapshot.val().name;
	  var trainDestination = childSnapshot.val().destination;
	  var trainFrequency = childSnapshot.val().frequency;

	  var diffTime = moment().diff(moment(childSnapshot.val().time, "HH:mm"), "minutes");

	  if (diffTime < 0) {
	  	diffTime = diffTime + 1440
	  }

	  var trainRemainder = diffTime % trainFrequency;

	  var trainMinutesAway = trainFrequency - trainRemainder;

	  var nextTrain = moment(moment().add(trainMinutesAway, "minutes")).format("HH:mm");

	  if (trainRemainder === 0) {
	  	nextTrain = "Train arriving now"
	  }

	  table.append('<tr><td>' + trainName + '</td><td>' + trainDestination + 
	    '<td>every ' + trainFrequency + ' min</td><td>' + nextTrain + '</td><td> ' + 
	    trainMinutesAway + ' min away</td>');
	})


};


