// src/redux/userReducer.ts

import {
  MOUNT_USER_DATA,
  SEARCH_USER,
  SET_ERROR,
  SORT_USER_DATA,
} from "../types";
import leaderboard from "@/assets/data/leaderboard.json";

interface UserState {
  allUsers: UserData[];
  filteredUsers: UserData[];
  error: string;
  searchedUserId: null | string;
}

const initialState: UserState = {
  allUsers: [],
  filteredUsers: [],
  error: "",
  searchedUserId: null,
};

const userReducer = (
  state = initialState,
  action:
    | SortUserActionTypes
    | SearchUserActionTypes
    | MountUserActionTypes
    | SetErrorActionTypes
): UserState => {
  switch (action.type) {
    case MOUNT_USER_DATA:
      const allUsers: UserData[] = Object.entries(leaderboard)
        .sort(([, a], [, b]) => b.bananas - a.bananas)
        .map(([uid, userData], index) => ({
          ...userData,
          uid,
          rank: index + 1,
        }));
      return { ...state, allUsers };

    case SORT_USER_DATA:
      const users = [...state.filteredUsers];
      const {
        data: { field, direction },
      } = action as SortUserActionTypes;
      users.sort((a, b) => {
        if (field === "name") {
          return direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        return (
          (direction === "asc" ? a[field] - b[field] : b[field] - a[field]) ||
          a.name.localeCompare(b.name)
        );
      });
      return { ...state, filteredUsers: users };

    case SEARCH_USER:
      let searchedUsers = [...state.allUsers];
      const {
        data: { keyword, hideError },
      } = action as SearchUserActionTypes;
      if (!keyword) {
        return { ...initialState, allUsers: state.allUsers };
      }
      const searchedUserName = keyword.toLowerCase().trim();
      const userIndex = searchedUsers.findIndex((u) =>
        u.name.toLowerCase().includes(searchedUserName)
      );
      if (userIndex === -1) {
        // in case of fuzzy search we don't need to show error
        return {
          ...state,
          error: !hideError
            ? "This username does not exist! Please specify an existing user name!"
            : "",
          searchedUserId: null,
          ...(!hideError
            ? { filteredUsers: state.filteredUsers }
            : { filteredUsers: [] }),
        };
      }
      let user = searchedUsers[userIndex];
      searchedUsers = searchedUsers.slice(0, 10);
      const userIndexInTop10 = searchedUsers.findIndex(
        (u) => u.uid === user.uid
      );
      if (userIndexInTop10 !== -1) {
        return {
          ...state,
          searchedUserId: user.uid,
          filteredUsers: searchedUsers,
        };
      }

      searchedUsers[9] = { ...user };
      console.log(
        "...state,",
        {
          ...state,
          searchedUserId: user.uid,
          filteredUsers: searchedUsers,
        }
      );

      return {
        ...state,
        searchedUserId: user.uid,
        filteredUsers: searchedUsers,
      };

    case SET_ERROR:
      const {
        data: { error },
      } = action as SetErrorActionTypes;
      return { ...state, error };

    default:
      return state;
  }
};

export default userReducer;
