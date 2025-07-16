import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 5px;
`;

const StatSubtext = styled.div`
  font-size: 0.9rem;
  color: #95a5a6;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#2980b9' : '#d5dbdb'};
  }
`;

const ContentPanel = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => {
    switch (props.type) {
      case 'admin': return '#e74c3c';
      case 'premium': return '#f39c12';
      case 'basic': return '#95a5a6';
      default: return '#3498db';
    }
  }};
  color: white;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin: 0 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background: ${props => props.danger ? '#e74c3c' : '#3498db'};
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.danger ? '#c0392b' : '#2980b9'};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 15px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #c0392b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
`;

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    loadDashboardStats();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'animals') {
      loadAnimals();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setDashboardStats(response.data.data);
    } catch (error) {
      setError('Failed to load dashboard stats');
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error loading users:', error);
    }
  };

  const loadAnimals = async () => {
    try {
      const response = await api.get('/api/admin/animals');
      setAnimals(response.data.data);
    } catch (error) {
      setError('Failed to load animals');
      console.error('Error loading animals:', error);
    }
  };

  const handleUserUpdate = async (userId, updates) => {
    try {
      await api.put(`/api/admin/users/${userId}`, updates);
      loadUsers();
    } catch (error) {
      setError('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        loadUsers();
      } catch (error) {
        setError('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleMoveDogToShelter = async (dogId) => {
    try {
      await api.post(`/api/admin/dogs/${dogId}/shelter`);
      loadAnimals();
    } catch (error) {
      setError('Failed to move dog to shelter');
      console.error('Error moving dog to shelter:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnimals = animals.filter(animal => 
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner>Loading admin dashboard...</LoadingSpinner>;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <Title>🛡️ Admin Dashboard</Title>
        <Subtitle>Welcome back, {user?.username}!</Subtitle>
      </AdminHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabsContainer>
        <Tab active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
        <Tab active={activeTab === 'animals'} onClick={() => setActiveTab('animals')}>
          Animals
        </Tab>
      </TabsContainer>

      {activeTab === 'dashboard' && dashboardStats && (
        <div>
          <h3>User Statistics</h3>
          <StatsGrid>
            <StatCard>
              <StatValue>{dashboardStats.users.total}</StatValue>
              <StatLabel>Total Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{dashboardStats.users.premium}</StatValue>
              <StatLabel>Premium Users</StatLabel>
              <StatSubtext>{dashboardStats.users.basic} Basic Users</StatSubtext>
            </StatCard>
            <StatCard>
              <StatValue>{dashboardStats.users.admins}</StatValue>
              <StatLabel>Admin Users</StatLabel>
            </StatCard>
          </StatsGrid>

          <h3>Animal Statistics</h3>
          <StatsGrid>
            <StatCard>
              <StatValue>{dashboardStats.dogs.total}</StatValue>
              <StatLabel>Total Dogs</StatLabel>
              <StatSubtext>{dashboardStats.dogs.wild} Wild | {dashboardStats.dogs.adopted} Adopted</StatSubtext>
            </StatCard>
            <StatCard>
              <StatValue>{dashboardStats.dogs.inShelter}</StatValue>
              <StatLabel>Dogs in Shelter</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{dashboardStats.horses.total}</StatValue>
              <StatLabel>Total Horses</StatLabel>
              <StatSubtext>{dashboardStats.horses.wild} Wild | {dashboardStats.horses.owned} Owned</StatSubtext>
            </StatCard>
          </StatsGrid>
        </div>
      )}

      {activeTab === 'users' && (
        <ContentPanel>
          <h3>User Management</h3>
          <SearchInput
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Table>
            <thead>
              <tr>
                <TableHeader>Username</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Membership</TableHeader>
                <TableHeader>Coins</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge type={user.role}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge type={user.membershipTier}>{user.membershipTier}</Badge>
                  </TableCell>
                  <TableCell>{user.coins?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleUserUpdate(user._id, { membershipTier: user.membershipTier === 'basic' ? 'premium' : 'basic' })}>
                      Toggle Premium
                    </ActionButton>
                    <ActionButton danger onClick={() => handleUserDelete(user._id)}>
                      Delete
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ContentPanel>
      )}

      {activeTab === 'animals' && (
        <ContentPanel>
          <h3>Animal Management</h3>
          <SearchInput
            type="text"
            placeholder="Search animals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Table>
            <thead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Breed</TableHeader>
                <TableHeader>Owner</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredAnimals.map(animal => (
                <TableRow key={animal._id}>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.animalType}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.owner?.username || 'None'}</TableCell>
                  <TableCell>
                    {animal.shelterEntry ? 'In Shelter' : 
                     animal.isWild ? 'Wild' : 
                     animal.owner ? 'Owned' : 'Available'}
                  </TableCell>
                  <TableCell>
                    {animal.animalType === 'dog' && animal.owner && (
                      <ActionButton onClick={() => handleMoveDogToShelter(animal._id)}>
                        Move to Shelter
                      </ActionButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ContentPanel>
      )}
    </AdminContainer>
  );
}

export default AdminDashboard;
