import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { url } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import logo from "../assets/logo.png";

function SignUpPage() {
  let navigate = useNavigate();

  //form validation using formik
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  //schema for user sign up
  let userSchema = Yup.object().shape({
    fullName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    mobile: Yup.string().required("Required"),
    password: Yup.string()
      .matches(
        passwordRules,
        "Password length  minimum 8 character and contains uppercase(A-Z) lowercase(a-z) and number(0-9)."
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "confirm password should match with password"
      )
      .required("Required"),
  });

  //function for signUp
  let handleSignUp = async (values) => {
    try {
      let res = await axios.post(`${url}/signUp`, {
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      });
      if (res.status === 201) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="login-page">
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            mobile: "",
            password: "",
          }}
          validationSchema={userSchema}
          onSubmit={(values) => {
            handleSignUp(values);
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
                    <label htmlFor="fullName" className="text-white">
                      Full Name
                    </label>
                    <Field
                      name="fullName"
                      className="form-control"
                      type="text"
                      placeholder="Enter Name"
                    />
                    {errors.fullName && touched.fullName ? (
                      <div style={{ color: "yellow" }}>{errors.fullName}</div>
                    ) : null}
                  </div>

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

                  <div className="form-group">
                    <label htmlFor="mobile" className="text-white">
                      Mobile
                    </label>
                    <Field
                      name="mobile"
                      className="form-control"
                      type="text"
                      placeholder="Enter Mobile"
                    />
                    {errors.mobile && touched.mobile ? (
                      <div style={{ color: "yellow" }}>{errors.mobile}</div>
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

                  <div className="form-group pt-2">
                    <label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </label>
                    <Field
                      name="confirmPassword"
                      className="form-control"
                      type="Password"
                      placeholder="Enter confirm password"
                    />
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <div style={{ color: "yellow" }}>
                        {errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                  <div className="pt-3 d-flex justify-content-center">
                    <Button variant="outline-light" type="submit">
                      Sign Up
                    </Button>
                  </div>
                </Form>
                <div className="m-2 pt-3">
                  <h6 className=" text-white text-center pt-3">
                    Do you have an account please login !..
                  </h6>
                  <div className="d-flex justify-content-center   ">
                    <Button
                      variant="outline-light"
                      onClick={() => navigate("/login")}
                    >
                      Login
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

export default SignUpPage;
