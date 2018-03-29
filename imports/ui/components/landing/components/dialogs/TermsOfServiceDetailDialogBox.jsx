import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import ClearIcon from 'material-ui-icons/Clear';

import {withStyles} from 'material-ui/styles';
import { MuiThemeProvider} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const styles = {
    dialogPaper: {
        padding: `${helpers.rhythmDiv * 2}px`
    },
    dialogActionInnerWrapper: {
        textAlign: 'center',
    },
    dialogContent :  {
        '@media screen and (max-width : 500px)': {
            minHeight: '150px',
        }
    },
};

const DialogBoxHeaderText = styled.p`
    font-family: ${helpers.commonFont};
    color: ${helpers.textColor};
`;

const ButtonsWrapper = styled.div`
    display: flex;

    @media screen and (max-width : ${helpers.mobile}px) {
        display: flex;
        flex-direction: column-reverse;
        padding-top: ${helpers.rhythmDiv}px;
    }
`;

const DialogTitleWrapper = styled.div`
    ${helpers.flexHorizontalSpaceBetween}
    width: 100%;
`;

const ContentTiltle = styled.h2`
    text-align: center;
`

const TermsOfServiceDetailDialogBox = (props) => (
    <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="terms-of-service-detail"
        classes={{paper: props.classes.dialogPaper}}
        itemScope
        itemType="http://schema.org/Service"
    >
        <MuiThemeProvider theme={muiTheme}>
            <DialogTitle>
                <DialogTitleWrapper>
                    <span itemProp="name">Terms Of Service</span>

                    <IconButton color="primary" onClick={props.onModalClose}>
                        <ClearIcon/>
                    </IconButton>
                </DialogTitleWrapper>
            </DialogTitle>

            <DialogContent className={props.classes.dialogContent} itemProp="termsOfService">
                <Typography>
                    <ContentTiltle>Welcome to SkillShape!</ContentTiltle>
                    <p>
                      SkillShape is a messaging and scheduling platform designed for communication and coordination across organizations. This Terms of Service governs your use of the SkillShape app and the SkillShape.com website (collectively “the Platform” or “SkillShape Platform”), as well as the relation between yourself and SkillShape LLC, Inc. (“SkillShape”). If you do not agree to these Terms, including the Binding Arbitration Clause included below, please discontinue using the Platform.
                    </p>

                    <p>
                        We strongly believe clear, sensible policies are a matter of trust between ourselves and our users. SkillShape will notify our users of material changes—any changes which impact your rights—through the SkillShape app before the change goes into effect. If you have any questions regarding changes, please contact us at help@SkillShape.com. Continued use of the Platform after the changes go into effect constitutes consent to the change.
                    </p>

                    <ContentTiltle>Creating a SkillShape Account</ContentTiltle>
                    <p>
                        In order to use the Platform you must create an account. You agree that you will use the name you are commonly known by to create the account. If you are creating an account on behalf of an Organization that is a business, you agree that you are authorized to create a SkillShape account on behalf of that business. SkillShape recommends you treat all content shared through the Platform as public, and you agree not to share any content you are not otherwise authorized to share publicly.
                    </p>
                    <h2>Admin User Accounts</h2>
                    <p>
                        The user who initially creates an Organization is considered an Administrative User (“Admin”). Admins have the ability to create groups, add members, and view consolidated reports of user activity. Employers acting as Admins in professional settings should not rely on the SkillShape Platform as a substitute for standard attendance, wage calculation, or official communication services. If an Admin abandons an active Organization, you agree that SkillShape, at our discretion and upon verification, may reassign Admin permissions to another user. By maintaining Admin status within an Organization, you agree to abide by this Terms of Service regarding proper User Conduct and agree not to use the app for unauthorized or unlawful purposes. SkillShape is committed to preventing fraud, harassment, or abuse though the Platform, and violation of these Terms may result in account termination.
                    </p>

                    <ContentTiltle>Non-Admin User Accounts</ContentTiltle>
                    <p>
                        Users may be invited to join an Organization by any member of the Organization, based on Organization settings. Non-Admin users may share messages, images, audio, and video with other members of the Organization. You may access multiple organizations through one SkillShape account.
                    </p>

                    <ContentTiltle>Your Content</ContentTiltle>
                    <p>
                        We don’t claim ownership over any content you share through the Platform—it’s just not part of our business model. However, we do need a limited license to make the Platform run as you expect it to. You retain ownership of the rights in the copyrighted content you contribute or post to the Platform. By contributing content and assigning public access to the content via the Platform, you also grant us a royalty-free, non-exclusive, unrestricted, worldwide license to reproduce, distribute, and display your public user content in order to provide the Platform. You agree not to contribute or post content that (i) may create a risk of harm to any other person or company, (ii) may constitute a crime or tort, (iii) is unlawful, (iv) infringes the intellectual property rights of others, (v) is invasive of personal privacy or publicity rights, (vi) constitutes harassment or a threat to others, or (vii) contains information that you do not have a legal right to post under any contractual or fiduciary relationship, including information protected by trade secret laws or non-disclosure agreements. While we will do our best to create a tolerant and productive environment on the SkillShape Platform, you agree that you may see content on the Platform that is offensive, inaccurate, or otherwise objectionable, and that you shall not hold SkillShape in any way responsible for such content. You agree that Your Content may remain available on the Platform even if your employment ends with your current employer, you leave the Organization, or if you delete the App. However, you will be able to delete Your Content, or restrict access to Your Content at anytime while you remain on the Platform.
                    </p>

                    <ContentTiltle>SkillShape's Content</ContentTiltle>
                    <p>
                        Please feel free to tell the world how much you love SkillShape, but don’t steal our design or code.
                    </p>
                    <p>
                        SkillShape grants you a personal, non-sublicensable and non-exclusive license to use the Platform solely in connection with the Service. Any rights not expressly granted herein are reserved.
                    </p>
                    <p>
                        Content we create is protected by copyright, trademark and trade secret laws. Some examples of our content are the text on the site, our logo, and our source code. We grant you a license to use our logo and other copyrights or trademarks to promote your adoption of SkillShape as necessary.
                    </p>
                    <p>
                        You may not otherwise use, reproduce, distribute, perform, publicly display or prepare derivative works of our content unless we give you permission in writing. Please contact help@SkillShape.com if you have any questions.
                    </p>

                    <ContentTiltle>User Conduct</ContentTiltle>
                    <p>
                        Don’t do anything on the app you wouldn’t do at work.
                    </p>
                    <p>
                        You are responsible for all the activity on your account. Inappropriate conduct may lead to account termination. Examples of inappropriate conduct include:
                    </p>
                    <ul>
                        <li>
                            Illegal Activities - Don’t break the law or encourage others to break the law.
                        </li>
                        <li>
                            Abuse - Don’t harass or bully others, or promote violence or hatred towards others.
                        </li>
                        <li>
                            Tracking - Don’t use the Platform to track, monitor, or spy on other users or employees.
                        </li>
                        <li>
                            Personal Information - Don’t distribute others’ personal information or otherwise abuse it.
                        </li>
                        <li>
                            Fraud - Don’t post information that is false or otherwise misleading.
                        </li>
                        <li>
                            Impersonation - Don’t impersonate anyone. Don’t use another’s account, or allow others to use your account.
                        </li>
                        <li>
                            Intellectual Property - Don’t infringe on others’ intellectual property rights.
                        </li>
                        <li>
                            Spam - Don’t spam others or distribute unsolicited advertising material.
                        </li>
                        <li>
                            Reverse Engineering - Don’t take apart SkillShape to figure out our secret sauce.
                        </li>
                    </ul>

                    <ContentTiltle>Privacy</ContentTiltle>
                    <p>
                        We take user privacy seriously. Please see our Privacy Policy for more information.
                    </p>
                    <p>
                        You agree that SkillShape may access, preserve and disclose your account information if required to do so by law or in a good faith belief that such access preservation or disclosure is reasonably necessary to: (i) comply with legal process; (ii) enforce the TOS; (iii) respond to claims that any of Your Data violates the rights of third parties; (iv) respond to your requests for customer service; or (v) protect the rights, property or personal safety of SkillShape, its users and the public..
                    </p>
                    <ContentTiltle>Payment</ContentTiltle>
                    <p>
                        To upgrade your account, you will be required to select a payment plan and provide accurate information regarding your credit card. You agree to promptly update your account information with any changes in your payment information. You agree to pay SkillShape in accordance with the terms set forth in your Invoice and this TOS, and you authorize SkillShape or its third-party payment processors to bill you in advance on a periodic basis in accordance with such terms.
                    </p>
                    <p>
                        You may cancel an upgraded service Subscription at any time. If you dispute any charges you must let us know within 60 days. All amounts paid are non-refundable and we reserve the right to change our prices in the future. If we increase our prices for your Service plan, we will provide notice of the change on the Site and in email to you at least 30 days before the change is to take effect. Your continued use of the Service after the price change goes into effect constitutes your agreement to pay the changed amount. Past due fees are subject to a finance charge of 1.5% per month on any outstanding balance, or the maximum permitted by law, whichever is lower, plus all expenses of collection. You shall be responsible for all taxes associated with Services other than U.S. taxes based on SkillShape’s net income.
                    </p>

                    <ContentTiltle>Account Termination</ContentTiltle>
                    <p>
                        You may delete your account at any time.
                    </p>
                    <p>
                        If an account is inactive for over six (6) months, it may be considered abandoned and all stored content, messages, and associations may be disassociated from your account or otherwise deleted.
                    </p>
                    <p>
                        If SkillShape determines a user has violated these Terms through the use of the Platform, SkillShape may terminate the account at our own discretion.
                    </p>

                    <ContentTiltle>SMS Text Messages</ContentTiltle>
                    <p>
                        We use text messaging as part of our service.
                    </p>
                    <p>
                        SkillShape occasionally sends text messages using the short message service ('SMS') to mobile devices. Our service provider delivers these text messages, which consist of administrative information, such as verification PINs, or invitations to join the SkillShape Platform. To choose to opt out of receiving SMS text messages from SkillShape, a recipient may reply to any SMS text message with the word 'STOP' or may contact SkillShape at help@SkillShape.com. While SkillShape does not charge a fee to receive text messages, standard text messaging rates and other charges from mobile phone carriers may apply. SkillShape does not guarantee that text messages will be sent or will arrive, and you agree that we shall not be liable for any failure for a text message to arrive or any other technical problems related to text message delivery.
                    </p>

                    <ContentTiltle>Indemnity</ContentTiltle>
                    <p>
                        If we get sued because of you, you’ll help pay for the legal defense.
                    </p>
                    <p>
                        You will indemnify us from all losses and liabilities, including legal fees, that arise from these terms or relate to your use of the SkillShape Platform. We reserve the right to exclusive control over the defense of a claim covered by this clause. If we use this right then you will help us in our defense.
                    </p>
                    <p>
                        Your obligation to indemnify under this clause also applies to our affiliates, officers, directors, employees, agents and third party service providers.
                    </p>

                    <ContentTiltle>Warranty Disclaimer</ContentTiltle>
                    <p>
                        Bugs happen. We work hard to fix them. It’s a never-ending cycle, and you accept that.
                    </p>
                    <p>
                        The SkillShape Platform is provided “as is” and without warranty of any kind. Any warranty of merchantability, fitness for a particular purpose, non-infringement, and any other warranty is expressly disclaimed and excluded to the greatest extent permitted by law.
                    </p>
                    <p>
                        The disclaimers of warranty under this clause also apply to our affiliates and third party service providers.
                    </p>

                    <ContentTiltle>Limit of Liability</ContentTiltle>
                    <p>
                        You can’t sue us for everything plus the kitchen sink.
                    </p>
                    <p>
                        To the extent permitted by law, we are not liable to you for any incidental, consequential or punitive damages arising out of these terms, or your use or attempted use of the SkillShape Service. To the extent permitted by law, our liability for damages is limited to the amount of money we have earned through your use of the SkillShape Platform. We are specifically not liable for loss associated with failure to provide accurate reporting of user activity and from losses caused by conflicting contractual agreements.
                    </p>
                    <p>
                        For this clause “we” and “our” is defined to include our affiliates, officers, directors, employees, agents and third party service providers.
                    </p>

                    <ContentTiltle>Dispute Resolution</ContentTiltle>
                    <p>
                        If we have a disagreement, let’s talk about it first. If that doesn’t work, we both agree to go to arbitration instead of court.
                    </p>
                    <p>
                        You agree that any dispute between you and SkillShape arising out of or relating to these Terms of Service, the Privacy Policy or the Platform (collectively, “Disputes”) will be governed by the arbitration procedure outlined below.
                    </p>

                    <ContentTiltle>Governing Law</ContentTiltle>
                    <p>
                        The Terms of Service and the resolution of any Disputes shall be governed by and construed in accordance with the laws of the State of Delaware without regard to its conflict of laws principles.
                    </p>

                    <ContentTiltle>Informal Dispute Resolution</ContentTiltle>
                    <p>
                        We want to address your concerns without needing a formal legal case. Before filing a claim against SkillShape, you agree to try to resolve the Dispute informally by contacting help@SkillShape.com. We'll try to resolve the Dispute informally by contacting you through email. If a Dispute is not resolved within 15 days after submission, you or SkillShape may bring a formal proceeding.
                    </p>

                    <ContentTiltle>We Both Agree to Arbitrate</ContentTiltle>
                    <p>
                        You and SkillShape agree to resolve any Disputes through final and binding arbitration, except as set forth under Exceptions to Agreement to Arbitrate below.
                    </p>

                    <ContentTiltle>Opt-out of Agreement to Arbitrate</ContentTiltle>
                    <p>
                        You can decline this agreement to arbitrate by contacting arbitrationoptout@SkillShape.com within 30 days of first accepting these Terms of Service and stating that you (include your first and last name) decline this arbitration agreement.
                    </p>

                    <ContentTiltle>Arbitration Procedures</ContentTiltle>
                    <p>
                        The American Arbitration Association (AAA) will administer the arbitration under its Commercial Arbitration Rules and the Supplementary Procedures for Consumer Related Disputes. The arbitration will be held in the United States county where you live or work, San Francisco, California, or any other location we agree to.
                    </p>

                    <ContentTiltle>Arbitration Fees</ContentTiltle>
                    <p>
                        The AAA rules will govern payment of all arbitration fees. SkillShape will pay all arbitration fees for claims less than $75,000. SkillShape will not seek its attorneys' fees and costs in arbitration unless the arbitrator determines that your claim is frivolous.
                    </p>

                    <ContentTiltle>Exceptions to Agreement to Arbitrate</ContentTiltle>
                    <p>
                        Either you or SkillShape may assert claims, if they qualify, in small claims court in Delaware (De) or any United States county where you live or work. Either party may bring a lawsuit solely for injunctive relief to stop unauthorized use or abuse of the SkillShape products or Platform, or infringement of intellectual property rights (for example, trademark, trade secret, copyright or patent rights) without first engaging in arbitration or the informal dispute-resolution process described above.
                    </p>

                    <ContentTiltle>No Class Actions</ContentTiltle>
                    <p>
                        You may only resolve Disputes with SkillShape on an individual basis, and may not bring a claim as a plaintiff or a class member in a class, consolidated, or representative action. Class arbitrations, class actions, private attorney general actions, and consolidation with other arbitrations aren't allowed under our agreement.
                    </p>

                    <ContentTiltle>Judicial Forum for Disputes</ContentTiltle>
                    <p>
                        In the event that the agreement to arbitrate is found not to apply to you or your claim, you and SkillShape agree that any judicial proceeding (other than small claims actions) will be brought in the federal or state courts of Delaware. Both you and SkillShape consent to venue and personal jurisdiction there. We both agree to waive our right to a jury trial.
                    </p>

                    <ContentTiltle>Limitations on Claims</ContentTiltle>
                    <p>
                        Regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to your use of the SkillShape Platform must be filed within one (1) year after such claim or cause of action arose, or else that claim or cause of action will be barred forever.
                    </p>

                    <ContentTiltle>Integration Clause</ContentTiltle>
                    <p>
                        This is the entire agreement.
                    </p>
                    <p>
                        These terms and any referenced policies are the entire agreement between you and us, and supersede all prior agreements. If any provision of these terms is held to be unenforceable, that provision is modified to the extent necessary to enforce it. If a provision cannot be modified, it is severed from these terms, and all other provisions remain in force. If either party fails to enforce a right provided by these terms, it does not waive the ability to enforce any rights in the future.
                    </p>

                    <ContentTiltle>Copyright Policy</ContentTiltle>
                    <p>
                        Don’t share stuff through the app that doesn’t belong to you. If you believe that any content on the SkillShape Platform infringes your copyrights, please send written notice to:
                    </p>
                    <p>
                        Copyright Agent
                    </p>
                    <p>
                        SkillShape LLC
                    </p>
                    <p>
                        700 N Valley St. #B52422 Anaheim Ca 92801
                    </p>
                    <p>
                        help@SkillShape.com
                    </p>
                    <br/>
                    <br/>
                    <p>
                        This notice should include the following information:
                    </p>
                    <ul>
                        <li>
                            The electronic or physical signature of the copyright owner, or a person authorized to act on their behalf.
                        </li>
                        <li>
                            A description of the copyrighted work that you claim has been infringed.
                        </li>
                        <li>
                            A description of the exact location on the SkillShape Platform of the content that you claim is infringing. This description must allow us to find and identify the content.
                        </li>
                        <li>
                            Your name, address, telephone number and email address.
                        </li>
                        <li>
                            A statement by you that: a) you believe in good faith that the use of the content that you claim to infringe your copyright is not authorized by law, the copyright owner, or the owner’s agent, b) all information contained in your copyright notice is accurate, and c) under penalty of perjury, you are either the copyright owner, or authorized to act on their behalf.
                            <br/>
                            If your content has been removed because of a DMCA notice, but you believe the content was not infringing on another’s copyrights, then you may send a written counter-notice to have the content restored. Your counter-notice should include the following information:
                        </li>
                        <li>
                            Your electronic or physical signature.
                        </li>
                        <li>
                            A description of the content that was removed and the exact location of the content on SkillShape before it was removed.
                        </li>
                        <li>
                            A statement under penalty of perjury that you believe in good faith that the content was removed by mistake or misidentification.
                        </li>
                        <li>
                            A statement that you consent to the jurisdiction of the U.S. Federal District Court for the judicial district in which you are located, or if you are outside the U.S., the Northern District of California, and that you will accept service of process from the party that originally sent us the DMCA notice.
                        </li>
                    </ul>
                    <p>
                        In appropriate circumstances we may terminate the accounts of repeat infringers.
                    </p>
                    <ContentTiltle>Questions?</ContentTiltle>
                    <p>
                        If you have any questions, please email help@SkillShape.com.
                    </p>
                </Typography>
            </DialogContent>

            <DialogActions classes={{root: props.classes.dialogAction}}>
                <Button color="primary" onClick={props.onDisAgreeButtonClick} itemScope itemType="http://schema.org/disAgreeAction"> Cancel</Button>
                <Button color="primary" onClick={props.onAgreeButtonClick} itemScope itemType="http://schema.org/AgreeAction"> I agree</Button>
            </DialogActions>
        </MuiThemeProvider>
    </Dialog>
);

TermsOfServiceDetailDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
}

export default withStyles(styles)(TermsOfServiceDetailDialogBox);