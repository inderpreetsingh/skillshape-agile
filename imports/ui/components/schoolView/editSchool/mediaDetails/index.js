import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MediaDetailsRender from './mediaDetailsRender';
import Media from "/imports/api/media/fields";
import '/imports/api/media/methods';

class MediaDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          open: false,
          sticky: false,
          limit: 10,
          filters: {
            schoolId: this.props.schoolId
          }
        }
    }
    handleFixedToggle = status => {
      // console.log("handleFixedToggle", defaultPosition);
      // const stickyPosition = !defaultPosition;
      // console.log(this.state.sticky, defaultPosition);
      // if (this.state.sticky != stickyPosition) {
      //   this.setState({
      //     sticky: stickyPosition
      //   });
      // }

      if (status.status === 2) {
        if(!this.state.sticky) {
          this.setState({
            sticky: true
          });
        }
      }else if(status.status === 0) {
        this.setState({
           sticky: false
        });
      }
    }

    changeLimit = ()=>{
      let incerementFactor = 10;
      this.setState({limit: this.state.limit+incerementFactor})
    }

    closeMediaUpload = ()=>{
      this.setState({showCreateMediaModal: false, loading: false})
    }

    openEditMediaForm = (data) => this.setState({showCreateMediaModal: true, mediaFormData: data, filterStatus: false})

    showLoading = ()=>{
      this.setState({loading: true})
    }

    onAddMedia = ({data, fileData, isUrl}) => {
      console.log("data====>",data)
      // console.log("onAddMedia data -->>",data, fileData);
      if(isUrl){
          this.meteorCall({type:"add", data})
      } else {
        S3.upload({files: { "0": fileData}, path:"schools"}, (err, res) => {
            if(err) {
              console.error("err ",err);
            }
            if(res) {
              data.sourcePath = res.secure_url;
              this.meteorCall({type:"add", data})
            }
        })
      }
    }

    onEditMedia = ({editKey, data, fileData}) => {
        // console.log("onEditMedia data -->>",data, fileData);
        if(data.type === "url") {
            this.meteorCall({type:"edit", data, editKey})
        } else {

            if(fileData) {

                S3.upload({files: { "0": fileData}, path:"schools"}, (err, res) => {
                    if(err) {
                      console.error("err ",err);
                    }
                    if(res) {
                      data.sourcePath = res.secure_url;
                      this.meteorCall({type:"edit", data, editKey})
                    }
                })

            } else {
                this.meteorCall({type:"edit", data, editKey})
            }
        }

    }

    meteorCall = ({type, data, editKey}) => {
        if(type === "add") {

            Meteor.call("media.addMedia", data, (error, result) => {
                if(error) {
                  console.error("error", error);
                }
                this.closeMediaUpload();
            });
        } else if(type === "edit") {

            Meteor.call("media.editMedia", editKey, data, (error, result) => {
                if(error) {
                  console.error("error", error);
                }
                this.closeMediaUpload();
            });
        }
    }

    onDeleteMedia = (data) => {

      Meteor.call("media.removeMedia", data, (error, result) => {
        if(error) {
          console.error("Error -->>",error)
        }
        if(result) {
          console.log("Success!!!!")
        }
      })

    }

    onSearch = (filterObj) => {
      this.setState({
        filters: {
          ...this.state.filters,
          ...filterObj,
        }
      })
    }

    resetFilter = () => {
      this.setState({
        filters: {
            schoolId: this.props.schoolId
        },
      });
    }

    render() {
        return MediaDetailsRender.call(this, this.props, this.state)
    }
}

export default MediaDetails;
