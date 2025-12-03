import React from "react";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import Logo from "../../layouts/Logo";
import user1 from "../../assets/images/users/user4.jpg";
import useLogout from "../../hooks/uselogout";
import { useNavigate } from "react-router-dom";
import { useAuthcontext } from "../../contexts/Authcontext";

const StudentHeader = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { logout } = useLogout();
  const { authUser } = useAuthcontext();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handleToggle = () => setIsOpen(!isOpen);

  const showMobileMenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  return (
    <Navbar color="white" expand="md" className="fix-header py-2 d-flex justify-content-between ">
      <div className="d-flex align-items-center align-self-center">
        <div className="d-lg-block d-block me-5 pe-0 site_name">
          <Logo />
        </div>        
      </div>
      <div className="hstack gap-2 me-3 h-100 align-self-center">
          {authUser ? (
            <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle color="transparent" className="p-0">
                <img
                  src={user1}
                  alt="profile"
                  className="rounded-circle"
                  width="40"
                />
                <span className="mx-2 text-capitalize h6 ">
                  {" "}
                  {authUser.user.username}
                </span>
              </DropdownToggle>
              <DropdownMenu right style={{ marginTop: 5 }}>
                <DropdownItem onClick={logout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
            <Button color="primary py-2 px-2 w-100 text-white fw-bold" onClick={() => navigate("/login")}>
              Login / Register
            </Button>
          )}
        </div>

    </Navbar>
  );
};

export default StudentHeader;
