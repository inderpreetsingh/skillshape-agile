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
import ConfirmationModal from '/imports/ui/modal/confirmationModal';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    minHeight: 450
  },
  cardIcon : {
    cursor: 'pointer'
  },
  marginAuto: {
    margin:'auto'
  }
}

const MyLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardImageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 420px;
`;

const CardImageWrapper = styled.div`
  max-height: 300px;
  flex-grow: 1;
  width: 100%;

  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.bgImage}');
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


const CardContent = styled.div`

`;

const CardContentHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
`;


const CardContentTitle = styled.h2`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
  text-transform: capitalize;
  margin-bottom: ${helpers.rhythmDiv}px;
  text-align: center;
  line-height: 1;

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

  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    console.info("The error is this...",error, info);
  }

  showConfirmationModal =() => {
    console.log("claimASchool called",Meteor.user(),this);
    const user = Meteor.user();
    const { toastr} = this.props;
    if(!user) {
      // Need to show error in toaster
      toastr.error('You must be signed in to claim a school. [Sign In] or [Sign Up]', 'Error');
    } else {
        // Show confirmation Modal before claiming a school.
        this.setState({
            showConfirmationModal: true,
        });
    }
  }

  cancelConfirmationModal = ()=> this.setState({showConfirmationModal: false})


  render() {
    console.log("this.props checkUserAccess",this.props)
    const {
        classes,
        schoolCardData,
        toastr
      } = this.props;
    //console.log(ShowDetails,"adsljfj")
    const name = schoolCardData.name.toLowerCase();

    return (
      <Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
        {
          this.state.isLoading && <ContainerLoader />
        }
        {
          this.state.showConfirmationModal && <ConfirmationModal
              open={this.state.showConfirmationModal}
              submitBtnLabel="Yes"
              cancelBtnLabel="Cancel"
              message="Do you really want to claim this school ?"
              onSubmit={()=>{this.props.handleClaimASchool(schoolCardData, this)}}
              onClose={this.cancelConfirmationModal}
              toastr = {toastr}
              schoolCardData= {schoolCardData}
          />
        }
        <div>
          <CardImageContentWrapper>
            <MyLink to={`/schools/${schoolCardData.slug}`}> <CardImageWrapper bgImage={schoolCardData.mainImage || cardImgSrc}  /> </MyLink>

            <CardContentHeader>
              <CardContentTitle itemProp="name">{name}</CardContentTitle>
              <CardContentBody>
                  <Typography><b>Website: </b><a href={schoolCardData.website} target='_blank'>{cutString(schoolCardData.website, 20)}</a></Typography>
                  {schoolCardData.email && (<Typography><b>Email: </b>{schoolCardData.email}</Typography>)}
                  <Typography><b>Phone: </b>{schoolCardData.phone}</Typography>
              </CardContentBody>
            </CardContentHeader>

          </CardImageContentWrapper>


          <CardContent>
            <Grid container>
                <Grid item xs={6} sm={6} className={classes.marginAuto}>
                  {
                    <PrimaryButton fullWidth label="Claim" onClick={this.showConfirmationModal}/>
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
