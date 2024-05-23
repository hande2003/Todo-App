import { Form, redirect, useActionData, Link } from "react-router-dom";
//import { useRef } from "react";
import axios from "axios";
import AlertComponent from "../components/AlertComponent";

export async function action({ request }) { // Receive formData directly
	
	const formData = await request.formData();
	let data = {
		email: formData.get("email"),
		password: formData.get("password")
	}
	let loginurl = formData.get("remember-me") ? "/auth/login?useCookies=true" : "/auth/login?useSessionCookies=true";
	
	try {
		// Send form data to the server endpoint using Axios
		const response = await axios.post(loginurl, data); // Use formData directly
		if (response.status === 200) {
			return redirect("/todo"); // Use redirect function to navigate to '/todo' route
		}
	} catch (error) {
		return error.response.data; // Use redirect function to navigate to home route on error
	}

	// Return null if no redirection is needed
	return null;
}

const Login = () => {
	const errors = useActionData();

	return (
		<div className="card col-6 mx-auto">
			<div className="card-header bg-info-subtle text-info-emphasis">
				<h3 className="card-title mb-0 text-center">Login</h3>
			</div>
			<div className="card-body">
				{errors && (
					<div>
						{errors.code === "EANF" ? (
							<div className="alert alert-warning" role="alert">
								<div>Email not found. Click <Link to="/register" className="alert-link">here</Link> to register.</div>
								<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>
						) : (
							<AlertComponent type="danger" message={errors.message}/>
						)}
					</div>
				)}
				<Form  method="post">
					<div className="form-floating mb-3">
						<input type="email" className="form-control" id="log-email" name="email" placeholder="name@example.com" />
						<label htmlFor="log-email">Email address</label>
					</div>
					<div className="form-floating mb-3">
						<input type="password" className="form-control" id="log-password" name="password" placeholder="Password" />
						<label htmlFor="log-password">Password</label>
					</div>
					<div className="form-check">
						<input className="form-check-input shadow shadow-sm" type="checkbox" id="remember-me" name="remember-me" />
						<label className="form-check-label" htmlFor="remember-me">Remember me</label>
					</div>
					<button type="submit" className="btn btn-info col-12 my-3">Sign In</button>
				</Form>
				<hr />
				<div className="text-center"><p>Not a user yet? Click <Link to="/register">here</Link> to register.</p></div>
			</div>
		</div>
	);
};

export default Login;
