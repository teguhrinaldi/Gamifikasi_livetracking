import React from 'react';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import './login.css';
import googleLogo from '../assets/Google.png'; // Sesuaikan path dengan struktur folder proyek Anda

const LoginForm = () => {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
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
								className="input-icon"
								onClick={handleTogglePassword}
							/>
						) : (
							<FaEye className="input-icon" onClick={handleTogglePassword} />
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
					<button className="login-button">Login</button>
					<button className="register-button">Register</button>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
