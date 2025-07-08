import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  role?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  role,
  ...rest
}) => {
  const { user, isAuthenticated } = useAuth();
  
  console.log("Protected route:", { isAuthenticated, userRole: user?.role, requiredRole: role });
  
  return (
    <Route
      {...rest}
      render={(props) => {
        // Not logged in, redirect to login
        if (!isAuthenticated) {
          console.log("User not authenticated, redirecting to login");
          return (
            <Redirect 
              to={{ 
                pathname: '/login', 
                state: { from: props.location } 
              }} 
            />
          );
        }
        
        // Wrong role, redirect to home
        if (role && user?.role !== role) {
          console.log("Wrong role, redirecting to home");
          return <Redirect to="/" />;
        }
        
        // Authenticated and correct role, render component
        console.log("Rendering protected component");
        return <Component {...props} />;
      }}
    />
  );
};