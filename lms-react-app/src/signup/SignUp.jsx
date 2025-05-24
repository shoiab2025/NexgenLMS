import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";

import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useSignup();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign Up</h2>
              <p className="text-white-50 mb-3">
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
                  value={inputs.username}
                  onChange={(e) => {
                    setInputs({ ...inputs, username: e.target.value });
                  }}
                />
                <label htmlFor="username" className="form-label">
                  Email
                </label>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  value={inputs.email}
                  onChange={(e) => {
                    setInputs({ ...inputs, email: e.target.value });
                  }}
                />
                <label htmlFor="username" className="form-label">
                  Password
                </label>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  id="formControl"
                  type="password"
                  size="lg"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
                <label htmlFor="username" className="form-label">
                  confirm password
                </label>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  id="formControl"
                  type="password"
                  size="lg"
                  value={inputs.confirmPassword}
                  onChange={(e) =>
                    setInputs({ ...inputs, confirmPassword: e.target.value })
                  }
                />
                <Link
                  to="/login"
                  className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                >
                  Already have an account?
                </Link>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    size="lg"
                    color="light"
                    className=""
                    style={{ width: "47%" }}
                    onClick={() => navigate("/login")}
                  >
                    Back
                  </Button>

                  <MDBBtn size="lg" className="" type="submit" 
                    style={{ width: "47%" }}>
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "SignUp"
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

export default SignUp;
