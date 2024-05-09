import { React, useState } from 'react';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import UserService from '../../services/UserService';

const LoginForm = ({ setActiveForm }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await UserService.login(email, password)
            if (data.id === null) {
                const err = {}
                err.message = "error logging in"
                setError(err)
            }
        }
        catch (e) {
            setError('An Error Occured: ' + e.message);
        }
    };

    return (
        <div className="access-form">
            {(<form onSubmit={handleSubmit}>
                <div id='login-email-group' className="access-form-field">
                    <h4>email</h4>
                    <SlInput
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        size="medium"
                        onInput={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div id='login-password-group' className="access-form-field">
                    <h4>password</h4>
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
                {error.message && (
                    <div className="access-form-error" role="alert">
                        {error.message}
                    </div>
                )}
                <div className='access-form-buttons'>
                    <SlButton className='dd-100w' variant="primary" type="submit">
                        Login
                    </SlButton>
                    <div>
                        <p>
                            Don't have an account?
                            <SlButton variant="text" onClick={() => setActiveForm('Register')}>
                                Register
                            </SlButton>
                        </p>                        
                    </div>
                </div>
            </form>
            )}
        </div>
    );
}

export default LoginForm;
