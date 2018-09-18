import React,{Fragment} from "react";
import styled from "styled-components";
import { ClassTypeTableRender } from "./classTypeTableRender";
import {SchoolTableRender} from './schoolTableRender';
import { TableRow, TableCell } from "material-ui/Table";
import { Column, Table ,AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; 
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
  height: 385px;
  overflow: hidden;
  border: 3px solid #4caf50;
  border-radius: 15px;
  margin-top:30px;
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
    },
    w64:{
      width: 64
    },
    w121:{
      width:121
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
    return (
      <Fragment>
       <Center>
       
       {/* <TableName>
          {!_.isEmpty(data)&&
             data.map((current,index) => {
                return (
                  <TableRow key={current._id} selectable={false}>
                   <TableCell style={{width:'64px'}}>
                    {index+1}
                    </TableCell>
                    <TableCell style={style.w150}>
                    <Wrapper>  {current.name}</Wrapper>
                    </TableCell>
                    <TableCell style={style.w211}>
                    <Wrapper>   {current.status}</Wrapper>
                    </TableCell>
                    <TableCell style={style.w121}>
                    <Wrapper> <a href={current.url} target="_blank">Image Link</a></Wrapper>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableName> */}
          <div>
          <AutoSizer disableHeight>
            {({width}) => {
              return <Table
    width={width}        
    height={385}
    headerHeight={20}
    rowHeight={30}
    rowCount={data.length}
    rowGetter={({ index }) => data[index]}
  >
     <Column
       width={(width*10)/100} 
      label='Index'
      dataKey='url'
      cellRenderer={(data)=>{
       return data.rowIndex+1;
      }}
    />
    <Column
      label={name}
      dataKey='name'
      width={(width*50)/100} 
    />
    <Column
      width={(width*20)/100} 
      label='Status'
      dataKey='status'
    />
     <Column
       width={(width*20)/100} 
      label='Image Link'
      dataKey='url'
      cellRenderer={(data)=>{
       return <a href={data.cellData} target="_blank">Image Link</a>
      }}
    />
  </Table>} }
          
          </AutoSizer>
        </div>
       
       </Center>
        </Fragment>
    );
  }
}
