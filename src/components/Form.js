import React from "react";
import { withFormik, Form, Field } from "formik";
import "./Form.scss";
import * as yup from "yup";
function UserForm(props) {
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
        name: yup.string().required()
    })
})(UserForm);