import {React} from 'react';
import UserService from '../../services/UserService';
import SlButton from '@shoelace-style/shoelace/dist/react/button';

const LogoutButton = () => {        
    const onLogout = () => {
        UserService.logout()
    }

    return (
        <SlButton onClick={onLogout}>
            Logout
        </SlButton>
    );
};

export default LogoutButton;
