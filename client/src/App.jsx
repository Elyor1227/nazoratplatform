import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import CompanyDashboard from './pages/dashboards/CompanyDashboard.jsx';
import GasnDashboard from './pages/dashboards/GasnDashboard.jsx';
import TaxDashboard from './pages/dashboards/TaxDashboard.jsx';
import LaborDashboard from './pages/dashboards/LaborDashboard.jsx';

const ROLE_HOME = {
  construction_company: '/app/company',
  gasn: '/app/gasn',
  tax_inspection: '/app/tax',
  labor_inspection: '/app/labor',
};

function PrivateRoute({ children, roles }) {
  const { token, user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app/company"
        element={
          <PrivateRoute roles={['construction_company']}>
            <CompanyDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/gasn"
        element={
          <PrivateRoute roles={['gasn']}>
            <GasnDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/tax"
        element={
          <PrivateRoute roles={['tax_inspection']}>
            <TaxDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/app/labor"
        element={
          <PrivateRoute roles={['labor_inspection']}>
            <LaborDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
