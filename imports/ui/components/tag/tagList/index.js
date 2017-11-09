import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import TagListRender from "./tagListRender";

class TagList extends React.Component {

	constructor(props){
    super(props);
    this.state = {}
  }
  
  onTagClick = (tagValue) => {
    this.setState({
      tagSelected : tagValue
    })
    this.props.onSearchTag(tagValue)
  }

	render() {
    return TagListRender.call(this, this.props, this.state)
  }
}

export default createContainer(props => {
  // console.log("TagList createContainer -->>",props);
  let tagsData = tags.find({tag: {$regex: new RegExp(props.filterTag, 'i')}, class: props.skillClass }, {limit: 10}).fetch();
  console.log("TagList tagsData -->>",tagsData);
  return {...props, tagsData};
}, TagList);