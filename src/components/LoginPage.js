import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { url } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import logo from "../assets/logo.png";

function LoginPage() {
  //for navigation
  let navigate = useNavigate();

  //schema for user formik
  let userSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  //login function
  let handleLogin = async (values) => {
    try {
      let res = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });
      if (res.status === 200) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("profile", res.data.user.photo);
        sessionStorage.setItem("name", res.data.user.name);
        sessionStorage.setItem("email", res.data.user.email);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(res.data.message);
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="login-page">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={userSchema}
          onSubmit={(values) => {
            handleLogin(values);
          }}
        >
          {({ errors, touched }) => (
            <div className="login mt-5 p-2">
              <div className="login-form">
                <div className="text-center text-white">
                  <img src={logo} style={{ height: "2em" }} alt="new" />
                </div>
                <Form>
                  <div className="form-group">
                    <label htmlFor="email" className="text-white">
                      Email
                    </label>
                    <Field
                      name="email"
                      className="form-control"
                      type="email"
                      placeholder="Enter Email"
                    />
                    {errors.email && touched.email ? (
                      <div style={{ color: "yellow" }}>{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="form-group pt-2">
                    <label htmlFor="password" className="text-white">
                      Password
                    </label>
                    <Field
                      name="password"
                      className="form-control"
                      type="password"
                      placeholder="Enter Password"
                    />
                    {errors.password && touched.password ? (
                      <div style={{ color: "yellow" }}>{errors.password}</div>
                    ) : null}
                  </div>
                  <div className="pt-3 d-flex justify-content-center">
                    <Button variant="outline-light" type="submit">
                      Login
                    </Button>
                  </div>
                </Form>
                <div className="m-2 pt-3">
                  <h6 className=" text-warning text-center">
                    Forgot Password ?
                  </h6>
                  <div className="d-flex justify-content-center   ">
                    <Button
                      variant="outline-light"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password
                    </Button>
                  </div>

                  <h6 className=" text-white text-center pt-3">
                    Don't have an account please sign-up{" "}
                  </h6>
                  <div className="d-flex justify-content-end   ">
                    <Button
                      variant="outline-light"
                      onClick={() => navigate("/signUp")}
                    >
                      Sign-Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginPage;
