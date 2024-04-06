import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { useState } from 'react'

const Login = () => {
    const [activeForm, setActiveForm] = useState('Login')

    return (
        <div>
            <div className="access-logo">
                <img alt='logo' src='./ObsidianFox.png'></img>
                <div>
                    <h1>DeathDrip</h1>
                    <h2>Coffee Co</h2>
                </div>
            </div>
            {activeForm === 'Login' &&
                (<LoginForm setActiveForm={setActiveForm} />)}

            {activeForm === 'Register' &&
                (<RegisterForm setActiveForm={setActiveForm} />)}
        </div>
    );
}

export default Login;