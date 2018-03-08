import React from "react";
var ReactDOM = require("react-dom");
export default class ClaimSchoolBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            sticky: false,
            filterPanelDialogBox: false,
            tempFilters: {},
        };
    }
    handleFixedToggle = state => {
        // console.log("handleFixedToggle", defaultPosition);
        // const stickyPosition = !defaultPosition;
        // console.log(this.state.sticky, defaultPosition);
        // if (this.state.sticky != stickyPosition) {
        //   this.setState({
        //     sticky: stickyPosition
        //   });
        // }
        console.log(status, "status....");
        if (state.status === 2) {
            if (!this.state.sticky) {
                this.setState({
                    sticky: true
                });
            }
        } else if (state.status === 0) {
            this.setState({
                sticky: false
            });
        }
    };


    handleFiltersDialogBoxState = (state) => {
        this.setState({
            filterPanelDialogBox: state
        })
    }

    onLocationChange = (location, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: location.coords,
                locationName: location.fullAddress,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: location.coords,
                locationName: location.fullAddress
            }
        }

        this.setState(stateObj);
    }

    /*When user empties the location filter then need to update state
    so that no data is available on the basis of location filter*/
    locationInputChanged = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: null,
                locationName: event.target.value
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: null,
                locationName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    // Filter that works when user starts typing school name on /claimSchool page
    fliterSchoolName = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                schoolName: event.target.value,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                schoolName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    // This is used to collect selected skill categories.
    collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text
            }
        }

        this.setState(stateObj);

    }

        collectSelectedSkillSubject = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter.skillSubjectIds = text.map((ele) => ele._id);
        oldFilter.defaultSkillSubject = text
        this.setState({ tempFilters: oldFilter})
    }

    skillLevelFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter.experienceLevel = text;
        this.setState({tempFilters:oldFilter})
    }


    filterGender = (event) => {
        let oldFilter = {...this.state.tempFilters};
        oldFilter.gender = event.target.value;
        this.setState({tempFilters:oldFilter})
    }

    filterAge =(event) => {
        let oldFilter = {...this.state.tempFilters};
        oldFilter.age = parseInt(event.target.value);
        this.setState({ tempFilters: oldFilter });
    }

    perClassPriceFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter._classPrice = text;
        this.setState({ tempFilters: oldFilter })
    }

    pricePerMonthFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter._monthPrice = text;
        this.setState({ tempFilters: oldFilter })
    }

    applyFilters = () => {
        this.setState({filters: { ...this.state.filters, ...this.state.tempFilters}})
    }

    componentDidMount() {
        $(window).off("scroll");
        $(".main-panel").off("scroll");
        $("#UserMainPanel").off("scroll");
        $(window).scroll(this.fixedHeader);
        $("#UserMainPanel").scroll(this.fixedHeader);
        $(".main-panel").scroll(this.fixedHeader);
    }

    fixedHeader = () => {
        if (window.innerWidth > 767) {
            if ($("#UserMainPanel").scrollTop() >= 200) {
                $("#scr_affix").addClass("fixed-header");
                if ($(".sidebar").length > 0)
                    $("#scr_affix").css({
                        position: "relative",
                        top: $("#UserMainPanel").scrollTop() - 100 + "px"
                    });
            } else {
                $("#scr_affix").removeClass("fixed-header");
                $("#scr_affix").attr("style", "");
            }
        }
    };

    resetFilter = filterRef => {
        filterRef.schoolName.value = "";
        filterRef.website.value = "";
        filterRef.phoneNumber.value = "";
        filterRef.claimcoords = "";
        filterRef.address.value = "";
        filterRef.typeOfSkill.value = "Any";
        this.setState({
            filters: {}
        });
    };

    handleSkillCategoryChange = filterRef => {
        console.log("onSearch", filterRef);
        let skillCategoryName = filterRef.map(skillCat => {
            return skillCat._id;
        });
        console.log("skillCtaegoryName", skillCategoryName);
        let oldFilter = this.state.filters;
        // This is skill category filter.
        oldFilter.skillCat = skillCategoryName;
        console.log("oldFilter==>", oldFilter);
        this.setState({
            filters: oldFilter
        });
    };
}