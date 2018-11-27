import React from "react";
import styled from "styled-components";
import Member from "./Member.jsx";
import MemberExpanded from "./MemberExpanded.jsx";
import SearchList from "./SearchList.jsx";
import { mobile, rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";
import { Capitalize, SlantedHeading, Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { get, isEmpty } from 'lodash';

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 7}px;
`;

const ListHeading = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MembersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${props => props.expanded && `flex-direction: column`};

  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MemberWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 4px;

  @media screen and (min-width: ${mobile - 50}px) {
    max-width: auto;
    width: auto;
    ${props =>
        props.expanded
            ? `max-width: 500px;
          width: 100%;`
            : ""};
  }
`;

const Title = SlantedHeading.extend`
  display: flex;
  // margin-left:33%;
  margin-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${mobile - 50}px) {
    margin-bottom: 0;
  }
`;

const MembersList = props => {
    const expanded =
        props.viewType === "instructorsView" && props.entityType === "students";
    const type = props.entityType === 'students' ? 'student' : 'instructor';

    return (
        <Wrapper>
            <ListHeading>
                <Title>
                    <Capitalize>{props.entityType}&nbsp;</Capitalize> in class
        </Title>
                {/* <SearchList
          onChange={props.onSearchChange}
          searchedValue={props.searchedValue}
        /> */}
            </ListHeading>
            <MembersGrid expanded={expanded}>
                {!isEmpty(props.data) &&
                    props.data.map(obj => (
                        <MemberWrapper expanded={expanded} type={obj.type}>
                            {expanded ? (
                                <MemberExpanded
                                    viewType={props.viewType}
                                    {...obj}
                                    type={type}
                                    popUp={props.popUp}
                                    classData={props.classData}
                                    classTimeForm={props.classTimeForm}
                                    instructorsIdsSetter={props.instructorsIdsSetter}
                                    instructorsData={props.instructorsData}
                                    instructorsIds={props.instructorsIds}
                                />
                            ) : (
                                    <Member
                                        viewType={props.viewType}
                                        {...obj}
                                        type={type}
                                        designation={'instructor'}
                                        popUp={props.popUp}
                                        classData={props.classData}
                                        classTimeForm={props.classTimeForm}
                                        instructorsIdsSetter={props.instructorsIdsSetter}
                                        instructorsData={props.instructorsData}
                                        instructorsIds={props.instructorsIds}

                                    />
                                )}
                        </MemberWrapper>
                    ))}
                        <MemberWrapper expanded={expanded} type={"instructor"}>
                            <Member
                                addInstructor = {props.addInstructor}
                                addStudent = {props.addStudent}
                                onAddIconClick={props.onAddIconClick}
                                type="instructor"
                                popUp={props.popUp}
                                classData={props.classData}
                                classTimeForm={props.classTimeForm}
                                instructorsIdsSetter={props.instructorsIdsSetter}
                                instructorsData={props.instructorsData}
                                instructorsIds={props.instructorsIds}

                            />
                        </MemberWrapper>
            </MembersGrid>
        </Wrapper>
    );
};

export default MembersList;
