import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function ResetPassword() {
  const { id, token } = useParams();
  const navigate = useNavigate();

  //token validation after the link clicked from email
  const tokenValidation = async () => {
    try {
      let res = await axios.get(`${url}/users/reset-password/${id}/${token}`);

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/forgetPassword");
    }
  };

  //function for save new password
  const handleNewPassword = async (values) => {
    try {
      let res = await axios.post(
        `${url}/users/change-password/${id}/${token}`,
        {
          password: values.password,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //form validation using formik
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  let userSchema = Yup.object().shape({
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

  //validating link has received in email
  useEffect(() => {
    tokenValidation();
  }, []);

  return (
    <div className="forgot-password">
      <Formik
        initialValues={{
          password: "",
        }}
        validationSchema={userSchema}
        onSubmit={(values) => {
          handleNewPassword(values);
        }}
      >
        {({ errors, touched }) => (
          <div className="container-fluid d-flex justify-content-center">
            <div className="forgot-form mt-5">
              <div className="text-center text-white">
                <h1>Reset Password</h1>
              </div>
              <div className="login-header text-center text-white">
                <p>Enter your new password</p>
              </div>
              <Form>
                <div className="form-group pt-2">
                  <label htmlFor="password" className="text-white">
                    password
                  </label>
                  <Field
                    name="password"
                    className="form-control"
                    type="password"
                    placeholder="Enter Password"
                  />
                  {errors.password && touched.password ? (
                    <div style={{ color: "red" }}>{errors.password}</div>
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
                    <div style={{ color: "red" }}>{errors.confirmPassword}</div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <Button variant="outline-light" type="submit">
                    Submit
                  </Button>
                </div>
                <div className="m-2 p-3">
                  <h6 className=" text-warning text-center">
                    After reset your password please login
                  </h6>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-light"
                      onClick={() => navigate("/login")}
                    >
                      login
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default ResetPassword;
