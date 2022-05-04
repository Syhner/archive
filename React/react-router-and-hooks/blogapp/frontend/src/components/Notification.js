import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

const Notification = () => {
  const notification = useSelector(state => state.notification);
  const { message, type } = notification;

  if (message === null) {
    return null;
  }

  const style = {
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <Alert variant={type} id="notification" style={style}>
      {message}
    </Alert>
  );
};

export default Notification;
