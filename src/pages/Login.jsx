import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";

function Login() {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    console.log(formDetails);
    try {
      e.preventDefault();
      const { email, password } = formDetails;
      if (!email || !password) {
        return toast.error("Input field should not be empty");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      }

      const { data } = await toast.promise(
        axios.post("https://health-otpr.onrender.com/api/user/login", {
          email,
          password,
        }),

        {
          pending: "Logging in...",
          success: "Login successfully",
          error: "Unable to login user",
          loading: "Logging user...",
        }
      );
      localStorage.setItem("token", data.token);
      dispatch(setUserInfo(jwt_decode(data.token).userId));
      getUser(jwt_decode(data.token).userId);
    } catch (error) {
      return error;
    }
  };

  const getUser = async (id) => {
    try {
      const temp = await fetchData(
        `https://health-otpr.onrender.com/api/user/getuser/${id}`
      );
      dispatch(setUserInfo(temp));
      return navigate("/");
    } catch (error) {
      return error;
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign In</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <button type="submit" className="btn form-btn">
            sign in
          </button>
        </form>
        <p>
          Not a user?{" "}
          <NavLink className="login-link" to={"/register"}>
            Register
          </NavLink>
        </p>
      </div>
      <br />
      <table style={{marginLeft:"100px"}}>
        <thead>
          <tr>
            <th>User Login</th>
          </tr>
        </thead>
        <tbody>
          <tr>Username: arun@gmail.com</tr>
          <tr>Password: 12345</tr>
        </tbody>
        <tr>
            <th>Admin Login</th>
          </tr>
          <tr>Username: arunadmin@gmail.com</tr>
          <tr>Password: 12345</tr>
      </table>
    </section>
  );
}

export default Login;
