import { Dispatch } from "redux";
import { createGroupChat, addMembersToGroup, leaveGroup, deleteGroup } from "../api/api";
import { AddMembersToGroupArgs, DeleteGroupArgs, LeaveGroupArgs } from "../api/types";
import { showAlert } from "./alertActions";
import { resetChatAction } from "./chatActions";

// Action to create a new group chat
export const createGroupChatAction = (
    name: string,
    closeDialogHandler: () => void
) => {
    return async (dispatch: Dispatch) => {
        const response = await createGroupChat(name);

        if (response === "Group created successfully") {
            closeDialogHandler();
            dispatch(showAlert(response));
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

// Action to add members to an existing group chat
export const addMembersToGroupAction = (
    args: AddMembersToGroupArgs,
    closeDialogHandler: () => void
) => {
    return async (dispatch: Dispatch) => {
        const response = await addMembersToGroup(args);

        if (response === "Members added successfully!") {
            closeDialogHandler();
            dispatch(showAlert(response));
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

// Action to leave a group chat
export const leaveGroupAction = (
    args: LeaveGroupArgs,
) => {
    return async (dispatch: Dispatch) => {
        const response = await leaveGroup(args);

        if (response === "You have left the group!") {
            dispatch(showAlert(response));
            dispatch(resetChatAction());
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

export const deleteGroupAction = ({ groupChatId }: DeleteGroupArgs, groupChatName: string) => {
    return async (dispatch: Dispatch) => {
      const response = await deleteGroup({ groupChatId });
  
      if (response === "Group deleted successfully!") {
        dispatch(showAlert(`You deleted the "${groupChatName}" group!`));
        dispatch(resetChatAction());
      } else {
        dispatch(showAlert(response.message));
      }
    };
  };
  