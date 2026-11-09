import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Conversation from './pages/Conversation';
import Login from './pages/Login';
import Invite from './pages/Invite';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [supabase, setSupabase] = useState(null);

  // Initialize Supabase
  useEffect(() => {
    // This would be replaced with actual Supabase initialization
    // For now, we'll simulate the setup
    console.log('Initializing Supabase client...');
    
    // Mock Supabase instance for demonstration
    const mockSupabase = {
      auth: {
        onAuthStateChange: () => {},
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: (credentials) => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null })
      }
    };
    
    setSupabase(mockSupabase);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentView('dashboard');
        } else {
          setUser(null);
          setCurrentView('login');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [supabase]);

  // Render different views based on user state
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={() => setCurrentView('dashboard')} />;
      case 'invite':
        return <Invite />;
      case 'dashboard':
        return <Dashboard user={user} onLogout={() => setCurrentView('login')} />;
      case 'conversation':
        return <Conversation />;
      default:
        return <Login onLogin={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="App">
      <Header user={user} onLogout={() => setCurrentView('login')} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;