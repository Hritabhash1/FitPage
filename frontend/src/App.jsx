import React, { useEffect, useState } from 'react';
import Login from './Components/Login';
import ProductList from './Components/ProductList';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <Login setUser={(user) => {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }} />
      ) : (
        <ProductList user={user} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
