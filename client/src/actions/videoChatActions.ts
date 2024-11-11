import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import SimplePeer from "simple-peer";
import { actionTypes, CallStatus, ClearVideoChatState } from "./types";
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
    return {
        type: actionTypes.setRemoteStream,
        payload: stream,
    };
};

export const setCallStatus = (status: CallStatus) => {
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

        // Stop all active tracks in local and screen sharing streams
        localStream?.getTracks().forEach((track) => track.stop());
        screenSharingStream?.getTracks().forEach((track) => track.stop());

        // Destroy and reset the current peer connection
        if (currentPeerConnection) {
            currentPeerConnection.destroy();
            console.log("Destroyed peer connection");
            setCurrentPeerConnection(null); // Reset the peer connection
        }

        dispatch({
            type: actionTypes.resetVideoChatState,
        });

        dispatch(showAlert(message) as any);
    };
};

export const setOtherUserId = (otherUserId: string) => {
    return {
        type: actionTypes.setOtherUserId,
        payload: {
            otherUserId,
        },
    };
};

export const setScreenSharingStream = (stream: MediaStream | null) => {
    return {
        type: actionTypes.setScreenSharingStream,
        payload: {
            stream,
            isScreenSharing: !!stream,
        },
    };
};

export const setAudioOnly = (audioOnly: boolean) => {
    return {
        type: actionTypes.setAudioOnly,
        payload: {
            audioOnly,
        },
    };
};

// Function to initialize a peer connection
export const initializePeerConnection = () => {
    return (dispatch: Dispatch) => {
        const peer = new SimplePeer({ initiator: true, trickle: false });

        setCurrentPeerConnection(peer); // Set the new peer connection

        peer.on("signal", (signalData) => {
            console.log("Signal data:", signalData);
            // Handle signaling as needed
        });

        peer.on("connect", () => {
            console.log("Peer connected");
        });

        peer.on("close", () => {
            console.log("Peer connection closed");
            setCurrentPeerConnection(null); // Reset the peer connection
        });

        peer.on("error", (err) => {
            console.error("Peer connection error:", err);
        });

        peer.on("stream", (remoteStream: MediaStream) => {
            dispatch(setRemoteStream(remoteStream));
        });
    };
};
