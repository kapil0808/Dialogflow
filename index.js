/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

 const functions = require('firebase-functions');
 const {google} = require('googleapis');
 const {WebhookClient} = require('dialogflow-fulfillment');
 
 // Enter your calendar ID below and service account JSON below
 const calendarId = "4gcmmtgdkl0mf1t1r97ib016g4@group.calendar.google.com"
 const serviceAccount = {"type": "service_account",
  "project_id": "booking-appointment-jcft",
  "private_key_id": "e7d22a6b52146cca22196138f6f4d89dc58a6fd1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCWdln4h3WUwHf6\nq5GkFlNbtN/fKB6GT0xA6gBOb3ieGu/PApyseh/dkywyu9rQ12z8YKSdy7yHui3x\nleeoaqsO8kPdDEBgbLKwl3MvcuD7kGAEJB+4stD2QlQT1VSlNa+legCQpC5yg+Up\nTTsvJ9/ywTxYpJOS/DUT0oCWy8M2qY0cB6rY3dm9hynYvXql1WWRphX9uxylVxqA\nMT/tkUKB1TT3h0tLCxa5qC4xIOS9OV9Ug2O73m+J8GsgdYpvvJjGH/4W2c6vU5nX\nLCyoK+uW7OndJ3WNgnLMIlSwuJvkF2DvZpva1VS8HWNlgJ8yqUG0mOBlwmyt5x43\nxGw4qNlTAgMBAAECggEAB9vQoTF6C7XtzlLtvXNJEU4mL0KqLXuw0Ocn8vDRjPh9\nNAO/6SZLycfpFBFJwYSu9ZOapX9Brpkj0y1wNxSzMImoz7/XEPI8dwrCAmVuqNUG\nntDAM2ZrkaEvQQXwcNyX+v2fT+6zWlnXO0wEXlcn1EcRftPBvXic0Rc6jiXAYXdv\nFKOCUcmgwLvwG2oldX8WTo+6uIqKhGEyTMnFSCVolRzefdNvHm1czLS38SGyHuKR\nqn+NH1RN3kbzJziw+sQ4sMxY5vcsEGU6CgD+69qD2TfoQzUGCBApJ43W9rvt+/ZR\nw86lG/KC6JLhgvLGOJvTzdRWw7raLx5gitBnBxBtoQKBgQDQRt4uucx8hI90zXn/\n4SpL4U7adIEel3qP7VFU77dMYEHBB5Hdryack0+aAkqrAB/8NjQ7XSf0wE8XvuRa\nhZevWtIftNyLYpemjv5EFzefhi0kdpDftsAi3ldMEPgL8YfvEl3GV0AdBo/mOr+B\n8li8PZXNJvK2hOnbSa2Lq0jhMQKBgQC48DD3f+wnbDh8VAN4ZtfWoU48ozu1SolA\nT2kTAm/IUmEAHPycqT5bCGRYz/UrQtf7KGOtk6GGL83xK+F+oeI9x12Yu0fmOIUF\n9jV3uNvJ9DLCZpEboOWrtx+UlansK2BsZPgDUJsP1zkfGKJdF3n/eFj2XzkrWvsL\nDIhElX4hwwKBgCvOO/zn5zJpTyLp9Lb0zMiY4tTfnCirA4QyDeEnag4OUMYgqXVO\n2XglI6Doynuc0x1g6StzNGwt5nTAGZdQcc7X80nn6FsIqYzGloQLvg83UVdR+LaU\n4WR0DzhYeVNJwaVu33pP75QrRSjPQmg6aJ9u9IrpnjL1UZplrLKrm/CBAoGAbJvi\npfdiYOSVZ66POy5qo4mnwMS8VAOqBzKbqqZLr4FxpfdgA0EBdcS/6ch3WyiuXrmh\nkFabDYsVjwUOMKgxjcZ/mSqjVvjqZk3pqJ3PthLLnI9PuMINH4Mz8LbUS/ZNclr5\nrDiyV+M1kKWO9MzMwNOUq1vQ3z1XIW4CuQRyRrECgYEAgu1QuYKECg1YbEwO1AeF\n7qNFS3XR3y+jmW2jSdP2teb3DlXqBfYomWy1QI4Dg7jGyEEbsMJDfj6JiJ/FK54s\nuy3WsNu2A607bHlaSYITIU+UfoQnQodmWl3uGCmWhOUhmwycvrJFRi2/kQTClpTp\nRoSvQKURyv346CnmSUYrtLg=\n-----END PRIVATE KEY-----\n",
  "client_email": "booking-appointment@booking-appointment-jcft.iam.gserviceaccount.com",
  "client_id": "109696786188536689791",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/booking-appointment%40booking-appointment-jcft.iam.gserviceaccount.com"
}; // Starts with {"type": "service_account",...
 
 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
   email: serviceAccount.client_email,
   key: serviceAccount.private_key,
   scopes: 'https://www.googleapis.com/auth/calendar'
 });
 
 const calendar = google.calendar('v3');
 process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
 
 const timeZone = 'America/Los_Angeles';
 const timeZoneOffset = '-07:00';
 
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({ request, response });
   console.log("Parameters", agent.parameters);
   const appointment_type = agent.parameters.AppointmentType
   function makeAppointment (agent) {
     // Calculate appointment start and end datetimes (end = +1hr from start)
     //console.log("Parameters", agent.parameters.date);
     const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
     const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
     const appointmentTimeString = dateTimeStart.toLocaleString(
       'en-US',
       { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
     );
 
     // Check the availibility of the time, and make an appointment if there is time on the calendar
     return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
       agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
     }).catch(() => {
       agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
     });
   }
 
   let intentMap = new Map();
   intentMap.set('Schedule Appointment', makeAppointment);
   agent.handleRequest(intentMap);
 });
 
 
 
 function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
   return new Promise((resolve, reject) => {
     calendar.events.list({
       auth: serviceAccountAuth, // List events for time period
       calendarId: calendarId,
       timeMin: dateTimeStart.toISOString(),
       timeMax: dateTimeEnd.toISOString()
     }, (err, calendarResponse) => {
       // Check if there is a event already on the Calendar
       if (err || calendarResponse.data.items.length > 0) {
         reject(err || new Error('Requested time conflicts with another appointment'));
       } else {
         // Create event for the requested time period
         calendar.events.insert({ auth: serviceAccountAuth,
           calendarId: calendarId,
           resource: {summary: appointment_type +' Appointment', description: appointment_type,
             start: {dateTime: dateTimeStart},
             end: {dateTime: dateTimeEnd}}
         }, (err, event) => {
           err ? reject(err) : resolve(event);
         }
         );
       }
     });
   });
 }