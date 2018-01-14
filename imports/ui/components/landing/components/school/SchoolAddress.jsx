import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
    ${helpers.flexCenter}
    flex-direction: column;
    margin: ${helpers.rhythmDiv} 0;
    padding: ${helpers.rhythmDiv}px;

    @media screen and (max-width: ${helpers.tablet}px) {
        margin: 0;
    }
`;

const SchoolAddress = (props) => (
  <Wrapper>
    {props.site && <p>{props.site}</p>}
    <p>{props.address}</p>
  </Wrapper>
);

SchoolAddress.propTypes = {
  site: PropTypes.string,
  address: PropTypes.string
}

SchoolAddress.defaultProps = {
  site: 'www.gracie.com',
  address: '123, anywhere St, San Diego Ca'
}

export default SchoolAddress;
