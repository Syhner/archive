import React from 'react';

const User = ({ user, setUser }) => {
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser('');
  };

  if (!user) return null;
  return (
    <div>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default User;
