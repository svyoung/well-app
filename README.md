This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Steps
* `npm install`
* `npm run start`

## Summary

Code challenge test using React to create a form builder for scheduling appointments. No physical database was implemented - most datasets are stored in JSON files under `/data` folder. Reloading the page will unset and lose all saved data.

Currently choices for time are in increments of 15 minutes starting from 8:00AM to 5:00PM with a lunch break from 12:00PM - 1:00PM. (This was chosen by standard doctors' hours).

#### Date and times to check against
* July 22, 2019 01:30 PM - 02:30 PM
* July 15, 2019 09:15 AM - 09:45 AM, 03:30 PM - 04:30 PM
* July 16, 2019 08:30 AM - 09:00 AM, 10:15 AM - 10:45 AM, 01:00 PM - 01:30 PM
* July 17, 2019 10:15 AM - 10:45 AM, 11:15 AM - 11:45 AM, 02:00 PM - 02:30 PM
* July 23, 2019 01:15 PM - 01:45 PM
* July 30, 2019 10:30 AM - 11:00 AM

Then of course, there are the date and times of ones you submit an appointment

### Functionality
* Detects overlap appointment before form submit
* Submitted appointments gets pushed into the existing appointment list, updating booked appointments to compare against 

### Libraries used
* [Moment](https://github.com/moment/moment)
* [React Day Picker](https://github.com/gpbl/react-day-picker)





