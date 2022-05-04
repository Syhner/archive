import './Notification.css';

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
