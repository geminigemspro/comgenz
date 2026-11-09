import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Conversation from './pages/Conversation';
import Login from './pages/Login';
import Invite from './pages/Invite';

// Import Supabase service
import { supabase, authService } from './services/supabaseService';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(true);

  // Handle authentication state changes
  useEffect(() => {
    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      setLoading(false);
      
      if (session?.user) {
        setUser(session.user);
        setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('login');
      }
    });

    // Check current session
    const checkSession = async () => {
      try {
        const { data, error } = await authService.getCurrentUser();
        if (!error && data?.user) {
          setUser(data.user);
          setCurrentView('dashboard');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) throw error;
      
      // Login successful - user will be redirected by auth state change listener
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setCurrentView('login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render different views based on user state
  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'invite':
        return <Invite />;
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} />;
      case 'conversation':
        return <Conversation />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;