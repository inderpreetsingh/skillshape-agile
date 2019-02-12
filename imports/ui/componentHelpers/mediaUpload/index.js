import React from "react";
import { filter, isEmpty } from "lodash";
import FileUpload from "material-ui-icons/FileUpload";
import CloseIcon from 'material-ui-icons/Close';
import Link from "material-ui-icons/Link";
import EditIcon from "material-ui-icons/Edit";
import Videocam from "material-ui-icons/Videocam";
import BottomNavigation, { BottomNavigationButton } from "material-ui/BottomNavigation";
import Button from "material-ui/Button";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import Input, { InputAdornment } from "material-ui/Input";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import SkillshapePopover from '/imports/ui/components/landing/components/popovers/SkillshapePopover.jsx';
import IconButton from "material-ui/IconButton";
import { findDOMNode } from "react-dom";
import ProgressiveImage from "react-progressive-image";
import styled from "styled-components";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const ProfilePic = styled.div`
  transition: background-image 1s linear !important;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${props => props.img});
  height: 187px;
  max-width: 225px;
  width: 100%;
`;

const ProfileWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-right: ${helpers.rhythmDiv}px;
`;

const Wrapper = styled.div`
  margin-right: ${helpers.rhythmDiv}px;
`;


const styles = theme => {
  return {
    card: {
      maxWidth: 300
    },
    cardActionsRoot: {
      height: 'auto'
    },
    imgIconRoot: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      position: "absolute",
      zIndex: 5,
      textAlign: "center",
      top: 8,
      right: 8,
      width: helpers.rhythmDiv * 3,
      height: helpers.rhythmDiv * 3
    },
    imgIconLabel: {
      fontSize: helpers.baseFontSize
    },
    media: {
      border: "2px solid black",
      backgroundColor: theme.palette.grey[100],
      display: "inline-flex",
      alignItems: "center",
      position: 'relative',
      color: "#fff",
      maxWidth: "230px",
      width: '100%',
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
    },
    dialogBoxPaper: {
      [`@media screen and (max-width: ${helpers.mobile}px)`]: {
        margin: 0
      }
    },
  };
};

const popOverStyles = {
  listItemIcon: {
    marginRight: 0
  }
}

const PopoverListItemIcon = withStyles(popOverStyles)(({ classes, children }) => (
  <ListItemIcon classes={{ root: classes.listItemIcon }}>
    {children}
  </ListItemIcon>
))


class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isListOpen: false,
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

  handleImageUpload = () => {
    this.uploadInput.click();
  }
  onFileLoad = (e, file, org) => {
    let files = { ...this.state.files };
    files["file"] = e.target.result;
    files["fileData"] = file;
    files["isUrl"] = false;
    files['org'] = org;
    this.setState({ files });
    this.props.onChange && this.props.onChange(files);
  };
  clearSelectedImage = () => {
    this.uploadInput.value = null;
    this.setState({ files: null });
    this.props.onChange && this.props.onChange(null);
  };
  onInputChange = e => {
    let org = e.target.files[0];
    filter(
      e.target.files,
      file => file.type.match(this.props.fileTypeRegex) !== null
    ).forEach(file => {
      let reader = new FileReader();
      reader.onload = e => this.onFileLoad(e, file, org);
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

  handleEditImg = (isListOpen) => (e) => {
    !isEmpty(e) && e.persist();
    this.setState(state => {
      return {
        ...state,
        isListOpen,
        positionLeft: !isEmpty(e) && e.clientX,
        positionTop: !isEmpty(e) && e.clientY
      }
    });
  }

  getOptionsList = () => {
    return (<List>
      <ListItem button onClick={this.handleImageUpload}>
        <PopoverListItemIcon>
          <FileUpload />
        </PopoverListItemIcon>
        <ListItemText primary="Upload" />
      </ListItem>

      <ListItem button onClick={this.handleClickOpen}>
        <PopoverListItemIcon>
          <Link />
        </PopoverListItemIcon>
        <ListItemText primary={'Image URL'} />
      </ListItem>

      {this.props.showVideoOption && (
        <ListItem button onClick={this.handleChange}>
          <PopoverListItemIcon>
            <Videocam />
          </PopoverListItemIcon>
          <ListItemText primary={'Video URL'} />
        </ListItem>
      )}
    </List>)
  }

  render() {
    const { classes, fullScreen, loading, minWidth } = this.props;
    const { isListOpen, positionLeft, positionTop } = this.state;
    const style = {
      position: "relative",
      marginRight: helpers.rhythmDiv
    };


    if (minWidth) {
      style.minWidth = minWidth;
    } else {
      style.width = this.props.width || 300;
    }
    // console.info('isListOpen, positionLeft, positionTop', isListOpen, positionLeft, positionTop);
    return (
      <Wrapper>
        <Card style={style}>
          <CardContent classes={{ root: classes.cardContentRoot }}>
            <div className={classes.media}>
              <ProgressiveImage
                src={this.state.files && this.state.files.file}
                placeholder={config.blurImage}>
                {(src) => <ProfilePic img={src} />}
              </ProgressiveImage>
              <IconButton
                classes={{ root: classes.imgIconRoot, label: classes.imgIconLabel }}
                onClick={this.handleEditImg(true)}
              >
                <EditIcon />
              </IconButton>

              {isListOpen && <SkillshapePopover
                positionLeft={positionLeft}
                positionTop={positionTop}
                isOpen={isListOpen}
                anchorReference={'anchorPosition'}
                onClose={this.handleEditImg(false)}
              >
                {this.getOptionsList()}
              </SkillshapePopover>}
            </div>
            {/* this.state.files && this.state.files.file &&
              <Button onClick={this.clearSelectedImage} fab color="primary"  aria-label="clear" className={classes.button}>
                <Clear />
              </Button>*/}
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
          </CardContent>
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
      </Wrapper>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Upload);
