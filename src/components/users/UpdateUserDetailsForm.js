import React, { useState } from 'react';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import UserService from '../../services/UserService';
import SlDialog from '@shoelace-style/shoelace/dist/react/dialog';

const UpdateUserDetailsForm = ({closeUpdateDialog}) => {
    const user = UserService.getUser()

    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [bio, setBio] = useState(user.bio)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = user._id;
        try {
            UserService.updateUser({
                id,
                email,
                firstName,
                lastName,
                bio
            })
        } catch (e) {
            setError('An Error Occurred: ' + e.message)
        }
    };    

    return (
        <SlDialog onSlHide={closeUpdateDialog} open='true' className='inv-dialog'>
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
                    <br />
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
                        <h3>New Password</h3>
                        <SlInput
                            type="password"
                            id="confirmPassword"
                            password-toggle
                            placeholder="Enter your new Password"
                            value={confirmPassword}
                            size="medium"
                            onInput={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="access-form-field">
                        <h3>Update Bio</h3>
                        <SlInput
                            type="text"
                            password-toggle
                            placeholder="Update your Bio"
                            value={confirmPassword}
                            size="medium"
                            onInput={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="inv-item-footer">
                        <div className='inv-item-button'>
                            <SlButton size='large' variant='danger' onClick={(e) => closeUpdateDialog()} href="#">
                                Close
                            </SlButton>
                        </div>
                        <div className='inv-item-button'>
                            <SlButton size='large' variant='success' href="#">
                                Save
                            </SlButton>
                        </div>
                    </div>
                    {error.message && (
                        <div className="access-form-error" role="alert">
                            {error.message}
                        </div>
                    )}
                </form>
            </div>
        </SlDialog>
    );
}

export default UpdateUserDetailsForm;
