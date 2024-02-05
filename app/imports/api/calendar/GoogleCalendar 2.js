import { Meteor } from 'meteor/meteor';
import { google } from 'googleapis';

Meteor.methods({
  async 'getGoogleCalendarEvents'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Meteor.users.findOne(this.userId);
    const { accessToken } = user.services.google;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items;
    } catch (error) {
      throw new Meteor.Error('google-calendar-fetch-failed', error.message);
    }
  },
});
