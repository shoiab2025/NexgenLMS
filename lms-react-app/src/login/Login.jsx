import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/uselogin";
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-4 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-black-50 my-2">
                Please enter your login and password!
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  id="formControl"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <p className="text-danger" style={{ marginBottom: "1rem" }}>
                    {error}
                  </p>
                )}

                <div className="d-lg-flex d-md-flex d-block justify-content-between">
                  <MDBCheckbox
                    name="flexCheck"
                    id="flexCheckDefault"
                    className="mb-2"
                    label="Remember password"
                  />

                  <Link
                    to="/signup"
                    className="text-sm hover:underline hover:text-blue-600 inline-block mb-2"
                  >
                    {"Don't"} have an account?
                  </Link>
                </div>
                <br />
                <div className="d-flex justify-content-between my-1">
                  <MDBBtn
                    size="lg"
                    color="light"
                    style={{ width: "47%" }}
                    onClick={() => navigate("/")}
                  >
                    Back
                  </MDBBtn>
                  <MDBBtn
                    size="lg"
                    type="submit"
                    style={{ width: "47%" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Login"
                    )}
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
