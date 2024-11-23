import { Dispatch } from "redux";
import { createGroupChat, addMembersToGroup, leaveGroup, deleteGroup } from "../api/api";
import { AddMembersToGroupArgs, DeleteGroupArgs, LeaveGroupArgs } from "../api/types";
import { showAlert } from "./alertActions";
import { resetChatAction } from "./chatActions";

export const createGroupChatAction = (
    name: string,
    closeDialogHandler: () => void
) => {
    return async (dispatch: Dispatch) => {
        const response = await createGroupChat(name);

        if (response === "Group created successfully") {
            closeDialogHandler();
            dispatch(showAlert(response));
            console.log("Group created successfully with name: ", name);
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

export const addMembersToGroupAction = (
    args: AddMembersToGroupArgs,
    closeDialogHandler: () => void
) => {
    return async (dispatch: Dispatch) => {
        const response = await addMembersToGroup(args);

        if (response === "Members added successfully!") {
            closeDialogHandler();
            dispatch(showAlert(response));
            console.log("Members added successfully: ", args.friendIds);
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

export const leaveGroupAction = (args: LeaveGroupArgs) => {
    return async (dispatch: Dispatch) => {
        const response = await leaveGroup(args);

        if (response === "You have left the group!") {
            dispatch(showAlert(response));
            dispatch(resetChatAction());
            console.log("Left group with ID: ", args.groupChatId);
        } else {
            dispatch(showAlert(response.message));
        }
    };
};

export const deleteGroupAction = (args: DeleteGroupArgs) => {
    return async (dispatch: Dispatch) => {
        const response = await deleteGroup({
            groupChatId: args.groupChatId, // Ensure both fields are passed
            groupChatName: args.groupChatName, // Add `groupChatName` here
        });

        if (response === "Group deleted successfully!") {
            dispatch(showAlert(`You deleted the "${args.groupChatName}" group!`));
            dispatch(resetChatAction());
            console.log("Deleted group: ", args.groupChatName);
        } else {
            dispatch(showAlert(response.message));
        }
    };
};
