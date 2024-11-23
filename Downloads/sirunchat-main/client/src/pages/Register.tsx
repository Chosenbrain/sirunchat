import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, Tooltip, IconButton, Paper, Divider } from "@mui/material";
import { styled } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { validateRegisterForm } from "../utils/validators"; // Ensure this function returns an object
import { useAppSelector } from "../store";
import { registerUser } from "../actions/authActions";
import SirunLogo from "../assets/sirun-logo.png";

const Background = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, #1f2235, #141625)",
    padding: "20px",
});

const FormCard = styled(Paper)({
    padding: "40px 35px",
    maxWidth: "400px",
    width: "100%",
    background: "#1e1f2b",
    borderRadius: "15px",
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.6)",
    textAlign: "center",
    color: "#d9d9d9",
    position: "relative",
    animation: "fadeIn 1s ease-out",
    "@keyframes fadeIn": {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0)" },
    },
    "@media (max-width: 600px)": {
        padding: "30px 20px",
        maxWidth: "90%",
    },
});

const Logo = styled("img")({
    width: "70px",
    height: "70px",
    marginBottom: "25px",
    filter: "brightness(1.3) contrast(1.1)",
});

const Label = styled(Typography)({
    color: "#b3b5c3",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "8px",
    textAlign: "left",
    "@media (max-width: 600px)": {
        fontSize: "0.8rem",
    },
});

const Input = styled("input")({
    width: "100%",
    height: "45px",
    border: "1px solid #3a3b4d",
    borderRadius: "8px",
    background: "#252738",
    padding: "0 15px",
    color: "#e0e0e0",
    fontSize: "1rem",
    marginBottom: "20px",
    outline: "none",
    transition: "border-color 0.3s",
    "&:focus": {
        borderColor: "#5865f2",
        boxShadow: "0 0 8px rgba(88, 101, 242, 0.5)",
    },
    "@media (max-width: 600px)": {
        height: "40px",
    },
});

const ErrorText = styled("p")({
    color: "#ff4d4d",
    fontSize: "0.85rem",
    marginTop: "-15px",
    marginBottom: "10px",
    "@media (max-width: 600px)": {
        fontSize: "0.75rem",
    },
});

const StyledButton = styled(Button)({
    width: "100%",
    height: "50px",
    fontSize: "1rem",
    fontWeight: 600,
    background: "linear-gradient(135deg, #5865f2, #4c55d3)",
    color: "#ffffff",
    textTransform: "none",
    borderRadius: "10px",
    boxShadow: "0px 4px 12px rgba(88, 101, 242, 0.4)",
    transition: "background 0.3s, box-shadow 0.3s",
    "&:hover": {
        background: "linear-gradient(135deg, #4c55d3, #3b44b0)",
        boxShadow: "0px 4px 16px rgba(88, 101, 242, 0.6)",
    },
    "@media (max-width: 600px)": {
        height: "45px",
        fontSize: "0.9rem",
    },
});

const RedirectText = styled("span")({
    color: "#00aff4",
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 0.3s",
    "&:hover": {
        color: "#008ecc",
    },
    "@media (max-width: 600px)": {
        fontSize: "0.85rem",
    },
});

const Register = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        username: ""
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch();
    const { userDetails } = useAppSelector((state) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRegister = () => {
        const validationErrors = validateRegisterForm(credentials);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        dispatch(registerUser(credentials));
    };

    useEffect(() => {
        setIsFormValid(Object.keys(validateRegisterForm(credentials)).length === 0);
    }, [credentials]);

    useEffect(() => {
        if (userDetails?.token) {
            // Redirect to login instead of dashboard
            navigate("/login");
        }
    }, [userDetails, navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Background>
            <FormCard elevation={4}>
                <Logo src={SirunLogo} alt="Sirun Logo" />
                <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 3 }}>
                    Join Sirun Today
                </Typography>
                <Typography sx={{ color: "#b3b5c3", mb: 3, fontSize: "0.95rem" }}>
                    Create an account to connect with friends securely.
                </Typography>
                <Divider sx={{ mb: 3, borderColor: "#44475a" }} />

                <Box sx={{ textAlign: "left" }}>
                    <Label>Username</Label>
                    <Input
                        type="text"
                        placeholder="Enter your username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    {errors.username && <ErrorText>{errors.username}</ErrorText>}
                </Box>

                <Box sx={{ textAlign: "left" }}>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </Box>

                <Box sx={{ textAlign: "left" }}>
                    <Label>Password</Label>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            style={{ flexGrow: 1 }}
                        />
                        <IconButton onClick={togglePasswordVisibility} sx={{ color: "#72767d" }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </Box>

                <Tooltip
                    title={
                        isFormValid
                            ? "Proceed to Register"
                            : "Ensure your email, username, and password meet the requirements."
                    }
                >
                    <StyledButton
                        variant="contained"
                        disabled={!isFormValid}
                        onClick={handleRegister}
                    >
                        Sign Up
                    </StyledButton>
                </Tooltip>

                <Typography sx={{ color: "#72767d", mt: 3 }} variant="subtitle2">
                    Already have an account?{" "}
                    <RedirectText onClick={() => navigate("/login")}>
                        Log In
                    </RedirectText>
                </Typography>
            </FormCard>
        </Background>
    );
};

export default Register;
