import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import MoreVert from 'material-ui-icons/MoreVert';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid'
import { Link } from 'react-router';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import * as helpers from '../jss/helpers';
import { cardImgSrc } from '../../site-settings.js';
import { cutString, toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';



const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer'
  },
  cardIcon : {
    cursor: 'pointer'
  },
  marginAuto: {
    margin:'auto'
  }
}

const CardImageWrapper = styled.div`
  height: 250px;
  width: 100%;
  position: relative;
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
`;

const CardContent = styled.div`

`;

const CardContentHeader = styled.div`
  display: flex;
  padding: 10px;
  padding-bottom: ${helpers.rhythmDiv}px;
  justify-content: space-between;
  align-items: center;
`;

const CardContentTitle = styled.div`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};

  @media screen and (max-width : ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
  }

  @media screen and (max-width : ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.2}px;
  }
`;

const CardContentBody = styled.div`
  padding: 0px 10px 10px 10px;
`;

const CardDescriptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  font-family: ${helpers.specialFont};
  padding: 10px;
  position: absolute;
  background-color: white;
  width: 100%;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transform-origin: 100% 100%;
`;

const CardDescriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardDescriptionActionArea = styled.div`
  padding: 5px;
`;

class SchoolCard extends Component {
  state = {
    imageContainerHeight: '250px',
    revealCard: false,
    isLoading:false
  };
  updateDimensions = () => {
    const container = ReactDOM.findDOMNode(this.imgContainer);
    const width = window.getComputedStyle(container,null).width;
    this.setState({
      imageContainerHeight: width
    })
  }
  componentDidMount() {
    //this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    console.info("The error is this...",error, info);
  }
  handleClaimASchool = (event) => {
    console.log("claimASchool called",Meteor.user(),this);
    const { toastr, schoolCardData } = this.props;
    const user = Meteor.user();
    if(!user) {
      // Need to show error in toaster
      toastr.error('You must be signed in to claim a school. [Sign In] or [Sign Up]', 'Error');
    } else {
        const payload ={
          schoolId: schoolCardData._id,
          schoolName:schoolCardData.name,
          userId: user._id,
          userEmail:user.emails[0].address,
          userName: user.profile.firstName,
          schoolEmail:schoolCardData.email
        }
        this.setState({isLoading:true});
        Meteor.call('school.claimSchoolRequest',payload,(err, result)=> {
          console.log("result",result);
          this.setState({isLoading:false});
          if(result.alreadyRejected) {
            toastr.error('Your request has been rejected to manage this school by school Admin', 'Error');
          }else if(result.pendingRequest) {
            toastr.error("We are in the process of resolving your claim. We will contact you as soon as we reach a verdict or need more information. Thanks for your patience.",'Error');
          } else if(result.alreadyManage) {
            toastr.success("You already manage a school. You cannot claim another School. Please contact admin for more details",'success');
          } else if(result.onlyOneRequestAllowed) {
            toastr.error(`You are not allowed to do more than one request as you have already created request for School Name:${result.schoolName}`,'Error');
          }else if(result.emailSuccess) {
            toastr.error("We have sent your request to school admin. We will assist you soon :)",'success');
          }
        });
    }
  }
  render() {
    console.log("this.props checkUserAccess",this.props)
    const {
        classes,
        schoolCardData,
      } = this.props;
    //console.log(ShowDetails,"adsljfj")
    return (
      <Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
        {
          this.state.isLoading && <ContainerLoader />
        }
        <div>
          <CardImageWrapper ref={(div) => this.imgContainer = div} style={{height: this.state.imageContainerHeight}}>
             <Link to={`/schools/${schoolCardData.slug}`}>
                <CardImage src={schoolCardData.mainImage || cardImgSrc} alt="card img" />
              </Link>
          </CardImageWrapper>

          <CardContent>
            <CardContentHeader>
              <CardContentTitle itemProp="name">{cutString(schoolCardData.name, 25)}</CardContentTitle>
             {/* <IconButton className={classes.cardIcon} onClick={this.revealCardContent} >
                <MoreVert />
              </IconButton>*/}
            </CardContentHeader>

            <CardContentBody>
                <Typography><b>Website: </b><a href={schoolCardData.website} target='_blank'>{cutString(schoolCardData.website, 20)}</a></Typography>
                {schoolCardData.email && (<Typography><b>Email: </b>{schoolCardData.email}</Typography>)}
                <Typography><b>Phone: </b>{schoolCardData.phone}</Typography>
            </CardContentBody>
            <Grid container>
                <Grid item xs={6} sm={6} className={classes.marginAuto}>
                  {
                    <PrimaryButton fullWidth label="Claim" onClick={this.handleClaimASchool}/>
                  }
                </Grid>
            </Grid>
          </CardContent>
        </div>
      </Paper>
    );
  }
}

SchoolCard.propTypes = {
    schoolCardData: PropTypes.object.isRequired,
    height: PropTypes.number,
}

SchoolCard.defaultProps = {
   classTypeImg: cardImgSrc,
}

export default withStyles(styles)(toastrModal(SchoolCard));