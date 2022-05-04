import { connect } from 'react-redux';

const Notification = props => {
  const notification = props.notification.message;
  if (!notification) return null;

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  return <div style={style}>{notification}</div>;
};

const mapStateToProps = state => {
  return {
    notification: state.notification,
  };
};

const connectedNotification = connect(mapStateToProps)(Notification);
export default connectedNotification;
