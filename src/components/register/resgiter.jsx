import React from 'react';
import './register.css';
import googleLogo from '../asseets/Google.png'; // Sesuaikan path dengan struktur folder proyek Anda

const RegisterForm = () => {
	return (
		<div className="register-container">
			<div className="register-box">
				<h2 className="register-title">REGISTER</h2>
				<div className="input-group1">
					<label>Email</label>
					<input type="email" placeholder="" />
				</div>
				<div className="input-group2">
					<label>Username</label>
					<input type="text" placeholder="" />
				</div>
				<div className="input-group3">
					<label>Password</label>
					<input type="password" placeholder="" />
				</div>
				<div className="google-signup">
					<button className="google-signup-button">
						<img src={googleLogo} alt="Google Logo" className="google-icon" />{' '}
						Sign up with Google
					</button>
				</div>
				<div className="button-group1">
					<button className="create-account-button">Create Account</button>
					<p className="login-link">
						Already have an account?{' '}
						<span className="login-link-text">Log in</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterForm;
