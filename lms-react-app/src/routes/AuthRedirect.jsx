import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../login/Login';

const AuthRedirect = ({ authUser, adminPath, userPath }) => {
  return authUser ? (
    authUser.user.isAdmin ? <Navigate to={adminPath} /> : <Navigate to={userPath} />
  ) : (
    <Login />
  );
};

export default AuthRedirect;
