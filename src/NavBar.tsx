/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.css';

interface NavBarProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

const UserAvatar = ({ user }: any) => (
  (user.avatar && (
    <img
      src={user.avatar}
      alt="user"
      className="rounded-circle align-self-center mr-2"
      style={{ width: '32px' }}
    />
  )) || (
    <i
      className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
      style={{ width: '32px' }}
    />
  )
);

const AuthNavItem = ({
  isAuthenticated,
  user,
  authButtonMethod,
}: NavBarProps) => (isAuthenticated && (
  <>
    <UncontrolledDropdown>
      <DropdownToggle nav caret>
        <UserAvatar user={user} />
      </DropdownToggle>
      <DropdownMenu right>
        <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
        <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
        <DropdownItem divider />
        <DropdownItem onClick={authButtonMethod}>Sign Out</DropdownItem>
      </DropdownMenu>
      <DropdownMenu right>
        <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
        <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
        <DropdownItem divider />
        <DropdownItem onClick={authButtonMethod}>Authorize me</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </>
))
  || (
    <NavItem>
      <Button
        onClick={authButtonMethod}
        className="btn-link nav-link border-0"
        color="link"
      >
        Sign In
      </Button>
    </NavItem>
  );

const NavBar = ({ isAuthenticated, authButtonMethod, user }: NavBarProps) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div>
      <Navbar color="dark" dark expand="md" fixed="top">
        <Container>
          <NavbarBrand href="/">Logs of visits</NavbarBrand>
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
              </NavItem>
              {isAuthenticated && (
                <NavItem>
                  <RouterNavLink to="/calendar" className="nav-link" exact>Calendar</RouterNavLink>
                </NavItem>
              )}
            </Nav>
            <Nav className="justify-content-end" navbar>
              <NavItem>
                <NavLink href="https://developer.microsoft.com/graph/docs/concepts/overview" target="_blank">
                  <i className="fas fa-external-link-alt mr-1" />
                  {' '}
                  Docs
                </NavLink>
              </NavItem>
              <AuthNavItem
                isAuthenticated={isAuthenticated}
                authButtonMethod={authButtonMethod}
                user={user}
              />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
