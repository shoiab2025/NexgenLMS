import { Link } from "react-router-dom";
import site_config from "../config/site.config";
import logo from "../assets/images/logos/Nexgen.png"

const Logo = () => {
  return (
    <Link to="/" className="text-white text-decoration-none h4">
      <img src= {logo} alt="" srcset="" width={200} />
    </Link>
  );
};



export default Logo;
