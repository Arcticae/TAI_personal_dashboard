const { google } = require("googleapis");
//List of 10 nearest upcoming events
module.exports = async (auth, ahead) => {
  const calendar = google.calendar({ version: "v3", auth });

  return calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: ahead,
      singleEvents: true,
      orderBy: "startTime"
    })
    .then(res => {
      if (res) {
        return res.data.items.map(event => {
          return {
            header: event.summary,
            date: new Date(event.start.date || event.start.dateTime),
            reminders: event.reminders.overrides.map(
              reminder =>
                new Date(
                  new Date(event.start.date || event.start.dateTime) -
                    reminder.minutes * 60000
                )
            )
          };
        });
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
