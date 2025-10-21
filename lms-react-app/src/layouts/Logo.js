import { Link } from "react-router-dom";
import site_config from "../config/site.config";
import logo from "../assets/images/logos/beternal_logo.jpg"

const Logo = () => {
  return (
    <Link to="/" className="text-white text-decoration-none h4 justify-content-center mx-5">
      <img src= {logo} alt="" srcset="" width={100} />
    </Link>
  );
};



export default Logo;
