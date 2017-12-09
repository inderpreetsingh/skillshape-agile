import React from 'react';
import MyCalender from '/imports/ui/components/users/myCalender';

export default class ManageMyCalendar extends React.Component {

	constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        
        let today = new Date()
        return  (
            <div>
                <MyCalender
                    manageMyCalendar={true} 
                    {...this.props}
                />
            </div>
        )
   }
}
