import { 
    actionTypes, 
    SetChosenChatDetails, 
    SetMessages, 
    Message, 
    SetTyping, 
    AddNewMessage, 
    SetInitialTypingStatus, 
    Typing, 
    GroupChatDetails, 
    SetChosenGroupChatDetails, 
    ResetChat 
} from "./types";

// Update setChosenChatDetails to include isOnline
export const setChosenChatDetails = (chatDetails: {
    userId: string;
    username: string;
    isOnline?: boolean; // Make isOnline optional to match your friend structure
}): SetChosenChatDetails => {
    return {
        type: actionTypes.setChosenChatDetails,
        payload: chatDetails,
    };
};

export const setChosenGroupChatDetails = (chatDetails: GroupChatDetails): SetChosenGroupChatDetails => {
    return {
        type: actionTypes.setChosenGroupChatDetails,
        payload: chatDetails,
    };
};

export const setMessages = (messages: Array<Message>): SetMessages => {
    return {
        type: actionTypes.setMessages,
        payload: messages,
    };
};

export const addNewMessage = (message: Message): AddNewMessage => {
    return {
        type: actionTypes.addNewMessage,
        payload: message,
    };
};

export const setTyping = (typing: Typing): SetTyping => {
    return {
        type: actionTypes.setTyping,
        payload: typing
    };
};

export const setInitialTypingStatus = (typing: Array<Typing>): SetInitialTypingStatus => {
    return {
        type: actionTypes.setInitialTypingStatus,
        payload: typing,
    };
};

export const resetChatAction = (): ResetChat => {
    return {
        type: actionTypes.resetChat
    }
};
