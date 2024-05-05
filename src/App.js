import React, { useState, useEffect } from 'react';

import Login from './components/login/Login';
import Main from './components/Main';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

import './css/App.css'
import './css/style.scss';
import './css/access.css';
import './css/account.css';

import UserService from './services/UserService';

function App() {
    const[hasUser, setHasUser] = useState(UserService.getUser());
    UserService.setUserControl({setHasUser})

    useEffect(() => {
        UserService.setUserControl({ setHasUser });
      }, []);

    setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.11.2/cdn/');

    return (
        <div className="App sl-theme-dark">
            <header className="App-header">
            </header>
            <div className="App-Body">
            {hasUser ?
                    (<Main />) : 
                    (<Login />)
                }
            </div>
        </div>
    );
}

export default App;
