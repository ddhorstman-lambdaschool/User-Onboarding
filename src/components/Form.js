import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import "./Form.scss";
import * as yup from "yup";
import axios from "axios";
import CryptoJS from "crypto-js";

function UserForm({ errors, touched, status, submitCount }) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        status && setUsers([...users, status]);
    }, [status]);
    return (
        <div>
        <Form className="user-form">
            <h3>New User Sign-Up</h3>
            <label>Name:
                <Field name="name"
                    className={
                        (submitCount > 0 && errors.name)
                            ? "error"
                            : ""
                    } />
                {
                    (submitCount > 0 && errors.name)
                    && <p className="error-message">{errors.name}</p>
                }
            </label>
            <label>Email address:
                <Field name="email" type="email"
                    className={
                        (submitCount > 0 && errors.email)
                            ? "error"
                            : ""
                    } />
                {
                    (submitCount > 0 && errors.email)
                    && <p className="error-message">{errors.email}</p>
                }
            </label>
            <label>Password:
                <Field name="password" type="password"
                    className={
                        (touched.password && errors.password)
                            ? "error"
                            : ""
                    } />
                {
                    (touched.password && errors.password)
                    && <p className="error-message">{errors.password}</p>
                }
            </label>
            <label>Confirm Password:
                <Field name="confirmPassword" type="password"
                    className={
                        (touched.confirmPassword && errors.confirmPassword)
                            ? "error"
                            : ""
                    } />
                {
                    (touched.confirmPassword && errors.confirmPassword)
                    && <p className="error-message">{errors.confirmPassword}</p>
                }
            </label>
            <label
                className={
                    (touched.acceptedTOS && errors.acceptedTOS)
                        ? "error"
                        : ""
                } >
                <Field name="acceptedTOS" type="checkbox" />
                I have read and accept the <a href="#">terms of service</a>.
            </label>
            <Field type="submit" name="Submit" />
        </Form>
        {users[0]?.name && <h2>Users:</h2>}
        {users.map(user => (
        <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
        ))}
        </div>
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
            .required("Please enter a password")
            .min(8, "Must be at least 8 characters long.")
            .notOneOf([yup.ref('name'), yup.ref('email')], "Cannot match name or email."),
        confirmPassword: yup
            .string()
            .required("Please confirm your password")
            .oneOf([yup.ref('password')], "Entered passwords do not match."),
        acceptedTOS: yup
            .boolean()
            .oneOf([true], "You must accept the terms of service.")
    }),
    handleSubmit: (values, { resetForm, setStatus, setSubmitting }) => {
        setSubmitting(true);
        axios
            .post("https://reqres.in/api/users/",
                {
                    ...values,
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