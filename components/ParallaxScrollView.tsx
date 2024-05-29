import type { PropsWithChildren, ReactNode } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "./ThemedText";
import { useTheme, MD3Theme as PaperTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HelloWave } from "./HelloWave";

const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  headerTitle: string;
  rightComponent: ReactNode;
}>;

export default function ParallaxScrollView({
  children,
  headerTitle,
  rightComponent,
}: Props) {
  const theme = useTheme();
  const background = useThemeColor({}, "background");
  const styles = createStyles({ background });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.row}>
        <View />
        <ThemedText type="title" style={styles.headerTitle}>
          {headerTitle} <HelloWave />
        </ThemedText>
        {rightComponent}
      </View>
      <View style={styles.headerContainer}>{children}</View>
    </SafeAreaView>
  );
}

const createStyles = (theme: { background: string }) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: StatusBar.currentHeight,
    },
    headerTitle: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
    },
    headerContainer: {
      marginHorizontal: 20,
    },
    row: {
      height: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
