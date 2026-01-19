import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/ui/Layout';
import { Home } from './pages/public/Home';
import { AnimalDetails } from './pages/public/AnimalDetails';
import { AnimalOnboarding } from './pages/admin/AnimalOnboarding';
import { AnimalManage } from './pages/admin/AnimalManage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/animals/:id" element={<AnimalDetails />} />

            {/* Admin Routes - In real app, these would be protected */}
            <Route path="/admin" element={<Navigate to="/admin/animals/new" replace />} />
            <Route path="/admin/animals/new" element={<AnimalOnboarding />} />
            <Route path="/admin/animals/:id/manage" element={<AnimalManage />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
