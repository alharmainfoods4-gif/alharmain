import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
    const { user, token, login } = useAuth();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileStatus({ type: '', message: '' });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.status === 'success' || data.success) {
                setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
                // Update local storage and context
                login(data.data?.user || data.user, token);
            } else {
                setProfileStatus({ type: 'error', message: data.message || 'Failed to update profile' });
            }
        } catch (err) {
            setProfileStatus({ type: 'error', message: 'Connection error. Please try again.' });
        } finally {
            setProfileLoading(false);
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setPasswordLoading(true);
        setPasswordStatus({ type: '', message: '' });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/auth/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.status === 'success' || data.success) {
                setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordStatus({ type: 'error', message: data.message || 'Failed to update password' });
            }
        } catch (err) {
            setPasswordStatus({ type: 'error', message: 'Connection error. Please try again.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account and application preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        Profile Settings
                    </h3>

                    {profileStatus.message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 mb-4 text-sm ${profileStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {profileStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {profileStatus.message}
                        </div>
                    )}

                    <form onSubmit={updateProfile} className="space-y-4">
                        <FormInput
                            label="Full Name"
                            name="name"
                            type="text"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            placeholder="Enter your full name"
                            required
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            placeholder="Enter your email"
                            required
                        />
                        <FormInput
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            placeholder="Enter your phone number"
                        />
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-900 dark:text-white">Address</label>
                            <textarea
                                name="address"
                                value={profileData.address}
                                onChange={handleProfileChange}
                                className="input min-h-[100px]"
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2">
                                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Settings */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Security Settings
                    </h3>

                    {passwordStatus.message && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 mb-4 text-sm ${passwordStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {passwordStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {passwordStatus.message}
                        </div>
                    )}

                    <form onSubmit={updatePassword} className="space-y-4">
                        <FormInput
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                        />
                        <FormInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                        />
                        <FormInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                        />
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={passwordLoading} className="btn-primary flex items-center gap-2">
                                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
