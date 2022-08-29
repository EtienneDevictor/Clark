import React, { Component } from 'react';
import './Overview.css';
import OverviewProfile from './OverviewProfile.js';
import { getAllUsers, deleteUserByEmail } from '../../APIFunctions/User';
import { getCountAllUsers, getCurrentUsers} from '../../APIFunctions/User';
import { getUserData } from '../../APIFunctions/User';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Table
} from 'reactstrap';
import { membershipState } from '../../Enums';
import Header from '../../Components/Header/Header';
import { useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';
import PageNumbers from './PageNumbers.js';

export default class OverviewBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      queryResult: [],
      filterToggle: false,
      sortToggle: false,
      filterTypes: ['All', 'Pending', 'Officer', 'Admin', 'Alumni'],
      currentFilter: 'All',
      sortTypes: ['Join Date', 'First Name', 'Last Name', 'Membership'],
      currentSort: 'Join Date',
      search: '',
      count: 0,
      usersPerPage: 5,
      page: 1,
      query: ''
    };
    this.headerProps = {
      title: 'User Manager'
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState(
        {
          authToken: this.props.user.token,
          currentUser: this.props.user.email,
          currentUserLevel: this.props.user.accessLevel
        },
        () => {
          this.setData();
        }
      );
    }
  }

  componentDidUpdate(prev) {
    if (this.props.history.location.search !== prev.location.search) {
      this.setData();
    }
  }

  setURL() {
    this.props.history.push(`?page=${this.state.page}&` +
      `usersPerPage=${this.state.usersPerPage}&search=${this.state.search}` +
      `&filter=${this.state.currentFilter}&sort=${this.state.currentSort}`,
    {state: 'sample data'});
  }

  parseQuery() {
    console.log(this.props.history);
    let params = queryString.parse(this.props.history.location.search);
    return params;
  }

  async setData() {
    // setting query
    const params = this.parseQuery();
    const page = params.page ? params.page : this.state.page;
    const usersPerPage = params.usersPerPage ?
      params.usersPerPage : this.state.usersPerPage;
    const search = params.search ? params.search : this.state.search;
    const filter = params.filter ? params.filter : this.state.currentFilter;
    const sort = params.sort ? params.sort : this.state.currentSort;
    this.state.query = `?page=${page}&usersPerPage=${usersPerPage}&` +
      `search=${search}&filter=${filter}&sort=${sort}`;

    // setting Users To Display and User Count
    const apiResponse = await getUserData(
      this.state.query, this.state.authToken);

    this.state.count = apiResponse.responseData.count;

    if (!apiResponse.error) this.setState(
      { users: apiResponse.responseData.users });
  }

  // async callDatabase() {
  //   const apiResponse = await getAllUsers(this.state.authToken);
  //   this.setQuery();

  //   this.setUsersAndCount();
  // }

  updateUserState(users) {
    this.setState({ users });
  }

  async updateQuery(value) {
    // taking care of empty values
    // value = typeof value === 'undefined' ? '' : value;
    // value = value.trim().toLowerCase();

    this.state.search = value;
    this.state.page = 1;
    this.setURL();
    this.setData();

    // const userExists = user => {
    //   return (
    //     user.firstName.toLowerCase().includes(value) ||
    //     user.lastName.toLowerCase().includes(value) ||
    //     user.email.toLowerCase().includes(value)
    //   );
    // };

    // const { currentFilter } = this.state;
    // constfilteredUsersByLevel=this.filterUserByAccessLevel(currentFilter);
    // const searchResult=filteredUsersByLevel.filter(data => userExists(data));
    // const queryResult = searchResult.length
    //   ? searchResult
    //   : filteredUsersByLevel;

    // this.setState({ queryResult });
  }

  paginate(newPage) {
    this.state.page = newPage;
    this.setURL();
    this.setData();
  }

  async filterUserByAccessLevel(accessLevel) {
    // switch (accessLevel) {
    // case 'Officer':
    //   return this.state.users.filter(
    //     data => data.accessLevel === membershipState.OFFICER
    //   );
    // case 'Admin':
    //   return this.state.users.filter(
    //     data => data.accessLevel === membershipState.ADMIN
    //   );
    // case 'Pending':
    //   return this.state.users.filter(
    //     data => data.accessLevel === membershipState.PENDING
    //   );
    // case 'Alumni':
    //   return this.state.users.filter(
    //     data => data.accessLevel === membershipState.ALUMNI
    //   );
    // default:
    //   return this.state.users;
    // }
    this.state.currentFilter = accessLevel;
    this.state.page = 1;
    this.setURL();
    this.setData();
  }

  async sortByType(type) {
    this.state.currentSort = type;
    this.state.page = 1;
    this.setURL();
    this.setData();
  }

  handleFilterToggle() {
    this.setState({ filterToggle: !this.state.filterToggle });
  }

  handleSortToggle() {
    this.setState({ sortToggle: !this.state.sortToggle });
  }

  /*
  Delete api
  parameter: Json object of object to be deleted
  */
  async deleteUser(user) {
    const deleteEmailResponse = await deleteUserByEmail(
      user.email,
      this.state.authToken
    );
    if (!deleteEmailResponse.error) {
      if (user.email === this.state.currentUser) {
        // logout
        window.localStorage.removeItem('jwtToken');
        window.location.reload();
        return window.alert('Self-deprecation is an art');
      }
      this.setData();
      // this.setState({
      //   users: this.state.users.filter(
      //     child => !child.email.includes(user.email)
      //   )
      // });
      // this.setState({
      //   queryResult: this.state.queryResult.filter(
      //     child => !child.email.includes(user.email)
      //   )
      // });
    }
  }

  render() {
    return (
      <div className='flexbox-container-user'>
        <Header title={this.headerProps.title} />
        <form>
          <Link to="/email-list">
            <Button outline id="view-email-button">View Emails</Button>
          </Link>
          <label className='search-row'>
            <input
              className='input-overview'
              placeholder="search by 'first name, last name, or email'"
              onChange={event => {
                this.updateQuery(event.target.value);
              }}
            />
          </label>
          <br />
          <div className='toolbar'>
            <ButtonDropdown
              isOpen={this.state.filterToggle}
              toggle={() => {
                this.handleFilterToggle();
              }}
              className='user-dropdown'
            >
              <DropdownToggle color='' caret>
                Filter by: {
                  this.parseQuery().filter ?
                    this.parseQuery().filter : this.state.currentFilter
                }</DropdownToggle>
              <DropdownMenu>
                {this.state.filterTypes.map((type, ind) => (
                  <DropdownItem
                    key={ind}
                    onClick={() => {
                      this.filterUserByAccessLevel(type);
                    }
                      // this.setState({ currentFilter: type }, () =>
                      //   this.updateQuery('#InvalidSearch#')
                      // )
                    }
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
            <ButtonDropdown
              isOpen={this.state.sortToggle}
              toggle={() => {
                this.handleSortToggle();
              }}
              className='user-dropdown'
            >
              <DropdownToggle color='' caret>
                Sort by: {
                  this.parseQuery().sort ?
                    this.parseQuery().sort : this.state.currentSort
                }</DropdownToggle>
              <DropdownMenu>
                {this.state.sortTypes.map((type, ind) => (
                  <DropdownItem
                    key={ind}
                    onClick={() => {
                      this.sortByType(type);
                    }
                      // this.setState({ currentFilter: type }, () =>
                      //   this.updateQuery('#InvalidSearch#')
                      // )
                    }
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          </div>
        </form>
        <div id='user-manager-table'>
          <Table dark>
            <thead>
              <tr id='users-header'>
                {[
                  'Name',
                  'Door Code',
                  'Printing',
                  'Email Verified',
                  'Membership Type',
                  '',
                  ''
                ].map((ele, ind) => {
                  return <th key={ind}>{ele}</th>;
                })}
              </tr>
            </thead>

            <tbody id='users-body'>
              {
              // this.state.queryResult.length > 0
              //   ? this.state.queryResult.map((user, index) => {
              //     return (
              //       <OverviewProfile
              //         key={index}
              //         users={this.state.users}
              //         user={user}
              //         index={index}
              //         token={this.state.authToken}
              //         deleteUser={this.deleteUser.bind(this)}
              //         // updateQuery={() => {
              //         //   this.setState(
              //         //     { currentFilter: 'All', queryResult: [] },
              //         //     // this.updateQuery('')
              //         //   );
              //         // }}
              //         updateUserState={this.updateUserState}
              //         className='user-row'
              //       />
              //     );
              //   })
              //   :
                this.state.users.map((user, index) => {
                  return (
                    <OverviewProfile
                      key={index}
                      users={this.state.users}
                      user={user}
                      index={index}
                      token={this.state.authToken}
                      deleteUser={this.deleteUser.bind(this)}
                      // updateQuery={() => {
                      //   this.setState(
                      //     { currentFilter: 'All', queryResult: [] },
                      //     // this.updateQuery('')
                      //   );
                      // }}
                      updateUserState={this.updateUserState.bind(this)}
                    />
                  );
                })}
            </tbody>
          </Table>
        </div>
        <PageNumbers
          count={this.state.count}
          parseQuery={() => this.parseQuery()}
          usersPerPage={this.state.usersPerPage}
          paginate={(newPage) => this.paginate(newPage)}
        />
      </div>
    );
  }
}
