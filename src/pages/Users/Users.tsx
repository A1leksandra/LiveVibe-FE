import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { userRepository } from '../../repositories/user/userRepository';
import { UserDetails } from '../../repositories/user/UserDetails';
import './Users.css';

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await userRepository.getAllUsers({
        pageNumber: currentPage,
        pageSize,
        request: undefined
      });

      if (response.isSuccess && response.data) {
        setUsers(response.data.items);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="users-page">Loading...</div>;
  }

  return (
    <div className="users-page">
      <h1>Користувачі</h1>
      <div className="users-grid">
        {users.map(user => (
          <Card key={user.id} className="user-card">
            <div className="user-info">
              <div className="user-avatar">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="user-details">
                <h3>{user.firstName} {user.lastName}</h3>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
            </div>
            <Button
              variant="outlined"
              className="details-button"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              Деталі
            </Button>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;