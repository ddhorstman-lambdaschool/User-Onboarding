import React from "react";
import { withFormik, Form, Field } from "formik";
import "./Form.scss";
import * as yup from "yup";
import axios from "axios";
import CryptoJS from "crypto-js";

function UserForm({ errors, touched, status }) {
    if (Object.entries(errors).length !== 0) console.error(errors);
    return (
        <Form className="user-form">
            <h3>New User Sign-Up</h3>
            <label>Name:
                <Field name="name" />
            </label>
            <label>Email address:
                <Field name="email" type="email" />
            </label>
            <label>Password:
                <Field name="password" type="password" />
            </label>
            <label>Confirm Password:
                <Field name="confirmPassword" type="password" />
            </label>
            <label>
                <Field name="acceptedTOS" type="checkbox" />
                I have read and accepted the <a href="#">terms of service</a>.
            </label>
            <Field type="submit" name="Submit" />
        </Form>
    );
}

export default withFormik({
    mapPropsToValues: () => ({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptedTOS: false
    }),
    validationSchema: yup.object().shape({
        name: yup
            .string()
            .required("Please enter your name"),
        email: yup
            .string()
            .required("Please enter your email address")
            .email("Please enter a valid email address"),
        password: yup
            .string()
            .required("Please enter a password"),
        confirmPassword: yup
            .string()
            .required("Please confirm your password")
            .oneOf([yup.ref('password')], "Passwords do not match."),
        acceptedTOS: yup
            .boolean()
            .oneOf([true], "You must accept the terms of service.")
    }),
    handleSubmit: (values, { resetForm, setStatus, setSubmitting }) => {
        setSubmitting(true);
        axios
            .post("https://reqres.in/api/users/",
                { ...values, 
                    password: CryptoJS.MD5(values.password), 
                    confirmPassword: null 
                })
            .then(res => {
                //console.log(res);
                setStatus(res.data);
                setSubmitting(false);
                resetForm();
            })
            .catch(console.error);
    }
})(UserForm);