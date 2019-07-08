This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Summary

Code challenge test using React to create a form builder for scheduling appointments. No physical database was implemented - most datasets are stored in JSON files under `/data` folder. Reloading the page will unset and lose all saved data.

Currently choices for time are in increments of 15 minutes starting from 8:00AM to 5:00PM with a lunch break from 12:00PM - 1:00PM. (This was chosen by standard doctors' hours).

#### Steps
* `npm install`
* `npm run start`

### Libraries used
* [Moment](https://github.com/moment/moment)
* [React Day Picker](https://github.com/gpbl/react-day-picker)

### Functionality
* Detects overlap appointment before form submit
* Submitted appointments gets pushed into the existing appointment list

