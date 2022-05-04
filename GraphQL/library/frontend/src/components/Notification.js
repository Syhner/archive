import React from 'react';

const Notification = ({ notification }) => {
  if (!notification || !notification.message) {
    return null;
  }
  return (
    <h2
      style={{
        color: notification.type === 'success' ? 'green' : 'red',
        padding: '5px',
      }}
    >
      {notification.message}
    </h2>
  );
};

export default Notification;
