import React,{Fragment} from "react";
import styled from "styled-components";
import { ClassTypeTableRender } from "./classTypeTableRender";
import {SchoolTableRender} from './schoolTableRender';
import { TableRow, TableCell } from "material-ui/Table";
const Head = styled.div`
  margin: 5px;
  font-size: larger;
  display: inline-block;
  border: 3px solid #4caf50;
  border-radius: 15px;
  font-weight: 400;
  padding: 4px;
  background-color: aliceblue;
`;
const Center = styled.div`
  text-align: center;
`;
const Wrapper =styled.div`
margin: 5px;
font-size: larger;
font-weight: 400;
`;
const style = {
    w211: {
      width: 211
    },
    w100: {
      width: 100
    },
    w150: {
      width: 150
    }
  };
export default class RecordRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }
  
  render() {
    const {data,name} =this.props;
    debugger;
    let TableName= name =='classType' ? ClassTypeTableRender:SchoolTableRender;
    return (
      <Fragment>
       <Center>
       
       <TableName>
          {!_.isEmpty(data)&&
             data.map(current => {
                return (
                  <TableRow key={current._id} selectable={false}>
                    <TableCell style={style.w150}>
                     {current.name}
                    </TableCell>
                    <TableCell style={style.w211}>
                      {current.status}
                    </TableCell>
                    <TableCell style={style.w211}>
                    <a href={current.url}>Image Link</a>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableName>
         
         
       </Center>
        </Fragment>
    );
  }
}
