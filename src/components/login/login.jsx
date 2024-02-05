import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import './login.css';
import googleLogo from '../assets/Google.png';

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showLoginPopup, setShowLoginPopup] = useState(false); // State untuk menampilkan popup
	const navigate = useNavigate();

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleLogin = () => {
		console.log('Login successful');
		setShowLoginPopup(true);
		setTimeout(() => {
			setShowLoginPopup(false);
			navigate('/dashboard');
		}, 2000);
	};

	const handleRegisterClick = () => {
		setShowLoginPopup(true);
		setTimeout(() => {
			setShowLoginPopup(false);
			navigate('/register');
		}, 2000);
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h2 className="login-title">LOGIN</h2>

				<div className="input-group">
					<label htmlFor="username" className="input-label">
						Username
					</label>
					<div className="icon-input">
						<FaUser className="input-icon" />
						<input type="text" id="username" placeholder="" />
					</div>
				</div>

				<div className="input-group">
					<label htmlFor="password" className="input-label">
						Password
					</label>
					<div className="icon-input">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							placeholder=""
						/>
						{showPassword ? (
							<FaEyeSlash
								className="input-icon eye-icon"
								onClick={handleTogglePassword}
							/>
						) : (
							<FaEye
								className="input-icon eye-icon"
								onClick={handleTogglePassword}
							/>
						)}
					</div>
				</div>

				<div className="google-login">
					<button className="google-login-button">
						<img src={googleLogo} alt="Google Logo" className="google-icon" />
						Sign in with Google
					</button>
				</div>

				<div className="button-group">
					<button className="login-button" onClick={handleLogin}>
						Login
					</button>
					<button className="register-button" onClick={handleRegisterClick}>
						Register
					</button>
				</div>

				{showLoginPopup && (
					<div className="success-popup" id="successPopup">
						<p>Login successful, please wait...</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginForm;
