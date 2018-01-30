import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';


const styles = theme => {
  // console.log("theme", theme);
  return {
    btn: {
      margin: 5,
      width: 165,
      border: "solid 2px black"
    },
    btnActive: {
      margin: 5,
      width: 165,
      border: "solid 2px black",
      color: "#fff"
    }
  }
}



class ResponsiveTabs extends React.Component {

  constructor(props){
    super(props);
    let { defaultValue } = this.props;
    this.state = {
      tabValue: defaultValue || 0
    };
  }
  componentWillReceiveProps(props) {
    // Listen for `?classDetails=true` so that we can click on tab.
    if(this.props.queryTabValue && this.props.tabValue == props.tabValue) {
      // We should set state for class details tab so that it opens automatically.
      this.setState({tabValue:this.props.queryTabValue})
    }
  }
  componentDidMount() {
    let { defaultValue } = this.props;
    this.props.onTabChange(defaultValue || 0);
  }
  render() {
    const { classes, defaultValue } = this.props;
    return (
      <div className="responsive-tab">
          <div style={{display: "inline-flex",flexWrap: 'wrap',justifyContent: 'center', width: "100%", marginBottom: 25}}>
              {this.props.tabs.map((tab,index)=> {
                return <Button className={index == this.state.tabValue ? classes.btnActive : classes.btn} raised color={index == this.state.tabValue && this.props.color } onClick={()=> {this.props.onTabChange(index);this.setState({tabValue: index})}} >
                   {tab}
                </Button>
              })}
          </div>
      </div>
    );
  }
}

ResponsiveTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResponsiveTabs);
