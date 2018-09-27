import React from "react";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card";
import BottomNavigation, {
  BottomNavigationButton
} from "material-ui/BottomNavigation";
import Videocam from "material-ui-icons/Videocam";
import FileUpload from "material-ui-icons/FileUpload";
import Link from "material-ui-icons/Link";
import Clear from "material-ui-icons/Clear";
import { findDOMNode } from "react-dom";
import { filter, assign } from "lodash";
import ProgressiveImage from "react-progressive-image";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";
import Typography from "material-ui/Typography";
import styled from "styled-components";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

const ProfilePic =styled.div`
transition: background-image 1s linear !important;
background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${props=>props.img});
    height: 187px;
    width: 223px;
`;
const styles = theme => {
  return {
    card: {
      maxWidth: 300
    },
    media: {
      border: "2px solid black",
      backgroundColor: theme.palette.grey[100],
      display: "inline-flex",
      alignItems: "center",
      color: "#fff",
      width: "230px",
      minHeight: 195,
      justifyContent: "center",
      backgroundSize: "auto",
      transition: "all 1s linear !important",
    },
    button: {
      position: "absolute",
      bottom: 75,
      left: 25
      // backgroundColor: theme.palette.primary['500'],
      // color: '#fff'
    },
    image: {
      transition: "all 1s linear !important",
      verticalAlign: "middle",
      width: "100%"
    }
  };
};

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      open: false,
      files: props.data,
      loading: false
    };
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleAddClose = () => {
    this.setState({
      open: false,
      files: { file: this.urlInput.value, isUrl: true }
    });
    this.props.onChange &&
      this.props.onChange({ file: this.urlInput.value, isUrl: true });
  };
  handleChange = (event, value) => {
    if (value == 0) {
      this.uploadInput.click();
    }
    this.setState({ value });
  };
  onFileLoad = (e, file,org) => {
    let files = { ...this.state.files };
    files["file"] = e.target.result;
    files["fileData"] = file;
    files["isUrl"] = false;
    files['org']=  org;
    this.setState({ files });
    this.props.onChange && this.props.onChange(files);
  };
  clearSelectedImage = () => {
    this.uploadInput.value = null;
    this.setState({ files: null });
    this.props.onChange && this.props.onChange(null);
  };
  onInputChange = e => {
    let org=e.target.files[0];
    filter(
      e.target.files,
      file => file.type.match(this.props.fileTypeRegex) !== null
    ).forEach(file => {
      let reader = new FileReader();
      reader.onload = e => this.onFileLoad(e, file,org);
      reader.readAsDataURL(file);
    });
  };

  componentDidMount() {
    findDOMNode(this.uploadInput).addEventListener(
      "change",
      this.onInputChange,
      false
    );
  }

  componentWillUnmount() {
    findDOMNode(this.uploadInput).removeEventListener(
      "change",
      this.onInputChange,
      false
    );
  }

  render() {
    const { classes, fullScreen, loading, minWidth } = this.props;
    let style = {
      position: "relative"
    };

    if (minWidth) {
      style.minWidth = minWidth;
    } else {
      style.width = this.props.width || 300;
    }

    return (
      <div>
        <Card style={style}>
          <CardContent>
            <div className={classes.media}>
            <ProgressiveImage 
                        src={this.state.files && this.state.files.file}
                        placeholder={config.blurImage}>
                        {(src) =><ProfilePic img={src}/>}
                      </ProgressiveImage>
              
            </div>
            {/* this.state.files && this.state.files.file &&
              <Button onClick={this.clearSelectedImage} fab color="primary"  aria-label="clear" className={classes.button}>
                <Clear />
              </Button>*/}
          </CardContent>
          <CardActions style={{ paddingBottom: 26 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              ref={ref => {
                this.uploadInput = ref;
              }}
              multiple
              type="file"
            />
            <BottomNavigation
              showLabels
              value={this.state.value}
              onChange={this.handleChange}
            >
              <BottomNavigationButton
                label="Upload From Computer"
                icon={<FileUpload />}
              />
              <BottomNavigationButton
                onClick={this.handleClickOpen}
                label="Image URL"
                icon={<Link />}
              />
              {this.props.showVideoOption && (
                <BottomNavigationButton label="Video URL" icon={<Videocam />} />
              )}
            </BottomNavigation>
          </CardActions>
        </Card>

        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Add Image URL"}
          </DialogTitle>
          <DialogContent>
            <Input
              type="text"
              inputRef={ref => (this.urlInput = ref)}
              defaultValue={
                this.state.files && this.state.files.isUrl
                  ? this.state.files.file
                  : ""
              }
              startAdornment={
                <InputAdornment position="start">
                  <Link />
                </InputAdornment>
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddClose} color="primary">
              Add
            </Button>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Upload);
