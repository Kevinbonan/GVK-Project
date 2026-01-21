import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../App";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      setIsAuthenticated(false);
    };
    const logoutUser = async () => {
      try {
        const response = await axios.post(
          BASE_URL + "/logout",
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          alert(response.data.message);
          handleLogout();
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("You are not logged in");
        } else {
          alert("An error occurred during logout");
        }
        console.error(error);
        navigate("/");
      }
    };

    logoutUser();
  }, [navigate, setIsAuthenticated]);

  return <></>;
}

export default Logout;
