const validatePassword = (password) => {
	// At least 8 characters
	const hasValidLength = password.length >= 8;
	// At least one uppercase letter
	const hasUppercase = /[A-Z]/.test(password);
	// At least one lowercase letter
	const hasLowercase = /[a-z]/.test(password);
	// At least one number
	const hasNumber = /\d/.test(password);
	// At least one special character
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	let validatorMsg = {
		hasValidLength: "Password should be atleast 8 characters long",
		hasUppercase: "Password should have atleast one character in Uppercase",
		hasLowercase: "Password should have atleast one character in Lowercase",
		hasNumber: "Password should have atleast one numeric character",
		hasSpecialChar: "Password should have atleast one special character",
	};

	let errorMsg = Object.keys(validatorMsg)
		.filter((key) => {
			switch (key) {
				case "hasValidLength":
					return !hasValidLength;
				case "hasUppercase":
					return !hasUppercase;
				case "hasLowercase":
					return !hasLowercase;
				case "hasNumber":
					return !hasNumber;
				case "hasSpecialChar":
					return !hasSpecialChar;
				default:
					return false;
			}
		})
		.map((key) => validatorMsg[key]);

	return errorMsg;
};

validatePassword("Shruti112");

export default validatePassword;
