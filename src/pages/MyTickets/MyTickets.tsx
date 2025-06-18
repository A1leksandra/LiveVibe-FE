import React, { useEffect, useState } from 'react';
import { ticketRepository } from '../../repositories/ticket/ticketRepository';
import { TicketDetails } from '../../repositories/ticket/TicketDetails';
import './MyTickets.css';

const MyTickets: React.FC = () => {
    const [tickets, setTickets] = useState<TicketDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await ticketRepository.getMyTickets();
                if (response.isSuccess && response.data) {
                    setTickets(response.data);
                    // Fetch QR codes for each ticket
                    response.data.forEach(ticket => {
                        fetch(ticket.qrCodeUrl)
                            .then(res => res.text())
                            .then(svgContent => {
                                setQrCodes(prev => ({
                                    ...prev,
                                    [ticket.id]: svgContent
                                }));
                            })
                            .catch(console.error);
                    });
                } else {
                    setError(response.error?.message || 'Failed to fetch tickets');
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (isLoading) {
        return <div className="tickets-loading">Loading...</div>;
    }

    if (error) {
        return <div className="tickets-error">{error}</div>;
    }

    return (
        <div className="tickets-container">
            <h1>Мої квитки</h1>
            {tickets.length === 0 ? (
                <div className="no-tickets">
                    У вас поки немає квитків
                </div>
            ) : (
                <div className="tickets-grid">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card">
                            <div className="ticket-header">
                                <div className="ticket-event-name">
                                    {ticket.eventName}
                                </div>
                                <div className="ticket-seat">
                                    {ticket.seat}
                                </div>
                            </div>
                            <div className="ticket-qr">
                                {qrCodes[ticket.id] ? (
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: qrCodes[ticket.id] }} 
                                        className="qr-svg-container"
                                    />
                                ) : (
                                    <div className="qr-loading">Loading QR...</div>
                                )}
                            </div>
                            <div className="ticket-footer">
                                <div className="ticket-date">
                                    {new Date(ticket.createdAt).toLocaleDateString('uk-UA', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets; 