import React, { Fragment } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import Grid from 'material-ui/Grid';
import isNumber from 'lodash/isNumber';
import Pagination from '/imports/ui/componentHelpers/pagination';
import { TableRow, TableCell } from 'material-ui/Table';

import { ContainerLoader } from '/imports/ui/loading/container';
import { UsersDetailsTable } from './UsersDetailsTable';
import { getUserFullName, dateFriendly } from '/imports/util';

const TotalUsersCount = styled.div`
	width: 90%;
	font-size: 20px;
	margin: auto;
`;

const style = {
    'w211': {
        width: 211
    },
    'w100': {
        width: 100
    },
    'w150': {
        width: 150
    }
};

class UsersList extends React.Component {

	state = {
		isBusy: true,
		perPage: 10,
		usersData: [],
		usersCount: 0,
		errorText: null,
		pageCount: 0
	}

	componentWillMount() {
		Meteor.call("user.getAllUsersCount", {}, (err,res) => {
			if(res) {
				this.getUsers({ limit: this.state.perPage, skip:0 , usersCount: res.usersCount })
			}

			if(err) {
				this.setState({ errorText: err.reason || err.message })
			}
		})
	}

	getUsers = ({ limit, skip, usersCount }) => {
		Meteor.call("user.getUsers", {limit, skip}, (err,res) => {
			const stateObj = {isBusy: false}
			if(err) {
				stateObj.errorText = err.reason || err.message;
			}

			if(res) {
				if(isNumber(usersCount)) {
					stateObj.usersCount = usersCount;
					stateObj.pageCount = this.totalPageCount(usersCount);
				}
				stateObj.usersData = res.usersData;
			}

			this.setState(stateObj)
		})
	}

	handlePageClick = ({skip}) => {
	    console.log("skip -->>",skip)
		this.setState({isBusy: true})
		this.getUsers({ limit: this.state.perPage, skip:skip })
  	}


	totalPageCount = (usersCount) => {
		if(usersCount) {
			return Math.ceil(usersCount/this.state.perPage)
		}
		return 0
	}

	render() {
		const { isBusy, usersData, pageCount, usersCount } = this.state;
		return (
			<Fragment>
				<TotalUsersCount>
					Total Users: <strong>{usersCount}</strong>
				</TotalUsersCount>
				<div style={{overflowX: "auto"}}>
					<UsersDetailsTable>
						{
							isEmpty(usersData) ? "No user found" : (
								usersData.map((user) => {
									return <TableRow key={user._id} selectable={false}>
				                        <TableCell style={style.w150}>{getUserFullName(user) || "Unavailable"}</TableCell>
				                        <TableCell style={style.w211}>{user.emails[0].address || "Unavailable"}</TableCell>
				                        <TableCell style={style.w150}>{(user.createdAt && dateFriendly(user.createdAt, "MM/DD/YYYY")) || "Unavailable"}</TableCell>
				                        <TableCell style={style.w100}>{(user.roles && user.roles.join(", ")) || "Not Assigned Yet"}</TableCell>
				                    </TableRow>
								})
							)
						}
					</UsersDetailsTable>
				</div>
				<Pagination
					{...this.state}
					pageCount={pageCount}
					onChange={this.handlePageClick}
				/>
			</Fragment>
		)
	}
}

export default UsersList