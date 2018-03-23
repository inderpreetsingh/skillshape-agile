import React from 'react';
import { FullCalendar } from './lib/FullCalendar';
import { Session } from 'meteor/session';


export default function() {

	return (
        <div className="content" >
            <div className="container-fluid">
                <div className="row">
                  	<div className="col-md-12 nopaddb">
                        <div className="card card-calendar">
                            <div className="card-content ps-child">
                                <FullCalendar options={this.options} />
                            </div>
                        </div>
                    </div>
            	</div>
            </div>
        </div>
	)
}