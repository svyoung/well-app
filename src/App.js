import React from 'react';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import times from './data/time';
import bookings from './data/bookings';
import Appointments from './components/appointments';
import Messages from './components/messages';
import 'react-day-picker/lib/style.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState;

    this.changeHandler = this.changeHandler.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  get initialState() {
    return {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      reason_options: ["Checkup", "Experiencing Symptoms", "Follow Up", "Miscellaneous"],
      reason: '',
      existingAppts: bookings,
      appointments: [{
        name: 'Jane Doe', phone: '555-555-5555', email: 'test@gmail.com', appointment: 'July 22, 2019 01:30 - 02:30', reason: 'Checkup'
      }],     
      start_time: times,
      end_time: JSON.parse(JSON.stringify(times)),
      selected_start_time: '',
      selected_end_time: '',
      selectedDay: new Date(),
      selected_date: '',
      start_time_disabled: true,
      end_time_disabled: true,
      overlap: false,
      overlap_msg: {
        type: 'error',
        message: ''
      },
      required_fields: {first_name: "", last_name: "", phone: "", selected_date: "", selected_start_time: "", selected_end_time: "", reason: ""},
      form_error: {
        type: 'error',
        error: false,
        error_message: ''
      },
      submit_success: {
        success: false,
        message: ''
      }
    }
  }

  resetState() {
    this.setState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      selected_date: '',
      selected_start_time: '',
      selected_end_time: '',
      reason_options: ["Checkup", "Experiencing Symptoms", "Follow Up", "Miscellaneous"],
      reason: '',
      start_time_disabled: true,
      end_time_disabled: true,
      overlap: false
    })
  }

  componentDidMount() {
    this.onlyFutureTimes();
  }

  changeHandler(e) {
    let datatype = e.target.dataset['type'];
    this.setState({[datatype]: e.target.value})
  }

  handleDayClick(day, modifiers = {}) {
    let date = (new Date(day)).toISOString().split('T')[0],
        formattedDate = moment(date).format('LL');
    console.log('selected day: ' + date + ' disabled? ' + modifiers.disabled);
    if (modifiers.disabled) {
      this.setState({selectedDay: null, selected_date: ''})
      return;
    }
    this.setState({
      selectedDay: day,
      selected_date: formattedDate,
      start_time_disabled: false
    }, ()=> {
      // any time user chooses a date, evaluate if time overlaps or if the selected day is today, filter in hours
      this.onlyFutureTimes();
      this.evaluateOverlap();
    });

  }

  onlyFutureTimes() {
    let today = new Date(), todayDate = today.toISOString().split('T')[0],
        timeOnly = `${today.getHours()}:${today.getMinutes()}`, 
        startTime = this.state.start_time, 
        state = Object.assign({}, this.state);

    startTime.map((time, index)=> {
      if(today.toDateString() === this.state.selectedDay.toDateString()) {
        // disable previous hours if selected date is today
        if(Date.parse(`${todayDate} ${timeOnly}`) >= Date.parse(`${todayDate} ${time.time}`)) {
          state.start_time[index].disabled = true;
        }
      } else {
        // return all hours back to normal
        state.start_time[index].disabled = false;
      }
    });
    this.setState({state});
  }
  
  evaluateOverlap() {
    let selectedDay = this.state.selectedDay.toISOString().split('T')[0],
        start = new Date(`${selectedDay} ${this.state.selected_start_time}`),
        end = new Date(`${selectedDay} ${this.state.selected_end_time}`),
        isOverlapped = false;
    this.state.existingAppts.map(app => {
      if(selectedDay === app.date) {
        let app_start = new Date(`${selectedDay} ${app.start_time}`), app_end = new Date(`${selectedDay} ${app.end_time}`);
        if(start <= app_end && end >= app_start) {
          this.setState({overlap: true, overlap_msg: {type: 'error', message: `Sorry! The time you've selected conflicts with an existing appointment from ${moment(app_start).format('LT')} to ${moment(app_end).format('LT')}. Please select another time.`}});
          isOverlapped = true;
          return;
        } 
      }
      // evaluate lunch overlap
      let lunch_start = new Date(`${selectedDay} 12:01`), lunch_end = new Date(`${selectedDay} 12:59`);
      if(start <= lunch_end && end >= lunch_start) {
        this.setState({overlap: true, overlap_msg: {type: 'error', message: "Sorry! This time slot overlaps with lunch period off. Please select another time."}});
        isOverlapped = true;
        return;
      } 
    });
    if(!isOverlapped) this.setState({overlap: false, overlap_msg: ''});
  }

  changeTime(e) {
    let time = e.target.dataset['time'], selectedDay = this.state.selectedDay.toISOString().split('T')[0];
    if(this.state.selectedDay !== null) {
      if(time === 'start') {
        let endTime = this.state.end_time, state = Object.assign({}, this.state);
        this.setState({ selected_start_time: e.target.value, end_time_disabled: false});
        this.state.end_time.map((time, index) =>{
          if(Date.parse(`${selectedDay} ${e.target.value}`) >= Date.parse(`${selectedDay} ${time.time}`)) {
            state.end_time[index].disabled = true;
          } 
          else {
            state.end_time[index].disabled = false;
          }
        });
        this.setState({state});
      } else {
        this.setState({ selected_end_time: e.target.value}, () => {
          // evaluate overlap
          this.evaluateOverlap();
        });
      }
    }
  }

  submitHandler(e) {
    e.preventDefault();
    const {overlap, required_fields} = this.state;
    let state = Object.assign({}, this.state), count = Object.keys(required_fields).length, validForm = 0;
    Object.keys(required_fields).forEach(function(key) {
      if(state[key] === '') {
        state.required_fields[key] = 'missing';
        state.form_error.error = true;
        state.form_error.type = 'error';
        state.form_error.message = 'Please enter all required fields.';
      } else {
        state.required_fields[key] = '';
        validForm++;
      }
    });
    this.setState({state});
    if(!overlap && validForm == count) {
      this.setState({
        form_error: {error: false, message: ''},
        submit_success: {
          success: true,
          message: "You've successfully booked an appointment!"
        }
      });
      setTimeout(() => {
        this.setState({
          submit_success: {
            success: false,
            message: ''
          }
        });
      }, 3000);
      
      // a valid form, submit now
      state.appointments.push({
        name: `${this.state.first_name} ${this.state.last_name}`,
        phone: `${this.state.phone}`,
        email: `${this.state.email}`,
        appointment: `${moment(this.state.selected_date).format('ll')}: ${moment(`${this.state.selected_date} ${this.state.selected_start_time}`).format('LT')} - ${moment(`${this.state.selected_date} ${this.state.selected_end_time}`).format('LT')}`,
        reason: this.state.reason
      });
      state.existingAppts.push({
        "date": `${this.state.selectedDay.toISOString().split('T')[0]}`,
        "start_time":  `${this.state.selected_start_time}`,
        "end_time": `${this.state.selected_end_time}`
      });
      // reset some states
      this.resetState();
    }
  }

  render() {
    const { start_time, end_time, appointments } = this.state;
    return (
      <div className="main-app">
        <form className="scheduler-for">
          <div className="container">
            <header></header>
            <div className="form-group row appointments">
              <h4><i className="fa fa-calendar"></i> Appointments</h4>
              <div className="appointment-container">
                {appointments.map((appt, index) => 
                  <Appointments key={index} data={appt} />
                )}
              </div>
              
            </div>
            <h4><i className="fa fa-mouse-pointer"></i> Schedule an appointment</h4>
            <div className="form-start">
              <div className="row">
                <div className="form-group col">
                  <label>First Name *</label>
                  <input type="text" className={`form-control form-control-lg first_name ${this.state.required_fields.first_name}`} name="first_name" data-type="first_name" placeholder="" value={this.state.first_name} onChange={this.changeHandler} required="required" />
                </div>
                <div className="form-group col">
                  <label>Last Name *</label>
                  <input type="text" className={`form-control form-control-lg last_name ${this.state.required_fields.last_name}`} name="last_name" data-type="last_name" placeholder="" value={this.state.last_name} onChange={this.changeHandler} required="required" />
                </div>
              </div>
              <div className="row">
                <div className="form-group col">
                  <label>Phone Number *</label>
                  <input type="phone" className={`form-control form-control-lg phone ${this.state.required_fields.phone}`}  name="phone" data-type="phone" placeholder="" value={this.state.phone} onChange={this.changeHandler} required="required" />
                </div>
                <div className="form-group col">
                  <label>Email</label>
                  <input type="email" className="form-control form-control-lg email" name="email" data-type="email" placeholder="" value={this.state.email} onChange={this.changeHandler} />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-7">
                  <div className="form-group">
                    <DayPicker
                      disabledDays={[{before: new Date()}, { daysOfWeek: [0, 6] } //excluding weekends and previous days
                    ]}
                      selectedDays={this.state.selectedDay}
                      onDayClick={this.handleDayClick}
                    />
                    </div>
                  </div>
                  <div className="form-group col">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input type="text" name="selected_date" data-type="selected_date" disabled={true} className={`form-control form-control-lg selected_date ${this.state.required_fields.selected_date}`} value={this.state.selected_date} onChange={this.changeHandler}/>
                    </div>
                    <div className="form-group start-time">
                      <label htmlFor="start_time">Start Time *</label>
                      <select className={`form-control form-control-lg start_time ${this.state.required_fields.selected_start_time}`} data-time="start" disabled={this.state.start_time_disabled} value={this.state.selected_start_time} onChange={this.changeTime} required="required">
                        {/* <option value=""></option> */}
                        {start_time.map((time, index) =>
                          <option key={index} value={time.time} disabled={(time.hard_disable) ? time.hard_disable : time.disabled}>{time.display}</option>
                        )}
                      </select>
                    </div>
                    <div className="form-group end-time">
                      <label htmlFor="end_time">End Time *</label>
                      <select className={`form-control form-control-lg end_time ${this.state.required_fields.selected_end_time}`} onChange={this.changeTime} data-time="end" value={this.state.selected_end_time} disabled={this.state.end_time_disabled} required="required">
                      {/* <option value=""></option> */}
                      {end_time.map((time, index) =>
                          <option key={index} value={time.time} disabled={(time.hard_disable) ? time.hard_disable : time.disabled} selected={time.selected}>{time.display}</option>
                        )}
                      </select>
                    </div>
                  </div>
              </div>
              {this.state.overlap &&
                <div className="form-group row">
                  <Messages data={this.state.overlap_msg} />
                </div>
              }
              <div className="row">
                <div className="form-group col">
                    <label>Reason for visit *</label>
                    <select className={`reasons-vist form-control form-control-lg reason ${this.state.required_fields.reason}`} data-type="reason" onChange={this.changeHandler} value={this.state.reason} required="required">
                      <option value=""></option>
                      {this.state.reason_options.map( (reason, index) => 
                          <option value={reason} key={index}>{reason}</option>
                      )}
                    </select>
                  </div>
                  <div className="form-group col">
                  </div>
              </div>
              {this.state.form_error.error &&
                <div className="form-group row">
                  <Messages data={this.state.form_error} />
                </div>
              }
              <div className="row">
                <div className="form-group col">
                  <button type="submit" className="submit-button" onClick={this.submitHandler}>Submit</button>
                </div>
              </div>
            </div>
            {this.state.submit_success.success &&
              <div className="form-group row">
                <Messages data={this.state.submit_success} />
              </div>
            }
          </div>
        </form>
      </div>
    );
  }
  
}

export default App;
