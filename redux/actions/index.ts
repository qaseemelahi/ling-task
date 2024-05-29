import { MOUNT_USER_DATA, SEARCH_USER, SET_ERROR, SORT_USER_DATA } from "../types";

export const mountUserData = () => ({
    type: MOUNT_USER_DATA,
  });

export const searchUser = (payload: SearchUserActionPayload) => ({
    type: SEARCH_USER,
    data: payload
});

export const setError = (payload: SetErrorActionPayload) => ({
  type: SET_ERROR,
  data: payload
});

export const sortData = (payload: SortUserActionPayload) => ({
  type: SORT_USER_DATA,
  data: payload
});


