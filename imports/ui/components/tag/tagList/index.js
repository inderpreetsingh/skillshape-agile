import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import TagListRender from "./tagListRender";

class TagList extends React.Component {

	constructor(props){
    super(props);
  }
  
	render() {
    return TagListRender.call(this, this.props, this.state)
  }
}

export default createContainer(props => {
  
  let tagsData = tags.find({tag: {$regex: new RegExp(props.filterTag, 'i')} }, {limit: 10}).fetch();
  return {...props, tagsData};
}, TagList);