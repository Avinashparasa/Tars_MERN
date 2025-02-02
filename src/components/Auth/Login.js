import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function Login() {
  let navigate = useNavigate();
  const alertContext = useContext(AlertContext);
  const { showAlert } = alertContext;

  const [cred, setCred] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = `${process.env.REACT_APP_AUTH_HOST}/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cred.email, password: cred.password }),
      });
      const serverResponse = await response.json();

      if (serverResponse.success) {
        // store token in local storage
        localStorage.setItem("auth-token", serverResponse.authToken);
        navigate("/");
        window.location.reload();
        //showAlert("Login Successful", "success");
      } else if (!serverResponse.success) {
        showAlert(serverResponse.error, "danger");
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "danger");
    }
  };

  return (
    <div className="container my-3">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={onChange}
            value={cred.email}
            required
          />
        </div>
        <div className="form-group py-3">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
              value={cred.password}
              minLength={8}
              required
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
