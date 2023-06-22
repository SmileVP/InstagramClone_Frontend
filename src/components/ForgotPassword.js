import React from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../App";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function ForgotPassword() {
  //form validation using formik
  let userSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  //function to send email to reset password
  const handleForgetPass = async (values) => {
    try {
      let res = await axios.post(`${url}/users/send-email`, {
        email: values.email,
      });

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="forgot-password">
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={userSchema}
        onSubmit={(values) => {
          handleForgetPass(values);
        }}
      >
        {({ errors, touched }) => (
          <div className="container-fluid pt-3 d-flex justify-content-center">
            <div className="forgot-form">
              <div className="text-center text-white">
                <h3>Forgot password</h3>
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
                    placeholder="Enter your Email"
                  />
                  {errors.email && touched.email ? (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  ) : null}
                </div>
                <div className="log-button pt-3">
                  <Button variant="outline-light" type="submit">
                    send
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
