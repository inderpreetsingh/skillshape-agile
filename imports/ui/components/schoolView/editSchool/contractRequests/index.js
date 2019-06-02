import { isEmpty } from 'lodash';
import { withStyles } from 'material-ui/styles';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import styled from 'styled-components';
import Contracts from '/imports/api/contracts/fields';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import { confirmationDialog, withPopUp } from '/imports/util';

const Wrapper = styled.div`
  background: white;
`;
const Request = styled.div`
  margin: 5px 0px 20px 0px;
  width: auto;
  border: #4caf50 1px solid;
  border-radius: 45px;
  padding: 13px;
  font-family: sans-serif;
  text-transform: capitalize;
  box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, 0.2);
`;
const Div = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const styles = theme => ({
  root: {
    maxWidth: `calc(90% - ${rhythmDiv * 4}px)`,
    margin: '0 auto',
    boxShadow: 'none',
    background: 'transparent',
    marginBottom: rhythmDiv * 2,
  },
  rootGrid: {
    padding: '6px',
  },
});

class ContractRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.isLoading,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isLoading: nextProps.isLoading });
  }

  handleOperation = (obj, status, popUp) => {
    this.setState({ isLoading: true }, () => {
      const {
        _id, autoWithdraw, payAsYouGo, purchaseId,
      } = obj;
      const data = {
        _id, status, action: 'update', autoWithdraw, payAsYouGo, purchaseId,
      };
      Meteor.call('Contracts.handleRecords', data, (err, res) => {
        if (res) {
          this.setState({ isLoading: false }, () => {
            const data = {
              popUp,
              title: 'Success',
              type: 'success',
              content: 'Operation Performed Successfully',
              buttons: [{ label: 'Ok', onClick: () => {} }],
            };
            confirmationDialog(data);
          });
        }
      });
    });
  };

  confirmation = (obj, status) => {
    const { popUp } = this.props || {};
    const data = {
      popUp,
      title: 'Confirmation',
      type: 'inform',
      content: 'Do you really want to do this.',
      buttons: [
        { label: 'Cancel', onClick: () => {}, greyColor: true },
        {
          label: 'Yes',
          onClick: () => {
            this.handleOperation(obj, status, popUp);
          },
        },
      ],
    };
    confirmationDialog(data);
  };

  render() {
    const { contractsData } = this.props;
    const { isLoading } = this.state;
    return (
      <Wrapper>
        {isLoading && <ContainerLoader />}
        <center>
          <Div>
            {!isEmpty(contractsData) ? (
              contractsData.map((obj, index) => (
                <Request key={index.toString()}>
                  <b>User Name:</b>
                  {' '}
                  {obj.userName || 'Missing'}
                  <br />
                  <b>Package Name:</b>
                  {' '}
                  {obj.packageName}
                  {' '}
                  <br />
                  <b>Reason:</b>
                  {' '}
                  {obj.reason}
                  {' '}
                  <br />
                  <FormGhostButton
                    label="Deny"
                    onClick={() => {
                      this.confirmation(obj, 'denied');
                    }}
                    alertColor
                  />
                  <FormGhostButton
                    label="Allow"
                    onClick={() => {
                      this.confirmation(obj, 'allowed');
                    }}
                  />
                </Request>
              ))
            ) : (
              <Request>No Request Found</Request>
            )}
          </Div>
        </center>
      </Wrapper>
    );
  }
}
export default createContainer((props) => {
  const {
    schoolData: { _id: schoolId },
  } = props || {};
  const filter = { schoolId, status: 'pending' };
  let contractsData = [];
  let isLoading = true;
  const contractSubscription = Meteor.subscribe('contracts.getRequests', filter);
  if (contractSubscription && contractSubscription.ready()) {
    contractsData = Contracts.find().fetch();
    isLoading = false;
  }
  return {
    ...props,
    contractsData,
    isLoading,
  };
}, withStyles(styles)(withPopUp(ContractRequests)));
