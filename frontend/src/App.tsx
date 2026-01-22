import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/ui/Layout';
import { Home } from './pages/public/Home';
import { Donate } from './pages/public/Donate';
import { AnimalDetails } from './pages/public/AnimalDetails';
import { AnimalOnboarding } from './pages/admin/AnimalOnboarding';
import { AnimalManage } from './pages/admin/AnimalManage';
import { Dashboard } from './pages/admin/Dashboard';
import { DonationReview } from './pages/admin/DonationReview';
import { Settings } from './pages/admin/Settings';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { useAuth } from './hooks/useAuth';
import { UserDonations } from './pages/public/UserDonations';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/login" element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } />
            <Route path="/signup" element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            } />

            <Route path="/animals/:id" element={
              <ProtectedRoute>
                <AnimalDetails />
              </ProtectedRoute>
            } />

            <Route path="/my-donations" element={
              <ProtectedRoute>
                <UserDonations />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/animals/new" element={
              <ProtectedRoute>
                <AnimalOnboarding />
              </ProtectedRoute>
            } />
            <Route path="/admin/animals/:id/manage" element={
              <ProtectedRoute>
                <AnimalManage />
              </ProtectedRoute>
            } />
            <Route path="/admin/donations" element={
              <ProtectedRoute>
                <DonationReview />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
