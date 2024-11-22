export const validateLoginForm = ({
    email,
    password
}: {
    email: string;
    password: string;
}) => {
    const errors: { [key: string]: string } = {}; // Initialize an empty errors object

    if (!validateMail(email)) {
        errors.email = "Invalid email address.";
    }
    if (!validatePassword(password)) {
        errors.password = "Password must be at least 6 characters.";
    }

    return errors; // Return the errors object
};

export const validateRegisterForm = ({
    email,
    password,
    username,
}: {
    email: string;
    password: string;
    username: string;
}) => {
    const errors: { [key: string]: string } = {}; // Initialize an empty errors object

    if (!validateMail(email)) {
        errors.email = "Invalid email address.";
    }
    if (!validatePassword(password)) {
        errors.password = "Password must be at least 6 characters.";
    }
    if (!validateUsername(username)) {
        errors.username = "Username must be between 3 and 12 characters.";
    }

    return errors; // Return the errors object
};

// Validation functions remain unchanged
const validatePassword = (password: string) => {
    return password.length > 5;
};

export const validateMail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
};

const validateUsername = (username: string) => {
    return username.length > 2 && username.length < 13;
};

export const validateGroupName = (name: string) => {
    return name.length > 2 && name.length < 13;
};
