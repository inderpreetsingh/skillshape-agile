import React from 'react';
import styled from 'styled-components';
import { get, isEmpty } from 'lodash';
import ProgressiveImage from 'react-progressive-image';

import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

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
    padding-top: 50px;
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
    }
`;

const MemberWrapper = styled.div`
    max-width: ${props => props.cardsView === 'list' ? 'none' : MEMBER_CARD}px;
    margin-bottom: ${props => props.cardsView === 'list' ? MEMBER_CARD_MARGIN : MEMBER_CARD_MARGIN * 3}px;
    margin-right: ${MEMBER_CARD_MARGIN}px;
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
    ${props => props.cardsView !== 'list' && 'transform: translateY(-50%);'}
    top: 0;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-image: url('${props => props.src}');
    transition: background-image 1s linear;
`;

const MemberProfileText = SubHeading.extend`
    text-align: center;
    font-size: 20px;
`;

const getNormalizedMembersData = (props) => {
    const { view, membersByName, handleMemberDetailsToRightPanel, superAdminId } = props;
    const normalizedData = [];
    const cardsView = props.listView ? 'list' : 'grid';
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
                            pic = config.defaultProfilePic;
                        }
                    });

                    normalizedData.push(
                        <MemberWrapper key={data._id} cardsView={cardsView} onClick={() => handleMemberDetailsToRightPanel(data._id, superAdminId)}>
                            <Member cardsView={cardsView}>
                                <ProgressiveImage src={pic} placeholder={config.blurImage}>
                                    {src => <MemberProfile cardsView={cardsView} src={src} />}
                                </ProgressiveImage>
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

    const { src, collectionData, view, handleMemberDetailsToRightPanel, isAdmin, superAdminId } = props;
    const membersByName = sortByView(view, collectionData);
    const schoolMembersProps = { ...props, membersByName };
    const membersData = getNormalizedMembersData(schoolMembersProps);
    // console.info(membersData, ".........")
    return (<MembersGridWrapper>
        <MembersGrid>
            {membersData}
        </MembersGrid>
    </MembersGridWrapper>)
};

export default SchoolMembersScreen;