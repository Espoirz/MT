import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Horses from './pages/Horses';
import WildHorseCapture from './pages/WildHorseCapture';
import Dogs from './pages/Dogs';
import DogCapture from './pages/DogCapture';
import DogShelter from './pages/DogShelter';
import Events from './pages/Events';
import Breeding from './pages/Breeding';
import Forums from './pages/Forums';
import Messages from './pages/Messages';

// Context
import { AuthProvider } from './context/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AuthProvider>
      <AppContainer>
        <Router>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/horses" element={
                <ProtectedRoute>
                  <Horses />
                </ProtectedRoute>
              } />
              
              <Route path="/horses/capture" element={
                <ProtectedRoute>
                  <WildHorseCapture />
                </ProtectedRoute>
              } />
              
              <Route path="/dogs" element={
                <ProtectedRoute>
                  <Dogs />
                </ProtectedRoute>
              } />
              
              <Route path="/dogs/capture" element={
                <ProtectedRoute>
                  <DogCapture />
                </ProtectedRoute>
              } />
              
              <Route path="/dogs/shelter" element={
                <ProtectedRoute>
                  <DogShelter />
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              
              <Route path="/breeding" element={
                <ProtectedRoute>
                  <Breeding />
                </ProtectedRoute>
              } />
              
              <Route path="/forums" element={
                <ProtectedRoute>
                  <Forums />
                </ProtectedRoute>
              } />
              
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
            </Routes>
          </MainContent>
          <Toaster position="top-right" />
        </Router>
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
