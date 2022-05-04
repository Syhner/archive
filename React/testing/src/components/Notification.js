import React from 'react';
import './Notification.css';

const Notification = ({ notification }) => {
  if (!notification || !notification.message) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
