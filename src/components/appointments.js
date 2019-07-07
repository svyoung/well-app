import React from 'react';

class Appointments extends React.Component {
    render() {
        return(
            <div className="appointment">
                <span>Name:</span> <strong>{this.props.data.name}</strong> <br/>
                <span>Phone:</span> <strong>{this.props.data.phone}</strong> <br/>
                <span>Email:</span> <strong><a href={`mailto:${this.props.data.email}`}>{this.props.data.email}</a></strong> <br/>
                <span>Appointment:</span> <strong>{this.props.data.appointment}</strong> <br/>
                <span>Reason for Visit:</span> <strong>{this.props.data.reason}</strong> <br/>
            </div>
        )
    }

}

export default Appointments;