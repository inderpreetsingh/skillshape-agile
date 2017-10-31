import React from 'react';
import { browserHistory } from 'react-router';

const insertPadding = {
  paddingRight: '8px',
  paddingLeft: '8px'
};

export default class ContactUs extends React.Component {

  constructor(props){
    super(props);
  }
  
  componentDidMount() {
    $(".social_icon").hover(function (e) {
      $(this).addClass('animated tada');
    });

    $(".social_icon").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
      $(this).removeClass('animated tada');
    });
  }  
    
  submit = (event) => {
        event.preventDefault();
        const name = this.refs.name.value;
        const email = this.refs.email.value;
        const message = this.refs.yourMessage.value;
        const selectedOption = $("input[name=optionsRadios]:checked").val();   
         
        const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!email) {
            toastr.error('Please enter your email.','Error');
            return false;
        } else if(!emailReg.test(email)) {
            toastr.error("Please enter valid email address","Error");
            return false;
        } else if(!message) {
            toastr.error("Please enter a message.","Error");
            return false;
        } else {
         Meteor.call('sendfeedbackToAdmin', name, email, message, selectedOption, (error, result) => {
             if(error) {
                 console.log("error", error);
             } else {
                 toastr.success("Thanks for provide your feedback","Success");
                 setTimeout(() => {
                     browserHistory.push(`/`);
                 }, 200);
             }
         })
        }
    };

    render() {
        return(
            <div>
                <div className="content" >
                    <div className="container-fluid">
                        <div className="row">
                            <div className="row card">
                                <div className="alert alert-info">
                                    <span style={{fontSize:'24px'}}>Send Us Feedback</span>
                                </div>
                                <div className="col-md-7">
                                    <div className="row">
                                        <form method="post" onSubmit={this.submit} name="contact" noValidate="novalidate">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        name="text"
                                                        ref="name"
                                                        placeholder="Name"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        name="email"
                                                        ref="email"
                                                        placeholder="E-mail"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="radio">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="optionsRadios"
                                                            className="end_option"
                                                            ref="featureRequested"
                                                            defaultValue="Feature Request"
                                                        />
                                                        <span className="circle" /><span className="check" />
                                                        Feature Request
                                                    </label>
                                                </div>
                                                <div className="radio">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="optionsRadios"
                                                            className="end_option"
                                                            ref="somethingIsBroken"
                                                            defaultValue="Something is broken"
                                                        />
                                                        <span className="circle" /><span className="check" />
                                                        Something is broken
                                                    </label>
                                                </div>
                                                <div className="radio">
                                                    <label>
                                                        <input type="radio"
                                                               name="optionsRadios"
                                                               className="end_option"
                                                               ref="iLoveThis"
                                                               defaultValue="I Love This!"
                                                        />
                                                        <span className="circle" /><span className="check" />
                                                        I Love This!
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-12 resbtn">
                                                <div className="form-group">
                                                    <textarea
                                                        className="form-control"
                                                        id="message"
                                                        name="message"
                                                        rows="4"
                                                        ref="yourMessage"
                                                        placeholder="Your message"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn"
                                                    id="sendfeedback">
                                                    Send Message
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-5 text-center">
                                    <ul className="address-info">
                                        <img src="/images/new-logo.png" className="" alt="logo" width="48" style={{width: 'auto', height: '250px'}} />
                                        <div  className="sl-bar">
                                            <a style={insertPadding} href="#" className="fa fa-facebook social_icon"></a>
                                            <a style={insertPadding} href="#" className="fa fa-twitter social_icon  "></a>
                                            <a style={insertPadding} href="#" className="fa fa-google-plus social_icon "></a>
                                            <a style={insertPadding} href="#" className="fa fa-dribbble social_icon  "></a>
                                            <a style={insertPadding} href="#" className="fa fa-instagram social_icon "></a>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}