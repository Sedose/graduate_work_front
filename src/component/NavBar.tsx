import React, { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, Redirect } from 'react-router-dom';
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
  login: any;
  logout: any;
  appLogin: any;
  user: {
    appRole: string;
    displayName: string;
    email: string;
  };
}

const UserAvatar = ({ user }: any) => (user.avatar && (
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
);

const AuthNavItem = ({
  isAuthenticated,
  user,
  login,
  logout,
  appLogin,
}: NavBarProps) => {
  const [mainPageLink, setMainPageLink] = useState('');

  useEffect(() => {
    const { appRole } = user;
    const selectedPageLink = appRole === 'STUDENT'
      ? 'student-main-page'
      : appRole === 'LECTURER'
        ? 'lecturer-main-page'
        : appRole === 'TRAINING_REPRESENTATIVE'
          ? 'training-representative-main-page'
          : '/';
    setMainPageLink(selectedPageLink);
  });

  return (
    (
      mainPageLink !== '/' && <Redirect to={mainPageLink} />
    )
    || (isAuthenticated && (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={user} />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className="dropdown-item-text mb-0">{user.displayName}</h5>
          <p className="dropdown-item-text text-muted mb-0">{user.email}</p>
          <DropdownItem divider />
          <DropdownItem onClick={logout}>Sign Out</DropdownItem>
          <DropdownItem onClick={appLogin}>Authorize me</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )) || (
      <NavItem>
        <Button
          onClick={login}
          className="btn-link nav-link border-0"
          color="link"
        >
          Sign In
        </Button>
      </NavItem>
    )
  );
};

export default ({
  isAuthenticated,
  user,
  login,
  logout,
  appLogin,
}: NavBarProps) => {
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
                <RouterNavLink to="/" className="nav-link" exact>
                  Home
                </RouterNavLink>
              </NavItem>
              {isAuthenticated && (
                <NavItem>
                  <RouterNavLink to="/calendar" className="nav-link" exact>
                    Calendar
                  </RouterNavLink>
                </NavItem>
              )}
            </Nav>
            <Nav className="justify-content-end" navbar>
              <NavItem>
                <NavLink
                  href="https://developer.microsoft.com/graph/docs/concepts/overview"
                  target="_blank"
                >
                  <i className="fas fa-external-link-alt mr-1" />
                  Docs
                </NavLink>
              </NavItem>
              <AuthNavItem
                isAuthenticated={isAuthenticated}
                login={login}
                logout={logout}
                appLogin={() => { appLogin(); setOpen(false); }}
                user={user}
              />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
