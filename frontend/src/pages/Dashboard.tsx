import React from 'react';
import { useAuth } from '../context/AuthContext';
import RecruiterDashboard from '../components/RecruiterDashboard';
import CandidateDashboard from '../components/CandidateDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      {user?.role === 'recruiter' ? (
        <RecruiterDashboard />
      ) : (
        <CandidateDashboard />
      )}
    </div>
  );
};

export default Dashboard;
