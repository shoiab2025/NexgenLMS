import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import navigation from '../json-datas/menu.json';
import teacherNavigation from '../json-datas/teacher-menu.json';
import coordinatorNavigation from '../json-datas/coordinator-menu.json'
import { useAuthcontext } from "../contexts/Authcontext";


const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  const { authUser } = useAuthcontext();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div className="p-3 mt-2">
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
