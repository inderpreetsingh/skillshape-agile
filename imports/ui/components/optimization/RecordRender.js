import React, { Fragment } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';

const Center = styled.div`
  text-align: center;
  height: 385px;
  overflow: hidden;
  border: 3px solid #4caf50;
  border-radius: 15px;
  margin-top: 30px;
`;

export default class RecordRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, name } = this.props;
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
              {({ width }) => (
                <Table
                  width={width}
                  height={385}
                  headerHeight={20}
                  rowHeight={30}
                  rowCount={data.length}
                  rowGetter={({ index }) => data[index]}
                >
                  <Column
                    width={(width * 10) / 100}
                    label="Index"
                    dataKey="url"
                    cellRenderer={data => data.rowIndex + 1}
                  />
                  <Column label={name} dataKey="name" width={(width * 50) / 100} />
                  <Column width={(width * 20) / 100} label="Status" dataKey="status" />
                  <Column
                    width={(width * 20) / 100}
                    label="Image Link"
                    dataKey="url"
                    cellRenderer={data => (
                      <a href={data.cellData} target="_blank">
                        Image Link
                      </a>
                    )}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </Center>
      </Fragment>
    );
  }
}
