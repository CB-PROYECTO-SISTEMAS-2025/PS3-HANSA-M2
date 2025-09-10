import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/auth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
