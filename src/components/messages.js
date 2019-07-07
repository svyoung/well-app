import React from 'react';

class Messages extends React.Component {
    render() {
        let message_type = this.props.data.type;
        if(message_type === 'error') {
            return(
                <div className="error-message message">
                    <i class="fa fa-exclamation-triangle"></i> {this.props.data.message}
                </div>
            )
        } else {
            return (
                <div className="success-message message">
                   <i class="fa fa-check-circle"></i> {this.props.data.message}
                </div>
            )
        }
        
    }

}

export default Messages;