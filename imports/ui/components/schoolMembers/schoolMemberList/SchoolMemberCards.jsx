import React from 'react';
import styled from 'styled-components';
import { get, isEmpty } from 'lodash';

import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import UploadAvatar from '/imports/ui/components/schoolMembers/mediaDetails/UploadAvatar.js';

import ProfileImage from '/imports/ui/components/landing/components/helpers/ProfileImage.jsx';
import { verifyImageURL } from '/imports/util';
import { sortByView } from './helpers.js';
import { flexCenter, tablet, mobile, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import { SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

const MEMBER_CARD = 250;
const MEMBER_CARD_MARGIN = rhythmDiv * 2;
const MEMBERS_GRID_LW = MEMBER_CARD * 3 + MEMBER_CARD_MARGIN * 3;
const MEMBERS_GRID_MW = MEMBER_CARD * 2 + MEMBER_CARD_MARGIN * 2;
const MEMBERS_GRID_SW = MEMBER_CARD + MEMBER_CARD_MARGIN;

const MembersGridWrapper = styled.div`
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    ${flexCenter}
`;

const MembersGrid = styled.div`
    ${flexCenter}
    width: 100%;
    flex-wrap: wrap;
    max-width: ${MEMBERS_GRID_LW}px;

    @media screen and (max-width: ${MEMBERS_GRID_LW}px) {
        max-width: ${MEMBERS_GRID_MW}px;
    }

    @media screen and (max-width: ${MEMBERS_GRID_MW}px) {
        max-width: ${MEMBERS_GRID_SW}px;
        ${props => props.cardsView === 'list' && 'max-width: 100%;'}
    }
`;

const MemberWrapper = styled.div`
    max-width: ${props => props.cardsView === 'list' ? 'none' : MEMBER_CARD}px;
    margin-bottom: ${props => props.cardsView === 'list' ? rhythmDiv : MEMBER_CARD_MARGIN * 3}px;
    margin-right: ${props => props.cardsView === 'list' ? 0 : MEMBER_CARD_MARGIN}px;
    width: 100%;
    cursor: pointer;
`;

const Member = styled.div`
    width: 100%;
    height: 100px;
    padding: ${rhythmDiv}px;
    position: relative;
    display: flex;
    flex-direction: ${props => props.cardsView === 'list' ? 'row' : 'column'};
    justify-content: ${props => props.cardsView === 'list' ? 'flex-start' : 'flex-end'};
    align-items: center;
    background: white;
    word-break: break-all;
`;

const MemberProfile = styled.div`
    position: ${props => props.cardsView === 'list' ? 'static' : 'absolute'};
    margin-right: ${props => props.cardsView === 'list' ? rhythmDiv : 0}px;
    ${props => props.cardsView !== 'list' && 'transform: translateY(-50%);'}
    top: 0;
`;

const MemberProfileText = SubHeading.extend`
    text-align: center;
    font-size: 20px;
`;

const getNormalizedMembersData = (props) => {
    const { view, membersByName, cardsView, handleMemberDetailsToRightPanel, superAdminId } = props;
    const normalizedData = [];
    if (!isEmpty(membersByName)) {
        Object.keys(membersByName).sort().forEach(key => {
            //console.info(membersByName[key], key, "................");
            if (!isEmpty(membersByName[key])) {
                membersByName[key].forEach(data => {
                    let profile, pic, firstName, emails;
                    if (view == 'classmates') {
                        profile = data.profile.profile;
                    } else {
                        profile = data.profile;
                    }
                    emails = get(data.profile, "emails", []);
                    pic = profile && profile.low ? profile.low : profile && profile.medium ? profile.medium : profile && profile.pic ? profile.pic : config.defaultProfilePicOptimized;
                    firstName = get(profile, 'firstName', get(profile, 'name', get(emails[0], 'address', 'Old Data')));
                    // if (get(data, '_id', null) == superAdminId) {
                    //     firstName = `${firstName} (SuperAdmin)`;
                    // }
                    verifyImageURL(pic, res => {
                        if (!res) {
                            pic = config.defaultProfilePicOptimized;
                        }
                    });

                    // console.info(pic, ">>>>>>>>Pic");

                    normalizedData.push(
                        <MemberWrapper key={data._id} cardsView={cardsView} onClick={() => handleMemberDetailsToRightPanel(data._id, superAdminId)}>
                            <Member cardsView={cardsView}>
                                <MemberProfile cardsView={cardsView}>
                                    <ProfileImage
                                        imageContainerProps={{
                                            borderRadius: '50%',
                                            bgSize: 'cover',
                                            width: 75,
                                            height: 75,
                                            noMarginRight: true,
                                            noMarginBottom: true
                                        }}
                                        src={pic}
                                    />
                                </MemberProfile>
                                <MemberProfileText> {firstName} </MemberProfileText>
                            </Member>
                        </MemberWrapper>
                    );
                });
            }
        });
    }
    return normalizedData;
}

const SchoolMembersScreen = props => {
    const { src, listView, collectionData, view, handleMemberDetailsToRightPanel, isAdmin, superAdminId } = props;
    const membersByName = sortByView(view, collectionData);
    const schoolMembersProps = { ...props, membersByName };
    const membersData = getNormalizedMembersData(schoolMembersProps);
    const cardsView = props.listView ? 'list' : 'grid';



    // console.info(membersData, ".........")
    return (<MembersGridWrapper>
        <MembersGrid cardsView={cardsView}>
            {membersData}
        </MembersGrid>
    </MembersGridWrapper>)
};

export default SchoolMembersScreen;