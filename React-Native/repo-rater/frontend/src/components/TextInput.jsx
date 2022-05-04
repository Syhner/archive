import { TextInput as NativeTextInput } from 'react-native';

import theme from '../theme';

const TextInput = ({ style, ...props }) => {
  const textInputStyle = [{ fontFamily: theme.fonts.main }, style];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
