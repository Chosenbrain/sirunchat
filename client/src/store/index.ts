import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "../reducers/authReducer";
import { alertReducer } from "../reducers/alertReducer";
import { friendsReducer } from "../reducers/friendsReducer";
import { chatReducer } from "../reducers/chatReducer";
import videoChatReducer from "../reducers/videoChatReducer";
import { roomReducer } from "../reducers/roomReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    friends: friendsReducer,
    chat: chatReducer,
    videoChat: videoChatReducer,
    room: roomReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

type AppDispatch = typeof store.dispatch;

// Create a typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, useAppSelector }; // Exporting all necessary hooks
