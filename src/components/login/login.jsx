import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import './login.css';
import googleLogo from '../assets/Google.png';

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showLoginPopup, setShowLoginPopup] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:5000/api/login', {
				username: username,
				password: password
			});
			console.log('Login successful');
			setShowLoginPopup(true);
			setTimeout(() => {
				setShowLoginPopup(false);
				navigate('/dashboard');
			}, 2000);
		} catch (error) {
			if (error.response) {
				console.log('Failed login');
			}
		}
	};

	const handleRegisterClick = () => {
		setTimeout(() => {
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
						<input type="text" id="username" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
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
							value={password} 
							onChange={(e) => 
							setPassword(e.target.value)} 
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
