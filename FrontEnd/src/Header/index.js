import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const Header = () => {
  const [userName, setUserName] = useState("");

  const jwtToken = Cookies.get("jwt_token");

  useEffect(() => {
    const getProfile = async () => {
      const api = axios.create({
        baseURL: "http://localhost:4000",
      });
      api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
      api
        .get("/profile")
        .then((response) => {
          setUserName(response.data[0].username);
        })
        .catch((error) => {
          console.error(error);
          setUserName(error);
        });
    };
    getProfile();
  }, [jwtToken]);

  const history = useHistory();

  const logoutButton = () => {
    Cookies.remove("jwt_token");
    history.replace("/login");
  };

  const homeIcon = () => {
    history.replace("/");
  };

  return (
    <nav className="header-nav">
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690657588/home_2_zebsfl.png"
        alt="home"
        className="header-home-img"
        onClick={homeIcon}
      />
      <div className="header-logout-container">
        <h1 className="header-title">{userName}</h1>
        <button
          type="button"
          className="header-logout-button"
          onClick={logoutButton}
        >
          <img
            src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690736126/Group_848_jncvqw.png"
            alt="logout"
            className="header-logout-img"
          />
        </button>
      </div>
    </nav>
  );
};
export default Header;
