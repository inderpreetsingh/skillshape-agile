import React from "react";
import { browserHistory } from "react-router";

// NOTE: This is very specific HOC for hiding logo's on brandbar, topBar etc..
// currentUser, isUserSubsReady props are expected..
export default (withUserSchoolInfo = WrappedComponent =>
  class withUserSchoolInfoHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showLogo: false
      };
    }

    _storeUserSchoolInfo() {
      const { currentUser, isUserSubsReady } = this.props;
      debugger;

      if (currentUser && currentUser.profile.userType === "School") {
        Meteor.call("school.getMySchool", (err, res) => {
          if (err) {
            localStorage.setItem("multipleSchools", true);
          } else {
            if (res.length == 1) {
              // redirect only if there is a single school
              const mySchoolSlug = res[0].slug;
              localStorage.setItem("mySchoolSlug", mySchoolSlug);
              localStorage.setItem("multipleSchools", false);
            } else {
              localStorage.setItem("multipleSchools", true);
            }
            this.setState(state => {
              return {
                ...state,
                showLogo: true
              };
            });
          }
        });
      } else if (
        (currentUser && currentUser.profile.userType !== "School") ||
        (isUserSubsReady && !currentUser)
      ) {
        if (!this.state.showLogo) {
          this.setState(state => {
            return {
              ...state,
              showLogo: true
            };
          });
        }
      }
    }

    handleLogoClick() {
      const { isUserSubsReady } = this.props;
      const visitorType = localStorage.getItem("visitorType");

      if (isUserSubsReady) {
        // There is current user loggedIn
        if (visitorType === "school") {
          const mySchoolSlug = localStorage.getItem("mySchoolSlug");
          const multipleSchools = localStorage.getItem("multipleSchools");
          if (mySchoolSlug && !multipleSchools) {
            browserHistory.push(`/schools/${mySchoolSlug}`);
          }

          browserHistory.push("/skillshape-for-school");
        }
        browserHistory.push("/");
      }

      browserHistory.push("/");
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (
        nextProps.currentUser !== this.props.currentUser ||
        nextProps.isUserSubsReady !== this.props.isUserSubsReady ||
        this.state.showLogo !== nextState.showLogo
      ) {
        return true;
      }
      return false;
    }

    componentDidUpdate() {
      this._storeUserSchoolInfo();
    }
    componentDidMount() {
      this._storeUserSchoolInfo();
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          showLogo={this.state.showLogo}
          handleLogoClick={this.handleLogoClick}
        />
      );
    }
  });
