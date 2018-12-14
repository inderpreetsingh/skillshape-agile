import React, { Fragment, PureComponent } from 'react';
import { DatePicker } from 'material-ui-pickers';
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";

class BasicDatePicker extends PureComponent {
  state = {
    selectedDate: '2018-01-01T00:00:00.000Z',
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  render() {
    const { selectedDate } = this.state;

    return (
      <Fragment>
        <div className="picker">
          <DatePicker
            label="Basic example"
            value={selectedDate}
            onChange={this.handleDateChange}
            animateYearScrolling
          />
        </div>

      </Fragment>
    );
  }
}

const SkillShapeButtonsCollection = () => (
  <div>
    <button className='black-button' ><span className="skillshape-button--icon">phone</span>Skillshape button</button>
    <button className='danger-button' ><span className="skillshape-button--icon">phone</span>Skillshape button</button>
    <button className='caution-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>
    <button className='information-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>
    <button className='cancel-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>
    <button className='action-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>
    <button className='primary-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>
    <button className='secondary-button' ><span className="skillshape-button--icon">email</span>Skillshape button</button>

    <BasicDatePicker />
    <MaterialDatePicker />
  </div>
);

export default SkillShapeButtonsCollection;
