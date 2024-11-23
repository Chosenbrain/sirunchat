import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import SimplePeer from "simple-peer";
import { actionTypes, CallStatus, ClearVideoChatState } from "./types"; // Ensure this is correct
import { showAlert } from "./alertActions";
import { RootState } from "../store";
import { currentPeerConnection, setCurrentPeerConnection } from "../socket/socketConnection";

export const setLocalStream = (stream: MediaStream | null) => {
    return {
        type: actionTypes.setLocalStream,
        payload: stream,
    };
};

export const setRemoteStream = (stream: MediaStream | null) => {
    console.log("Setting remote stream: ", stream); // Utilize remote stream
    return {
        type: actionTypes.setRemoteStream,
        payload: stream,
    };
};

export const setCallStatus = (status: CallStatus) => {
    console.log("Updating call status: ", status); // Utilize call status
    return {
        type: actionTypes.setCallStatus,
        payload: {
            status,
        },
    };
};

export const setCallRequest = (
    callRequest: {
        callerName: string;
        audioOnly: boolean;
        callerUserId: string;
        signal: SimplePeer.SignalData;
    } | null
) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: actionTypes.setCallRequest,
            payload: callRequest,
        });

        if (callRequest?.callerUserId) {
            console.log("Call request received from user: ", callRequest.callerUserId); // Log call request
            dispatch({
                type: actionTypes.setOtherUserId,
                payload: {
                    otherUserId: callRequest.callerUserId,
                },
            });
        }
    };
};

export const clearVideoChat = (
    message: string
): ThunkAction<void, RootState, unknown, ClearVideoChatState> => {
    return (dispatch, getState) => {
        const {
            videoChat: { localStream, screenSharingStream },
        } = getState();

        localStream?.getTracks().forEach((track) => track.stop());
        screenSharingStream?.getTracks().forEach((track) => track.stop());

        if (currentPeerConnection) {
            currentPeerConnection.destroy(); // Ensure the peer connection is destroyed
            console.log("Peer connection destroyed.");
        }

        setCurrentPeerConnection(null);

        dispatch({
            type: actionTypes.resetVideoChatState,
        });

        dispatch(showAlert(message) as any);
    };
};

export const setOtherUserId = (otherUserId: string) => {
    console.log("Setting other user ID for video chat: ", otherUserId); // Utilize otherUserId
    return {
        type: actionTypes.setOtherUserId,
        payload: {
            otherUserId,
        },
    };
};

export const setScreenSharingStream = (stream: MediaStream | null) => {
    console.log("Setting screen sharing stream: ", stream); // Utilize screen sharing stream
    return {
        type: actionTypes.setScreenSharingStream,
        payload: {
            stream,
            isScreenSharing: !!stream,
        },
    };
};

export const setAudioOnly = (audioOnly: boolean) => {
    console.log("Setting audio-only mode: ", audioOnly); // Utilize audioOnly mode
    return {
        type: actionTypes.setAudioOnly,
        payload: {
            audioOnly,
        },
    };
};
