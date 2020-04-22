var CLIENT_ID = '526363734659-k1270fmj90pg4umqv9vcch429eashatf.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD0pf6-tphmh767IotONYynnD72OyqGV0Q';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

var submitButton = document.getElementById('eventSubmit');
var authStatus = false;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    submitButton.onclick = handleClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}


/**
 *  Sign in the user upon button click.
 */
 function handleClick() {
   if(authStatus == false){
     gapi.auth2.getAuthInstance().signIn();
   }
  newEvent();
}

function updateSigninStatus(authStatus){
  this.authStatus = authStatus;
}
function appendPre(message) {
  var pre = document.getElementById('eventCreated');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}
function newEvent(){

  var frequency = "";
  $('#dayOWeek').find('input').each(function () {
    if(this.checked == true){
      frequency += "" + this.id + ",";
    }
  })

  frequency = frequency.substring(0, frequency.length - 1);

  const dateTime = function(date, time){
    var dt = new Date(Date.parse(date + " " + time));
    return dt.toISOString();
  }

  const untilTime = function(date){
    var ut = new Date(Date.parse(date));
    var st = "";
    st += ut.getFullYear();
    if((ut.getMonth()+1) < 10){
      st+="0";
    }
    st+=(ut.getMonth()+1);
    if((ut.getDate()+1) < 10){
      st+="0";
    }
    st+=(ut.getDate()+1);
    console.log(st);
    return st;
  }


  var event = {
    "summary": $('#name').val(),
  "description": $('#comment').val(),
    "colorId": 1,
    "start": {
      "dateTime": dateTime($('#start').val(), $('#timeStart').val()),
      "timeZone": 'America/Denver',
    },
    "end": {
      "dateTime": dateTime($('#start').val(), $('#timeEnd').val()),
      "timeZone": 'America/Denver',
    },
    "recurrence": [
      "RRULE:FREQ=WEEKLY;BYDAY="+ frequency +";UNTIL="+ untilTime($('#end').val())
    ],
  }

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(completeEvent) {
    appendPre('Event created: ' + completeEvent.htmlLink);
  });
}

//   gapi.client.calendar.events.insert({
//       auth: auth,
//       calendarId: 'primary',
//       resource: event,
//     }, function(err, event) {
//         if (err) {
//           console.log('There was an error contacting the Calendar service: ' + err);
//           return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//       });
// }
