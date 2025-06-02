import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import navigation from '../json-datas/menu.json';
import teacherNavigation from '../json-datas/teacher-menu.json';
import coordinatorNavigation from '../json-datas/coordinator-menu.json'
import { useAuthcontext } from "../contexts/Authcontext";
import useLogout from "../hooks/uselogout";
import React from "react";


const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { logout, loading } = useLogout();
  const { authUser } = useAuthcontext();
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div>
      <div className="d-flex align-items-center mt-3 justify-content-center">
        <div className="hstack gap-2 d-lg-none d-md-none d-block">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="transparent">
              <img
                src={user1}
                alt="profile"
                className="rounded-circle"
                width="100"
              ></img>
              <br />
              <p className="mx-2 text-capitalize h5 mt-2" > {authUser.user.username} <i class="fa-solid fa-caret-down"></i></p>
              
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={logout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="p-3 mt-0">
        <Nav vertical className="sidebarNav">
          {
            authUser.user.role === 'teacher' ? (
              teacherNavigation.map((navi, index) => (
                <NavItem key={index} className="sidenav-bg">
                  <Link
                    to={navi.href}
                    className={
                      location.pathname.includes(navi.href)
                        ? "active nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }
                  >
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </Link>
                </NavItem>
              ))
            ) : authUser.user.role === 'coordinator' ? (
              coordinatorNavigation.map((navi, index) => (
                <NavItem key={index} className="sidenav-bg">
                  <Link
                    to={navi.href}
                    className={
                      location.pathname.includes(navi.href)
                        ? "active nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }
                  >
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </Link>
                </NavItem>
              ))
            ) : (
              navigation.map((navi, index) => (
                <NavItem key={index} className="sidenav-bg">
                  <Link
                    to={navi.href}
                    className={
                      location.pathname.includes(navi.href)
                        ? "active nav-link py-3"
                        : "nav-link text-secondary py-3"
                    }
                  >
                    <i className={navi.icon}></i>
                    <span className="ms-3 d-inline-block">{navi.title}</span>
                  </Link>
                </NavItem>
              ))
            )
          }
        </Nav>


      </div>
    </div>
  );
};

export default Sidebar;
