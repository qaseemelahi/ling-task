// global.d.ts

declare global {
    interface UserData {
      bananas: number;
      lastDayPlayed: string;
      longestStreak: number;
      name: string;
      stars: number;
      subscribed: boolean;
      uid: string;
      rank: number;
    }
    type SortUserActionPayload = {
      field: 'name' | 'bananas' | 'rank';
      direction: 'asc' | 'desc';
    }
    interface SortUserActionTypes {
      type: string;
      data: SortUserActionPayload;
    }

    type SearchUserActionPayload = {
      keyword: string;
      hideError?: boolean;
    };
    interface SearchUserActionTypes {
      type: string;
      data: SearchUserActionPayload;
    }
    interface MountUserActionTypes {
      type: string;
    }


    type SetErrorActionPayload = {
      error: string;
    };
    interface SetErrorActionTypes {
      type: string;
      data: SetErrorActionPayload;
    }
    
  }
  
  export {}; // This ensures the file is treated as a module
  