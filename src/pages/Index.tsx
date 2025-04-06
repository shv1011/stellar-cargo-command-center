
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // This is just a redirect to either login or dashboard
  return <Navigate to="/" replace />;
};

export default Index;
