import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/auth-context';

interface ProtectedRouteProps extends Omit<RouteProps, 'component'> {
  roles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  roles = [], 
  children, 
  ...rest 
}) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        // Not authenticated
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          );
        }
        
        // No specific roles required or user has required role
        if (roles.length === 0 || (user && roles.includes(user.role))) {
          return children;
        }
        
        // User doesn't have required role
        return (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};