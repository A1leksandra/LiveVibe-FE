import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { userRepository } from '../../repositories/user/userRepository';
import { UserDetailsWithOrders } from '../../repositories/user/UserDetails';
import './UserDetails.css';

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserDetailsWithOrders | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!id) return;
            
            try {
                const response = await userRepository.getUserById(id);
                if (response.isSuccess && response.data) {
                    setUser(response.data);
                } else {
                    setError(response.error?.message || 'Failed to fetch user details');
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    if (isLoading) {
        return <div className="user-details-page">Loading...</div>;
    }

    if (error || !user) {
        return (
            <div className="user-details-page">
                <div className="error-message">{error || 'User not found'}</div>
                <Button variant="outlined" onClick={() => navigate('/users')}>
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="user-details-page">
            <div className="page-header">
                <h1>Деталі користувача</h1>
                <Button variant="outlined" onClick={() => navigate('/users')}>
                    Назад до списку
                </Button>
            </div>

            <Card className="user-info-card">
                <div className="user-header">
                    <div className="user-avatar">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="user-main-info">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                    </div>
                </div>
                <div className="user-metadata">
                    <div className="metadata-item">
                        <span>Створено:</span>
                        <span>{new Date(user.createdAt).toLocaleDateString('uk-UA')}</span>
                    </div>
                    <div className="metadata-item">
                        <span>Оновлено:</span>
                        <span>{new Date(user.updatedAt).toLocaleDateString('uk-UA')}</span>
                    </div>
                </div>
            </Card>

            <div className="orders-section">
                <h2>Замовлення</h2>
                {user.orders.length === 0 ? (
                    <p className="no-orders">Користувач ще не має замовлень</p>
                ) : (
                    <div className="orders-grid">
                        {user.orders.map(order => (
                            <Card key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3>Замовлення #{order.id.slice(0, 8)}</h3>
                                    <span className={`order-status ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <p>
                                        <strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                                    </p>
                                    <p>
                                        <strong>Ім'я:</strong> {order.firstname} {order.lastname}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {order.email}
                                    </p>
                                </div>
                                <div className="tickets-list">
                                    <h4>Квитки:</h4>
                                    {order.tickets.map(ticket => (
                                        <div key={ticket.id} className="ticket-item">
                                            <span className="event-name">{ticket.eventName}</span>
                                            <span className="seat-info">{ticket.seat}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails; 