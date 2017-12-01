import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import MediaDetailsRender from './mediaDetailsRender';
import Media from "/imports/api/media/fields";
import '/imports/api/media/methods';

export default class MediaDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          filters: {
            schoolId: this.props.schoolId
          }
        }
    }
    
    openEditMediaForm = (data) => this.setState({showCreateMediaModal: true, mediaFormData: data})
    
    onAddMedia = ({data, fileData, formType}) => {
      // console.log("onAddMedia data -->>",data, fileData);
      if(formType === "system" && fileData) {

        S3.upload({files: { "0": fileData}, path:"schools"}, (err, res) => {
            if(err) {
              console.error("err ",err);
            }
            if(res) {
              data.sourcePath = res.secure_url;
              this.meteorCall({type:"add", data})
            }
        })
      } else if(formType === "url") 
          this.meteorCall({type:"add", data})
      
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
                this.refs.createMedia.hideModal()
            });
        } else if(type === "edit") {
            
            Meteor.call("media.editMedia", editKey, data, (error, result) => {
                if(error) {
                  console.error("error", error);
                }
                this.refs.createMedia.hideModal()
            });
        }
    }
    
    onDeleteMedia = (data) => {
      
      Meteor.call("media.removeModule", data, (error, result) => {
        if(error) {
          console.error("Error -->>",error)
        }
        if(result) {
          console.log("Success!!!!")
        }
      })

    }

    onSearch = (filterRef) => {
      console.log("Media search filterRef  --->>",filterRef);
      let filters = {...this.state.filters};
      filters.name = filterRef.imageName.value
      filters.startDate = filterRef.startDate
      filters.endDate = filterRef.endDate
      this.setState({filters})
    }

    resetFilter = (filterRef) => {
      let filters = {...this.state.filters};
      filterRef.imageName.value = null;
      this.setState({
        filters: {
            schoolId: this.props.schoolId
        }
      });
    }

    render() {
        return MediaDetailsRender.call(this, this.props, this.state)
    }
}
