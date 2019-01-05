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

const ListHeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${rhythmDiv}px;
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
    let studentsView = props.viewType === "studentsView" && props.entityType === "students";
    let joinClass = studentsView;
    !isEmpty(props.data) && studentsView && props.data.map((obj)=>{
        if(obj._id == Meteor.userId()){
            joinClass = false;
        }
    })
    console.count("​MembersList 4")
    return (
        <Wrapper>
                {/* <SearchList
          onChange={props.onSearchChange}
          searchedValue={props.searchedValue}
        /> */}
             {props.viewType === "instructorsView" || !isEmpty(props.data) || props.entityType === 'students' ? ( <ListHeadWrapper>
                <Title>
                  <Capitalize>{props.entityType}&nbsp;</Capitalize> in class
                </Title>
            </ListHeadWrapper>) : ''} 
           
            <MembersGrid expanded={expanded}>
            {joinClass &&   <MemberWrapper >
                    <Member
                        addMember={true}
                        onAddIconClick={props.onJoinClassClick}
                        type={'joinClass'}
                        popUp={props.popUp}
                        classData={props.classData}
                        classTimeForm={props.classTimeForm}
                        instructorsIdsSetter={props.instructorsIdsSetter}
                        instructorsData={props.instructorsData}
                        instructorsIds={props.instructorsIds}

                    />
                </MemberWrapper>}
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
                                    onViewStudentClick={props.onViewStudentClick}
                                    params={props.params}
                                    schoolName={props.schoolName}
                                    classTypeName={props.classTypeName}
                                    toggleIsBusy={props.toggleIsBusy}
                                    schoolId = {props.schoolId}
                                    onAddIconClick={props.onJoinClassClick}
                                    onAcceptPaymentClick={props.onAcceptPaymentClick}
                                    buyPackagesBoxState ={props.buyPackagesBoxState}
                                    currentProps = {props.currentProps}
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
                    {props.viewType != "studentsView" &&   <MemberWrapper expanded={expanded}>
                    <Member
                        addMember={props.addInstructor || props.addStudent}
                        onAddIconClick={props.onAddIconClick}
                        type={type}
                        popUp={props.popUp}
                        classData={props.classData}
                        classTimeForm={props.classTimeForm}
                        instructorsIdsSetter={props.instructorsIdsSetter}
                        instructorsData={props.instructorsData}
                        instructorsIds={props.instructorsIds}

                    />
                </MemberWrapper>}
              
              
            </MembersGrid>
        </Wrapper>
    );
};

export default MembersList;
