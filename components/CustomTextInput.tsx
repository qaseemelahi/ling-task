import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CustomTextInputProps extends TextInputProps {
  innerRef?: React.RefObject<typeof TextInput>;
  style?: ViewStyle | TextStyle;
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const { style, mode = "outlined", ...others } = props;
  const borderColor = useThemeColor({}, 'gray');
  
  const styles = textInputStyles({ borderColor });

  return (
    <TextInput
      mode={mode}
      {...others}
      activeOutlineColor={borderColor}
      style={[styles.textInput, style]}
      outlineColor={styles.outlineStyle.borderColor}
    />
  );
};

const textInputStyles = (theme: { borderColor: string }) =>
  StyleSheet.create({
    textInput: {
      width: "75%",
      height: 40,
      fontSize: 16,
      padding: 0,
      fontFamily: "PoppinsSemiBold",
      justifyContent: "center",
    },
    outlineStyle: {
      borderColor: theme.borderColor,
      borderWidth: 0.5,
    },
  });

export default CustomTextInput;
