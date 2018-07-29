import React from "react";
import styled from "styled-components";
import { withStyles } from "material-ui/styles";

import Button from "material-ui/Button";
import TextField from "material-ui/TextField";

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog
} from "material-ui/Dialog";

import ConfirmationModal from "/imports/ui/modal/confirmationModal";
import { ContainerLoader } from "/imports/ui/loading/container";

import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";
import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

import "/imports/api/sLocation/methods";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const formId = "LocationForm";

const MyForm = styled.div`
  max-width: 50%;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Title = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 1.5}px;
  line-height: 1;
  font-weight: 500;
`;

const Tagline = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  line-height: 1;
`;

const styles = theme => {
  return {
    button: {
      margin: 5,
      width: 150
    },
    dialogRootPaper: {
      maxWidth: 700,
      width: "100%",
    },
    dialogContent: {
      display: "flex",
      [`@media screen and (max-width: ${helpers.mobile}px)`]: {
        flexDirection: "column"
      }
    },
    dialogActions: {
      padding: `${helpers.rhythmDiv}px`,
      paddingTop: 0
    }
  };
};

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      myLocation: this.initalizeMyLocation(),
      completeAddress: this.initializeCompleteAddress()
    };
  }

  initalizeMyLocation = () => {
    const data = this.props.data || { loc: ["", ""] };
    return {
      lat: data.loc[0],
      lng: data.loc[1]
    };
  };

  initializeCompleteAddress = () => {
    const data = this.props.data || {};
    return {
      street: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      country: data.country || ""
    };
  };

  _getComponentFromCompleteAddress = (
    componentYouLookingFor,
    addressComponents
  ) => {
    console.info(addressComponents, "addrss components..");
    for (let i = 0; i < addressComponents.length; ++i) {
      const currentAddComponent = addressComponents[i];
      if (currentAddComponent.types.indexOf(componentYouLookingFor) !== -1) {
        return currentAddComponent.long_name;
      }
    }
    return "";
  };

  getAddressFromLocation = ({ lat, lng }) => {
    if (lat && lng) {
      const geocoder = new google.maps.Geocoder();
      const coords = [lat, lng];
      const latlng = new google.maps.LatLng(lat, lng);
      this.setState(previousState => {
        return {
          isBusy: true
        };
      });
      geocoder.geocode({ latLng: latlng }, (results, status) => {
        this.setState(previousState => {
          return {
            isBusy: false
          };
        });
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let place = results[0];
            // coords.NEPoint = [place.geometry.bounds.b.b, place.geometry.bounds.b.f];
            // coords.SWPoint = [place.geometry.bounds.f.b,place.geometry.bounds.f.f];
            console.log(results[0], "location details...");
            const addressComponents = results[0].address_components;
            const currentPosAddress = {
              zip: this._getComponentFromCompleteAddress(
                "postal_code",
                addressComponents
              ),
              state: this._getComponentFromCompleteAddress(
                "administrative_area_level_1",
                addressComponents
              ),
              city: this._getComponentFromCompleteAddress(
                "administrative_area_level_2",
                addressComponents
              ),
              street:
                this._getComponentFromCompleteAddress(
                  "route",
                  addressComponents
                ) +
                " " +
                this._getComponentFromCompleteAddress(
                  "sublocality",
                  addressComponents
                ) +
                " " +
                this._getComponentFromCompleteAddress(
                  "locality",
                  addressComponents
                ),
              country: this._getComponentFromCompleteAddress(
                "country",
                addressComponents
              )
            };

            this.setState(state => {
              console.log("setting state, address...");
              return {
                ...state,
                completeAddress: currentPosAddress,
                myLocation: {
                  lat: lat,
                  lng: lng
                }
              };
            });
            console.log(currentPosAddress, "----------- current Pos Address");
            // const sLocation = results[0].formatted_address;
          }
        }
      });
    }
  };

  handleBlur = event => {
    if (!event.target.value) {
      return false;
    }
    this.onSubmit(event, true);
  };
  handleAddressChange = name => event => {
    // event.preventDefault();
    const value = event.target.value;
    this.setState(state => {
      //console.log(event, event.target, "event.target");
      return {
        ...state,
        completeAddress: {
          ...state.completeAddress,
          [name]: value
        }
      };
    });
  };

  onSubmit = (event, noSubmit) => {
    event.preventDefault();
    // debugger;
    const payload = {
      createdBy: Meteor.userId(),
      schoolId: this.props.schoolId,
      title: this.locationName.value,
      address: this.streetAddress.value,
      city: this.city.value,
      state: this.locState.value,
      zip: this.zipCode.value,
      country: this.country.value
    };
    const sLocationDetail =
      payload.address +
      "," +
      payload.city +
      "," +
      payload.zip +
      "," +
      payload.country;
    debugger;
    if (!sLocationDetail) {
      return false;
    }

    this.setState({ isBusy: true });
    getLatLong(sLocationDetail, data => {
      if (data) {
        payload.geoLat = data.lat;
        payload.geoLong = data.lng;
        payload.loc = [data.lat, data.lng];

        if (noSubmit) {
          this.setState(state => {
            return {
              ...state,
              isBusy: false,
              completeAddress: {
                street: payload.address,
                zip: payload.zip,
                country: payload.country,
                city: payload.city,
                state: payload.state
              },
              myLocation: {
                lat: payload.geoLat,
                lng: payload.geoLong
              }
            };
          });
        } else {
          this.handleSubmit(payload);
        }
      } else {
        const getLatLongPayload =
          payload.city + "," + payload.zip + "," + payload.country;
        getLatLong(getLatLongPayload, data => {
          if (data == null) {
            return false;
          } else {
            payload.geoLat = data.lat;
            payload.geoLong = data.lng;
            payload.loc = [data.lat, data.lng];
            if (noSubmit) {
              this.setState(state => {
                return {
                  ...state,
                  isBusy: false,
                  completeAddress: {
                    street: payload.address,
                    zip: payload.zip,
                    country: payload.country,
                    city: payload.city,
                    state: payload.state
                  },
                  myLocation: {
                    lat: payload.geoLat,
                    lng: payload.geoLong
                  }
                };
              });
            } else {
              this.handleSubmit(payload);
            }
          }
        });
      }
    });
  };

  handleSubmit = (payload, deleteObj) => {
    const { data } = this.props;
    let methodName;
    let docObj = {};
    if (data && data._id) {
      docObj.doc = payload;
      if (deleteObj) {
        methodName = "location.removeLocation";
      } else {
        methodName = "location.editLocation";
        docObj.doc_id = data._id;
      }
    } else {
      methodName = "location.addLocation";
      docObj.doc = payload;
    }
    this.props.enableParentPanelToDefaultOpen();
    Meteor.call(methodName, docObj, (error, result) => {
      if (error) {
      }
      if (result) {
        this.props.onClose(result);
      }

      this.setState({ isBusy: false, error });
    });
  };

  getActionButtons = data => {
    if (data) {
      return (
        <DialogActions>
          <Button onClick={() => this.handleSubmit(data, true)} color="primary">
            Delete
          </Button>
          <Button type="submit" form={formId} color="primary">
            Edit Location
          </Button>
        </DialogActions>
      );
    } else {
      return (
        <DialogActions>
          <Button type="submit" form={formId} color="primary">
            Submit
          </Button>
          <Button onClick={() => this.props.onClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      );
    }
  };

  render() {
    const { fullScreen, data, classes, currentUser } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="form-dialog-title"
          fullScreen={false}
          classes={{ paper: classes.dialogRootPaper }}
        >
          <DialogTitle id="form-dialog-title">
            <Title>Add Location</Title>
            <Tagline>
              You can drag the marker to point your location on the map, or just
              type the details in the form.
            </Tagline>
          </DialogTitle>

          {this.state.isBusy && <ContainerLoader />}
          {this.state.showConfirmationModal && (
            <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes, Delete"
              cancelBtnLabel="Cancel"
              message="You will delete this location, Are you sure?"
              onSubmit={() => this.handleSubmit(data, true)}
              onClose={() => this.setState({ showConfirmationModal: false })}
            />
          )}
          {this.state.error ? (
            <div style={{ color: "red" }}>{this.state.error}</div>
          ) : (
            <DialogContent classes={{ root: classes.dialogContent }}>
              <SchoolLocationMap
                locationData={this.state.myLocation}
                myCurrentPosition={JSON.parse(
                  localStorage.getItem("myLocation")
                )}
                onDragEnd={this.getAddressFromLocation}
              />

              <MyForm id={formId} onSubmit={this.onSubmit}>
                <TextField
                  required={true}
                  defaultValue={data && data.title}
                  margin="dense"
                  inputRef={ref => (this.locationName = ref)}
                  label="Location Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  value={this.state.completeAddress.street}
                  margin="dense"
                  inputRef={ref => (this.streetAddress = ref)}
                  label="Street Address"
                  type="text"
                  fullWidth
                  onChange={this.handleAddressChange("street")}
                  onBlur={this.handleBlur}
                />
                <TextField
                  required={true}
                  value={this.state.completeAddress.city}
                  margin="dense"
                  inputRef={ref => (this.city = ref)}
                  label="City"
                  type="text"
                  onChange={this.handleAddressChange("city")}
                  onBlur={this.handleBlur}
                  fullWidth
                />
                {/* state ==> for the state in a country*/}
                <TextField
                  value={this.state.completeAddress.state}
                  margin="dense"
                  inputRef={ref => (this.locState = ref)}
                  label="State"
                  type="text"
                  onChange={this.handleAddressChange("state")}
                  onBlur={this.handleBlur}
                  fullWidth
                />
                <TextField
                  required={true}
                  value={this.state.completeAddress.zip}
                  margin="dense"
                  inputRef={ref => (this.zipCode = ref)}
                  label="Zip Code"
                  type="text"
                  onChange={this.handleAddressChange("zip")}
                  onBlur={this.handleBlur}
                  fullWidth
                />
                <TextField
                  required={true}
                  value={this.state.completeAddress.country}
                  margin="dense"
                  inputRef={ref => (this.country = ref)}
                  label="Country"
                  type="text"
                  onChange={this.handleAddressChange("country")}
                  onBlur={this.handleBlur}
                  fullWidth
                />
              </MyForm>
            </DialogContent>
          )}
          <DialogActions classes={{ root: classes.dialogActions }}>
            {data && (
              <Button
                onClick={() => this.setState({ showConfirmationModal: true })}
                color="accent"
              >
                Delete
              </Button>
            )}
            <Button onClick={() => this.props.onClose()} color="primary">
              Cancel
            </Button>
            <Button type="submit" form={formId} color="primary">
              {data ? "Save" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(withMobileDialog()(LocationForm));
