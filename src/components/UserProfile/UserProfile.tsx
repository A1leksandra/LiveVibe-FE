import React, { useState, useRef, useEffect } from 'react';
import { userRepository } from '../../repositories/user/userRepository';
import { UserDetails } from '../../repositories/user/UserDetails';
import './UserProfile.css';

interface UserProfileProps {
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadUserData = async () => {
        const response = await userRepository.me();
        if (response.isSuccess && response.data) {
            setUser(response.data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        onLogout();
    };

    if (!user) {
        return null;
    }

    return (
        <div className="user-profile" ref={dropdownRef}>
            <button 
                className="profile-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <div className="avatar">
                    {user.firstName[0]}{user.lastName[0]}
                </div>
            </button>

            {isDropdownOpen && (
                <div className="profile-dropdown">
                    <div className="profile-header">
                        <div className="profile-name">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="profile-email">
                            {user.email}
                        </div>
                    </div>
                    
                    <div className="profile-info">
                        <div className="info-item">
                            <span className="label">Телефон:</span>
                            <span className="value">{user.phone}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button 
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Вийти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile; 