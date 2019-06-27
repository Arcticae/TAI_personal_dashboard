const { google } = require("googleapis");
//List of 10 nearest upcoming events
module.exports = async oAuth2Client => {
  const calendar = google.calendar({ version: "v3", oAuth2Client });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime"
    },
    (err, res) => {
      if (err) {
        console.log("API request to calendar returned an error: " + err);
        return null;
      }
      const events = res.data.items;
      if (events.length) {
        return events;
      } else {
        //TODO: what does this mean?
        console.log("Events.length not gud?");
        console.log(events);
        return null;
      }
    }
  );
};
