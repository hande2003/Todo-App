/* eslint-disable react/prop-types */
import axios from "axios";
import validatePassword from "../../public/JS/validate";
import AlertComponent from "../components/AlertComponent";
import ValidationErrors from "../components/ValidationErrors";

import { Link, Form, useNavigation, useActionData } from "react-router-dom";
import ServerResponse from "../components/ServerResponse";
import { useRef } from "react";

// action
export async function action({ request }) {
    const formData = await request?.formData();
    let result = {};
    let errorMsg = validatePassword(formData.get("password"));
    if (errorMsg.length !== 0) {
        result = {
            message: errorMsg,
            code: "VE"

        }

        return result;
    }
    else {
        let data = {
            firstName: formData.get("firstname"),
            lastName: formData.get("lastname"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirm-password"),
        };
        let regurl = '/auth/register';

        try {
            const response = await axios.post(regurl, data);
            if (response.status === 200) {
                result = {
                    message: response.data.message,
                    code: "OK"

                }
                return result;
            }
        } catch (error) {
            let err = error.response.data;
            let checkErrPwd = Object.prototype.hasOwnProperty.call(err, 'errors');

            if (!checkErrPwd) {
                result = {
                    message: err,
                    code: "ERR"
                };
                return result;
            } else {
                result = {
                    message: err.errors,
                    code: "ERR"

                };
                return result;
            }
        }
        return null;
    }
}

const Register = () => {
    const navigate = useNavigation();
    const formRef = useRef(null);
    let responseData = useActionData();
    let state = navigate.state;

    if (responseData?.code === "OK") {
        formRef.current.reset();
    }
    
    return (
        <>
            <div className="card col-8 mx-auto">
                <div className="card-header bg-info-subtle text-info-emphasis">
                    <h3 className="card-title mb-0 text-center">Register</h3>
                </div>
                <div className="card-body">
                    {
                        state === "submitting" && <AlertComponent message={"Loading... "} type="info" />
                    }
                    
                    <ServerResponse response={responseData} />
                    

                    <Form method="post" ref={formRef}>
                        <div className="row mb-3">
                            <div className="col">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="First Name"
                                        autoCapitalize="words"
                                        required
                                    />
                                    <label htmlFor="firstname">First Name</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Last Name"
                                        autoCapitalize="words"
                                        required
                                    />
                                    <label htmlFor="lastname">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="reg-email"
                                name="email"
                                placeholder="name@example.com"
                                required
                            />
                            <label htmlFor="reg-email">Email address</label>
                        </div>
                        <div className="mb-3">
                            <div className="form-floating mb-1">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="reg-password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <label htmlFor="reg-password">Password</label>
                            </div>
                            <div id="passwordHelpBlock" className="form-text text-start fw-light">
                                Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.
                            </div>
                            <ValidationErrors response={ responseData } />
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="Confirm Password"
                                required
                            />
                            <label htmlFor="confirm-password">Confirm Password</label>
                        </div>
                        <button type="submit" className="btn btn-info col-12 my-3" disabled={state === "submitting" || state === "loading"}>
                            {state === "submitting" ? "Signing Up":"Sign Up"}
                        </button>
                    </Form>
                    <hr />
                    <div className="text-center">
                        <p>
                            Already a user? Click <Link to="/">here</Link> to login.
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Register;
