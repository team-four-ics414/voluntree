import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, CloudDownload, PersonFill, PersonPlusFill, CardChecklist } from 'react-bootstrap-icons';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import Mailbox from './MailBox';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar className="lightgreen-background" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/"><Image src="/images/voluntree-logo.png" width="100px" /></Navbar.Brand>
        <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
        <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
          <Nav className="mx-auto">
            {currentUser ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_DEVELOPMENT} as={NavLink} to="/development" key="development">Development</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_USER_PROFILE} as={NavLink} to="/userprofilepage" key="userprofilepage">My Dashboard</Nav.Link>,

              <Nav.Link id={COMPONENT_IDS.NAVBAR_VOLUNTEER_FORUM} as={NavLink} to="/forum" key="volunteer-forum">Forum</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
              [
                <Nav.Link id={COMPONENT_IDS.NAVBAR_USERS_PROFILE} as={NavLink} to="/usersprofile" key="usersprofile">Users Profiles</Nav.Link>,
                // <Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_NONPROFIT_ADMIN} as={NavLink} to="/nonprofits-admin" key="admin-nonprofits">List Nonprofits (Admin)</Nav.Link>,
                <NavDropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} title="Manage" key="manage-dropdown">
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} to="/manage-database"><CloudDownload />Database</NavDropdown.Item>
                </NavDropdown>,
              ]
            ) : ''}
            <Nav.Link id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/" key="landing">Home</Nav.Link>
            <NavDropdown id={COMPONENT_IDS.NAVBAR_FIND_DROPDOWN} title="Find">
              <Nav.Link as={NavLink} to="/activity" key="activity">Activity</Nav.Link>
              <Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_NONPROFIT} as={NavLink} to="/nonprofits" key="list-nonprofit">Nonprofits</Nav.Link>
              <Nav.Link id="map-page" as={NavLink} to="/mapsearch" key="map-activity">Map Search</Nav.Link>
              <Nav.Link id="opportunities-page" as={NavLink} to="/opportunities" key="list">Opportunities</Nav.Link>
              <Nav.Link id="organizationslanding-page" as={NavLink} to="/organizations" key="list">Organizations</Nav.Link>
            </NavDropdown>
            <Nav.Link id="faq" as={NavLink} to="/faq" key="faq">FAQ</Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login">
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin"><PersonFill />Sign in</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/signup"><PersonPlusFill />Sign up</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser}>
                <NavDropdown.Item as={NavLink} to="/volunteerlist"><CardChecklist /> Activity</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} as={NavLink} to="/signout"><BoxArrowRight /> Sign out</NavDropdown.Item>
              </NavDropdown>
            )}
            <Mailbox />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
