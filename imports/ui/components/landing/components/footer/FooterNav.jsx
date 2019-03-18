import React,{ useState } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import ContactUsPage from "/imports/ui/pages/ContactUsPage";
import * as helpers from '../jss/helpers.js';

import { FooterSectionHeader,FooterLink } from './FooterHelpers';


const FooterNavWrapper = styled.div`
    ${helpers.flexDirectionColumn}
`;

const FooterNav = () => {
  const [contactUsPage, setContactUsPage] = useState(false);
  return (<FooterNavWrapper itemScope itemType="http://www.schema.org/SiteNavigationElement">
  {contactUsPage && (
    <ContactUsPage
    open={contactUsPage}
    onModalClose={()=>{setContactUsPage(false)}}
    />
  )}
<FooterSectionHeader>Links</FooterSectionHeader>
<FooterLink itemProp="url" onClick={() => browserHistory.push('/Aboutus') }>
  <span itemProp="name">About</span>
</FooterLink>
<FooterLink itemProp="url" onClick={() => browserHistory.push('/') }>
  <span itemProp="name">FAQ</span>
</FooterLink>
<FooterLink itemProp="url" onClick={() => setContactUsPage(true) }>
  <span itemProp="name">Contact</span>
</FooterLink>
<FooterLink itemProp="url" onClick={() => browserHistory.push('/claimSchool') }>
  <span itemProp="name">Claim School</span>
</FooterLink>
</FooterNavWrapper>) 
  
};

export default FooterNav;
