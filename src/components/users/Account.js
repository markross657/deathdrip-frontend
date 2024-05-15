import React, { useState } from 'react';
import UserService from '../../services/UserService';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import UpdateUserDetailsForm from './UpdateUserDetailsForm';
import SlDialog from '@shoelace-style/shoelace/dist/react/dialog';
import AccountOrders from './AccountOrders';

const Account = () => {
    const user = UserService.getUser();

    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [isUpdateImageDialogOpen, setIsUpdateImageDialogOpen] = useState(false)

    const handleFileChange = (e) => {
        setProfileImageFile(e.target.files[0]);
    };

    const openUpdateDialog = () => {
        setIsUpdateDialogOpen(true)
    };

    const closeUpdateDialog = () => {
        setIsUpdateDialogOpen(false)
    }

    const openImageUpdateDialog = () => {
        setIsUpdateImageDialogOpen(true)
    };

    const closeImageUpdateDialog = () => {
        setIsUpdateImageDialogOpen(false)
    }

    const updateUserImage = () => {
        UserService.updateUserImage(profileImageFile)
        closeImageUpdateDialog()
    }

    const getAccountType = () => {
        if (user.accesslevel === 1) {
            return "Customer"
        }
        if (user.accesslevel === 2) {
            return "Barista"
        }
        if (user.accesslevel === 3) {
            return "Manager"
        }
    }

    return (
        <>
            <div className="account-page">
                <h1>Account Information</h1>
                <div className='account-content'>
                    <div className="account-details">
                        <div className="account-information">
                            <div className='info-header'>
                                <h2>{user.firstName + ' ' + user.lastName}</h2>
                                <h3>Account Type: {getAccountType()}</h3>
                            </div>
                            <div className='info-details'>
                                <h3>Join Date:</h3>
                                <p>
                                    {user.joinDate ? user.joinDate : '01/01/2024'}
                                </p>
                            </div>
                            <div>
                                <h3>Bio</h3>
                                <p>{user.bio ? user.bio : "You have not entered a bio yet."}</p>
                            </div>
                            <SlButton onClick={() => openUpdateDialog()}>Update Information</SlButton>
                        </div>
                        <div className="account-avatar">
                            <img
                                width="200px"
                                src={profileImageFile ? URL.createObjectURL(profileImageFile) : './ObsidianFox.png'}
                                alt="User Display"
                            />
                            <div>
                                <SlButton size='small' variant='warning' onClick={() => openImageUpdateDialog()}>Update Profile Image</SlButton>
                            </div>
                        </div>

                    </div>
                    <div className='account-orders-container'>
                        {user.accesslevel === 1 && <AccountOrders user={user} />}
                    </div>
                </div>
            </div>

            {isUpdateDialogOpen && <UpdateUserDetailsForm closeUpdateDialog={closeUpdateDialog} />}
            <SlDialog onSlHide={() => closeImageUpdateDialog()} className='account-image-dialog' open={isUpdateImageDialogOpen}>
                <div className="input-group">
                    <h4>Select your new profile image</h4>
                    <img
                        width="200px"
                        src={profileImageFile ? URL.createObjectURL(profileImageFile) : './ObsidianFox.png'}
                        alt="User Display"
                    />
                    <input
                        size="small"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <SlButton size='small' onClick={() => updateUserImage()} variant='warning'>Update</SlButton>
                </div>
            </SlDialog>
        </>
    );
};

export default Account;
