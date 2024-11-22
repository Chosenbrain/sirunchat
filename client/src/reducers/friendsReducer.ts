import { Reducer } from "redux";
import {
    FriendsActions,
    actionTypes,
    PendingInvitation,
    Friend,
    OnlineUser,
    GroupChatDetails
} from "../actions/types";

// Define the FriendsState interface with both `friends` and `list`
interface FriendsState {
    friends: Array<Friend>;
    list: Array<Friend>;  // Alias for `friends` to maintain compatibility
    pendingInvitations: Array<PendingInvitation>;
    onlineUsers: Array<OnlineUser>;
    groupChatList: Array<GroupChatDetails>;
}

// Set the initial state, making sure both `friends` and `list` are initialized
const initialState: FriendsState = {
    friends: [],
    list: [],  // Initialize `list` as an alias for `friends`
    pendingInvitations: [],
    onlineUsers: [],
    groupChatList: []
};

const friendsReducer: Reducer<FriendsState, FriendsActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.setPendingInvitations:
            return {
                ...state,
                pendingInvitations: action.payload,
            };

        case actionTypes.setFriends:
            return {
                ...state,
                friends: action.payload,
                list: action.payload,  // Keep `list` and `friends` in sync
            };

        case actionTypes.setOnlineUsers:
            return {
                ...state,
                onlineUsers: action.payload,
            };

        case actionTypes.setGroupChatList:
            return {
                ...state,
                groupChatList: action.payload,
            };

        case actionTypes.resetFriends:
            return {
                ...initialState
            };

        default:
            return state;
    }
};

export { friendsReducer };
