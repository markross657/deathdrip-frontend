import React, { useState } from 'react';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import UserService from '../../services/UserService';

const RegisterForm = ({ setActiveForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await UserService.register({
                email,
                password,
                confirmPassword,
                firstName,
                lastName,
            });

            if (data.id !== null) {
                setActiveForm('Login');
            } else {
                const err = {};
                err.message = "Error registering user";
                setError(err);
            }
        } catch (e) {
            setError('An Error Occurred: ' + e.message);
        }
    };

    return (
        <div className="register-form">
            <form onSubmit={handleSubmit}>
                <div id='register-firstname-group' className="access-form-field">
                    <h3 className='dd-h3'>First Name</h3>
                    <SlInput
                        type="text"
                        id="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        size="medium"
                        onInput={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div id='register-lastname-group' className="access-form-field">
                    <h3 className='dd-h3'>Last Name</h3>
                    <SlInput
                        type="text"
                        id="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        size="medium"
                        onInput={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div id='register-email-group' className="access-form-field">
                    <h3>Email</h3>
                    <SlInput
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        size="medium"
                        onInput={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div id='register-password-group' className="access-form-field">
                    <h3>Password</h3>
                    <SlInput
                        type="password"
                        id="password"
                        password-toggle
                        placeholder="Enter your password"
                        value={password}
                        size="medium"
                        onInput={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div id='confirm-password-group' className="access-form-field">
                    <h3>Confirm Password</h3>
                    <SlInput
                        type="password"
                        id="confirmPassword"
                        password-toggle
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        size="medium"
                        onInput={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error.message && (
                    <div className="access-form-error" role="alert">
                        {error.message}
                    </div>
                )}
                <div className='access-form-buttons'>
                    <SlButton variant="success" type="submit">
                        Register
                    </SlButton>
                    <SlButton variant="danger" onClick={() => setActiveForm('Login')}>
                        Cancel
                    </SlButton>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
