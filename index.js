const {google} = require('googleapis')
const {OAuth2} = google.auth
const oAuth2Client = new OAuth2('526363734659-k1270fmj90pg4umqv9vcch429eashatf.apps.googleusercontent.com', 'xT_s-VDfKjbQt9wDEpBz0X5k')
oAuth2Client.setCredentials({refresh_token: '1//04_PiwCnGw3inCgYIARAAGAQSNwF-L9Irkz21t6w-TDVAYLg-x_o_w7RZNTNi0jXBUlet1JkkCjQ7oVePWJJVyWSAIEioM2Vu3yI'})

const calendar = google.calendar({version: 'v3', auth: oAuth2Client})
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay()+6)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay()+6)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 120)

// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Happy Habits meeting`,
  location: `123 idk boulevard`,
  description: `Meet with group talk about project`,
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/Denver',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/Denver',
  },
}

// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/Denver',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    // Check for errors in our query and log them if they exist.
    if (err) return console.error('Free Busy Query Error: ', err)

    // Create an array of all events on our calendar during that time.
    const eventArr = res.data.calendars.primary.busy

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`You have something else going on at this time`)
  }
)
