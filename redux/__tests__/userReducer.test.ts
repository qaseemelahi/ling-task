import userReducer from "../reducer/userReducer";
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

describe("userReducer", () => {
  const initialState: UserState = {
    allUsers: [],
    filteredUsers: [],
    error: "",
    searchedUserId: null,
  };

  it("should return the initial state", () => {
    expect(userReducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle MOUNT_USER_DATA", () => {
    const action = { type: MOUNT_USER_DATA };
    const sortedUsers: UserData[] = Object.entries(leaderboard)
      .sort(([, a], [, b]) => b.bananas - a.bananas)
      .map(([uid, userData], index) => ({
        ...userData,
        uid,
        rank: index + 1,
      }));

    const expectedState: UserState = { ...initialState, allUsers: sortedUsers };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle SORT_USER_DATA", () => {
    const state: UserState = {
      ...initialState,
      filteredUsers: [
        {
          uid: "1",
          name: "Alice",
          bananas: 10,
          rank: 1,
          lastDayPlayed: "2024-05-01",
          longestStreak: 5,
          stars: 10,
          subscribed: true,
        },
        {
          uid: "2",
          name: "Bob",
          bananas: 20,
          rank: 2,
          lastDayPlayed: "2024-05-02",
          longestStreak: 3,
          stars: 20,
          subscribed: false,
        },
      ],
    };

    const action = {
      type: SORT_USER_DATA,
      data: { field: "name", direction: "asc" },
    };

    const expectedState: UserState = {
      ...state,
      filteredUsers: [
        {
          uid: "1",
          name: "Alice",
          bananas: 10,
          rank: 1,
          lastDayPlayed: "2024-05-01",
          longestStreak: 5,
          stars: 10,
          subscribed: true,
        },
        {
          uid: "2",
          name: "Bob",
          bananas: 20,
          rank: 2,
          lastDayPlayed: "2024-05-02",
          longestStreak: 3,
          stars: 20,
          subscribed: false,
        },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    };

    expect(userReducer(state, action)).toEqual(expectedState);
  });

  it("should handle SEARCH_USER", () => {
    const state: UserState = {
      ...initialState,
      allUsers: [
        {
          uid: "1",
          name: "Alice",
          bananas: 10,
          rank: 1,
          lastDayPlayed: "2024-05-01",
          longestStreak: 5,
          stars: 10,
          subscribed: true,
        },
        {
          uid: "2",
          name: "Bob",
          bananas: 20,
          rank: 2,
          lastDayPlayed: "2024-05-02",
          longestStreak: 3,
          stars: 20,
          subscribed: false,
        },
      ],
    };

    const action = {
      type: SEARCH_USER,
      data: { keyword: "Alice", hideError: false },
    };

    const expectedState: UserState = {
      ...state,
      searchedUserId: "1",
      error: "",
      filteredUsers: [
        {
          bananas: 10,
          lastDayPlayed: "2024-05-01",
          longestStreak: 5,
          name: "Alice",
          rank: 1,
          stars: 10,
          subscribed: true,
          uid: "1",
        },
        {
          bananas: 20,
          lastDayPlayed: "2024-05-02",
          longestStreak: 3,
          name: "Bob",
          rank: 2,
          stars: 20,
          subscribed: false,
          uid: "2",
        },
      ],
    };

    expect(userReducer(state, action)).toEqual(expectedState);
  });

  it("should handle SEARCH_USER with no keyword", () => {
    const state: UserState = {
      ...initialState,
      allUsers: [
        {
          uid: "1",
          name: "Alice",
          bananas: 10,
          rank: 1,
          lastDayPlayed: "2024-05-01",
          longestStreak: 5,
          stars: 10,
          subscribed: true,
        },
        {
          uid: "2",
          name: "Bob",
          bananas: 20,
          rank: 2,
          lastDayPlayed: "2024-05-02",
          longestStreak: 3,
          stars: 20,
          subscribed: false,
        },
      ],
    };

    const action = {
      type: SEARCH_USER,
      data: { keyword: "", hideError: false },
    };

    const expectedState: UserState = {
      ...initialState,
      allUsers: state.allUsers,
    };

    expect(userReducer(state, action)).toEqual(expectedState);
  });

  it("should handle sorting users by different fields in ascending order", () => {
    const state: UserState = {
      ...initialState,
      filteredUsers: [
        { uid: "1", name: "Alice", bananas: 10, rank: 1, lastDayPlayed: "2024-05-01", longestStreak: 5, stars: 10, subscribed: true },
        { uid: "2", name: "Bob", bananas: 20, rank: 2, lastDayPlayed: "2024-05-02", longestStreak: 3, stars: 20, subscribed: false },
      ],
    };
  
    const action = {
      type: SORT_USER_DATA,
      data: { field: "stars", direction: "asc" },
    };
  
    const expectedState: UserState = {
      ...state,
      filteredUsers: [
        { uid: "1", name: "Alice", bananas: 10, rank: 1, lastDayPlayed: "2024-05-01", longestStreak: 5, stars: 10, subscribed: true },
        { uid: "2", name: "Bob", bananas: 20, rank: 2, lastDayPlayed: "2024-05-02", longestStreak: 3, stars: 20, subscribed: false },
      ].sort((a, b) => a.stars - b.stars),
    };
  
    expect(userReducer(state, action)).toEqual(expectedState);
  });
  
  it("should handle empty search results", () => {
    const state: UserState = {
      ...initialState,
      allUsers: [
        { uid: "1", name: "Alice", bananas: 10, rank: 1, lastDayPlayed: "2024-05-01", longestStreak: 5, stars: 10, subscribed: true },
        { uid: "2", name: "Bob", bananas: 20, rank: 2, lastDayPlayed: "2024-05-02", longestStreak: 3, stars: 20, subscribed: false },
      ],
    };
  
    const action = {
      type: SEARCH_USER,
      data: { keyword: "Charlie", hideError: false },
    };
  
    const expectedState: UserState = {
      ...state,
      error: "This username does not exist! Please specify an existing user name!",
      filteredUsers: [],
    };
  
    expect(userReducer(state, action)).toEqual(expectedState);
  });
  
  it("should handle hiding error in SEARCH_USER action", () => {
    const state: UserState = {
      ...initialState,
      allUsers: [
        { uid: "1", name: "Alice", bananas: 10, rank: 1, lastDayPlayed: "2024-05-01", longestStreak: 5, stars: 10, subscribed: true },
        { uid: "2", name: "Bob", bananas: 20, rank: 2, lastDayPlayed: "2024-05-02", longestStreak: 3, stars: 20, subscribed: false },
      ],
    };
  
    const action = {
      type: SEARCH_USER,
      data: { keyword: "Charlie", hideError: true },
    };
  
    const expectedState: UserState = {
      ...state,
      filteredUsers: [],
    };
  
    expect(userReducer(state, action)).toEqual(expectedState);
  });

  it("should handle SET_ERROR", () => {
    const action = {
      type: SET_ERROR,
      data: { error: "An error occurred" },
    };

    const expectedState: UserState = {
      ...initialState,
      error: "An error occurred",
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
});
