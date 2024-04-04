import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import './login.css';
import axios from 'axios';

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showLoginPopup, setShowLoginPopup] = useState(false);
	const [showLoginFailedPopup, setShowLoginFailedPopup] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [userData, setUserData] = useState(null);

	const navigate = useNavigate();

	const handleLoginSuccess = (userData) => {
		localStorage.setItem('userData', JSON.stringify(userData));
		if (rememberMe) {
			localStorage.setItem('username', username);
			localStorage.setItem('password', password);
			localStorage.setItem('rememberMe', rememberMe);
		} else {
			localStorage.removeItem('username');
			localStorage.removeItem('password');
			localStorage.removeItem('rememberMe');
		}
		navigate('/dashboard', { state: { username: userData.username } });
	};

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleRememberMeChange = (event) => {
		setRememberMe(event.target.checked);
	};

	const handleLogin = async () => {
		if (!username || !password) {
			return alert('Username dan password harus diisi.');
		}

		try {
			setIsLoggingIn(true);
			const response = await axios.post('http://localhost:3001/api/login', {
				username,
				password,
			});

			console.log('Login berhasil');
			setUserData({
				username: response.data.username,
			});

			handleLoginSuccess(response.data);

			setShowLoginPopup(true);

			setTimeout(() => {
				setShowLoginPopup(false);
			}, 2000);
		} catch (error) {
			console.error('Login gagal', error);
			setShowLoginFailedPopup(true);
			setTimeout(() => {
				setShowLoginFailedPopup(false);
			}, 2000);
		} finally {
			setIsLoggingIn(false);
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
						<input
							type="text"
							id="username"
							placeholder=""
							value={username}
							onChange={handleUsernameChange}
						/>
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
							onChange={handlePasswordChange}
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

				<div className="remember-me">
					<input
						type="checkbox"
						id="rememberMe"
						checked={rememberMe}
						onChange={handleRememberMeChange}
					/>
					<label htmlFor="rememberMe">Remember Me</label>
				</div>

				<div className="button-group">
					<button
						className="login-button"
						onClick={handleLogin}
						disabled={isLoggingIn}
					>
						{isLoggingIn ? 'Logging In...' : 'Login'}
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

				{showLoginFailedPopup && (
					<div className="error-popup" id="errorPopup">
						<p>Login failed. Please check your username and password.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginForm;
