import { FlatList, StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CustomTextInput from "@/components/CustomTextInput";
import {
  useTheme,
  TextInput,
  Button,
  DataTable,
  Snackbar,
} from "react-native-paper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mountUserData, searchUser, setError, sortData } from "@/redux/actions";
import { ThemedText } from "@/components/ThemedText";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/redux";

export default function HomeScreen() {
  //colors
  const magenta = useThemeColor({}, "magenta");
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const styles = homeScreenStyle({ magenta, background, textColor });

  // useStates
  const [searchedUser, setSearchedUser] = useState("");

  const { filteredUsers, searchedUserId, error } = useAppSelector(
    (state) => state.user
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(mountUserData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchUser({ keyword: searchedUser, hideError: true }));
  }, [searchedUser]);

  const handleSearch = () => {
    dispatch(searchUser({ keyword: searchedUser }));
  };

  const sortByName = () => {
    dispatch(sortData({ direction: sortDirection, field: "name" }));
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const lowestRanksUser = () => {
    dispatch(sortData({ direction: sortDirection, field: "bananas" }));
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const onDismissSnackBar = () => dispatch(setError({ error: "" }));
  const isTopUser = useMemo(() => filteredUsers.length > 0, [filteredUsers]);

  const renderTableItem = useCallback(
    ({ item }: { item: UserData }) => {
      return (
        <DataTable.Row
          key={item.uid}
          style={item.uid === searchedUserId && styles.highlightedRow}
        >
          <DataTable.Cell>{item.rank}</DataTable.Cell>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell numeric>{item.bananas}</DataTable.Cell>
        </DataTable.Row>
      );
    },
    [searchedUserId]
  );

  return (
    <>
      <ParallaxScrollView
        headerTitle="Home"
        rightComponent={
          isTopUser && (
            <Menu style={styles.popMenuContainer}>
              <MenuTrigger>
                <View style={styles.row}>
                  <ThemedText style={styles.sortByText}>Sort by</ThemedText>
                  <FontAwesome name="sort" size={18} color={textColor} />
                </View>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.menuOptions}>
                <MenuOption onSelect={lowestRanksUser}>
                  <ThemedText style={styles.sortByText}>lowest rank</ThemedText>
                </MenuOption>
                <MenuOption onSelect={sortByName}>
                  <ThemedText>name</ThemedText>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )
        }
      >
        <View style={styles.inputContainer}>
          <CustomTextInput
            returnKeyLabel="Search"
            left={
              <TextInput.Icon
                icon="magnify"
                color={theme.colors.secondary}
                size={18}
                onPress={handleSearch}
              />
            }
            value={searchedUser}
            onChangeText={setSearchedUser}
            placeholder="Enter username"
            placeholderTextColor={"grey"}
          />
          <Button onPress={handleSearch}>Search</Button>
        </View>
        {isTopUser ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Rank</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title numeric>Bananas</DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={filteredUsers}
              style={styles.flatListStyle}
              renderItem={renderTableItem}
              showsVerticalScrollIndicator={false}
            />
          </DataTable>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText>No Data Found</ThemedText>
          </View>
        )}
      </ParallaxScrollView>
      {/* Alert & Modals & Snacks */}
      <Snackbar
        visible={!!error}
        style={{ backgroundColor: "red" }}
        onDismiss={onDismissSnackBar}
        duration={5000}
        action={{
          labelStyle: { color: background },
          label: "Hide",
        }}
      >
        <ThemedText type="default" style={styles.snackBarText}>
          {error}
        </ThemedText>
      </Snackbar>
    </>
  );
}

const homeScreenStyle = (theme: {
  magenta: string;
  background: string;
  textColor: string;
}) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 15,
    },
    sortButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 15,
    },
    highlightedRow: {
      backgroundColor: theme.magenta,
    },
    snackBarText: {
      color: theme.background,
    },
    lowestRankBtn: {
      alignSelf: "flex-end",
      marginTop: 10,
    },
    lowestRankText: {
      fontSize: 12,
    },
    popMenuContainer: {
      marginRight: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuOptions: {
      marginTop: 25,
      borderRadius: 5,
      paddingHorizontal: 10,
      width: 130,
      backgroundColor: theme.background,
    },
    sortByText: {
      paddingRight: 5,
      color: theme.textColor,
    },
    emptyContainer: {
      height: "90%",
      justifyContent: "center",
      alignItems: "center",
    },
    flatListStyle: { marginBottom: 250 },
  });
