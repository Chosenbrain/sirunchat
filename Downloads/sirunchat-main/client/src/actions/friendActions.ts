import { Dispatch } from "redux";
import { 
    acceptFriendRequest, 
    inviteFriendRequest, 
    rejectFriendRequest, 
    removeFriend 
} from "../api/api";
import { showAlert } from "./alertActions";
import { resetChatAction } from "./chatActions";
import { actionTypes, PendingInvitation, Friend, OnlineUser, GroupChatDetails, ResetFriends } from "./types";

export const inviteFriend = (email: string, closeDialogHandler: () => void) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await inviteFriendRequest({ email });
            console.log("inviteFriend API response:", response); // Debugging

            if (response === "Invitation has been sent successfully") {
                closeDialogHandler();
                dispatch(showAlert(response));
            } else {
                dispatch(showAlert(response.message));
            }
        } catch (error) {
            console.error("Error inviting friend:", error);
        }
    };
};

export const setPendingInvitations = (pendingInvitations: PendingInvitation[]) => {
    console.log("setPendingInvitations action dispatched:", pendingInvitations); // Debugging
    return {
        type: actionTypes.setPendingInvitations,
        payload: pendingInvitations,
    };
};

export const setFriends = (friends: Friend[]) => {
    console.log("setFriends action dispatched:", friends); // Debugging
    return {
        type: actionTypes.setFriends,
        payload: friends,
    };
};

export const setOnlineUsers = (onlineUsers: OnlineUser[]) => {
    console.log("setOnlineUsers action dispatched:", onlineUsers); // Debugging
    return {
        type: actionTypes.setOnlineUsers,
        payload: onlineUsers,
    };
};

export const setGroupChatList = (chatList: GroupChatDetails[]) => {
    console.log("setGroupChatList action dispatched:", chatList); // Debugging
    return {
        type: actionTypes.setGroupChatList,
        payload: chatList,
    };
};

export const rejectInvitation = (invitationId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await rejectFriendRequest(invitationId);
            console.log("rejectInvitation API response:", response); // Debugging

            if (response === "Invitation rejected successfully!") {
                dispatch(showAlert(response));
            } else {
                dispatch(showAlert(response.message));
            }
        } catch (error) {
            console.error("Error rejecting invitation:", error);
        }
    };
};

export const acceptInvitation = (invitationId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await acceptFriendRequest(invitationId);
            console.log("acceptInvitation API response:", response); // Debugging

            if (response === "Invitation accepted successfully!") {
                dispatch(showAlert(response));
            } else {
                dispatch(showAlert(response.message));
            }
        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    };
};

export const removeFriendAction = ({ friendId, friendName }: { friendId: string; friendName: string }) => {
    return async (dispatch: Dispatch) => {
        try {
            const response = await removeFriend({ friendId });
            console.log("removeFriend API response:", response); // Debugging

            if (response === "Friend removed successfully!") {
                dispatch(showAlert(`You removed ${friendName} from your list of friends!`));
                dispatch(resetChatAction());
            } else {
                dispatch(showAlert(response.message));
            }
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };
};

export const resetFriendsAction = (): ResetFriends => {
    return {
        type: actionTypes.resetFriends,
    };
};
