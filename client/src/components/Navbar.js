import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaHorse, FaDog, FaTrophy, FaUser, FaSignOutAlt, FaHeart, FaComments, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4a5568;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #4a5568;
`;

const Currency = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(229, 62, 62, 0.1);
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <FaHorse />
          MT Breeding
        </Logo>
        
        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">
                <FaHome /> Dashboard
              </NavLink>
              <NavLink to="/horses">
                <FaHorse /> Horses
              </NavLink>
              <NavLink to="/dogs">
                <FaDog /> Dogs
              </NavLink>
              <NavLink to="/events">
                <FaTrophy /> Events
              </NavLink>
              <NavLink to="/breeding">
                <FaHeart /> Breeding
              </NavLink>
              <NavLink to="/forums">
                <FaComments /> Forums
              </NavLink>
              <NavLink to="/messages">
                <FaEnvelope /> Messages
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>

        {isAuthenticated && user && (
          <UserInfo>
            <Currency>
              💰 {user.coins || 0}
            </Currency>
            <Currency>
              💎 {user.gems || 0}
            </Currency>
            <span>
              <FaUser /> {user.username}
            </span>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
            </LogoutButton>
          </UserInfo>
        )}
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
