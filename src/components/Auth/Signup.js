import React, { useState, useContext } from "react";
import { useNavigate  } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";

function Signup() {
    let navigate = useNavigate();
    const alertContext = useContext(AlertContext);
    const { showAlert } = alertContext;
    const [cred,setCred] = useState({name:"",email:"",password:"",confirm_password:""});
    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cred.password !== cred.confirm_password) {
          return showAlert("Passwords do not match", "danger");
        }
        try {
            let url = `${process.env.REACT_APP_AUTH_HOST}/createuser`;
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: cred.name,
                email: cred.email,
                password: cred.password,
              }),
            });
            const serverResponse = await response.json();
            
            if (serverResponse.success) {
                // store token in local storage
                localStorage.setItem("auth-token", serverResponse.authToken);
                navigate("/");
                window.location.reload();
            }if (!serverResponse.success) {
              showAlert(serverResponse.error, "danger");
          }
          } catch (error) {
            showAlert(`Error: ${error.message}`, "danger");
          }
    }
  return (
    <div className="container my-3">
        <h1>
            Signup
        </h1>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Enter name"
            onChange={onChange}
            value={cred.name}
            required
          />
        </div>
        <div className="form-group py-3">
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
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            onChange={onChange}
            value={cred.password}
            minLength={8}
            required
          />
        </div>
        <div className="form-group py-3">
          <label htmlFor="confirm_password">Confirm Password: </label>
          <input
            type="password"
            className="form-control"
            id="confirm_password"
            name="confirm_password"
            placeholder="confirm password"
            onChange={onChange}
            value={cred.confirm_password}
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
