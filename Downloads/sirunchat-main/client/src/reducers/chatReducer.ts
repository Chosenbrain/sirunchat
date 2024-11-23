import { Reducer } from "redux";
import { ChatActions, actionTypes } from "../actions/types";

enum ChatTypes {
    direct = "DIRECT",
    group = "GROUP",
}

interface Message {
    _id: string;
    content: string;
    author: {
        username: string;
        _id: string;
    };
    createdAt: string;
}

interface ChatState {
    chatType: ChatTypes;
    chosenChatDetails: {
        userId: string;
        username: string;
        isOnline?: boolean; // Added isOnline as optional
    } | null;
    chosenGroupChatDetails: {
        groupId: string;
        groupName: string;
        participants: Array<{
            _id: string;
            username: string;
            email: string;
        }>;
        admin: {
            _id: string;
            username: string;
            email: string;
        };
    } | null;
    typing: Array<{
        userId: string;
        typing: boolean;
    }>;
    messages: Array<Message>;
}

const initialState: ChatState = {
    chosenChatDetails: null,
    chosenGroupChatDetails: null,
    typing: [],
    chatType: ChatTypes.direct,
    messages: [],
};

const chatReducer: Reducer<ChatState, ChatActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case actionTypes.setChosenChatDetails:
            return {
                ...state,
                chosenGroupChatDetails: null,
                messages: [],
                chosenChatDetails: {
                    userId: action.payload.userId,
                    username: action.payload.username,
                    isOnline: action.payload.isOnline ?? false, // Set isOnline, default to false if undefined
                },
            };

        case actionTypes.setChosenGroupChatDetails:
            return {
                ...state,
                chosenChatDetails: null,
                messages: [],
                chosenGroupChatDetails: action.payload,
            };

        case actionTypes.setMessages:
            return {
                ...state,
                messages: action.payload,
            };

        case actionTypes.addNewMessage:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        case actionTypes.setInitialTypingStatus:
            return {
                ...state,
                typing: action.payload,
            };

        case actionTypes.setTyping:
            return {
                ...state,
                typing: state.typing.map((item) =>
                    item.userId === action.payload.userId ? action.payload : item
                ),
            };

        case actionTypes.resetChat:
            return {
                ...state,
                chosenChatDetails: null,
                chosenGroupChatDetails: null,
                messages: [],
            };

        default:
            return state;
    }
};

export { chatReducer };
