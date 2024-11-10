import React, { useState, useEffect, Suspense } from "react";
import { styled } from "@mui/system";
import { useAppSelector } from "../../../store";
import { notifyTyping, sendDirectMessage, sendGroupMessage } from "../../../socket/socketConnection";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
// Use dynamic import with Suspense for emoji picker
const Picker = React.lazy(() => import("emoji-mart").then(module => ({ default: module.Picker })));

const MainContainer = styled("div")({
    height: "60px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    position: "relative",
});

const Input = styled("input")({
    backgroundColor: "#2f3136",
    width: "100%",
    height: "44px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    padding: "0 10px",
    outline: "none",
});

const SendButton = styled(IconButton)({
    color: "white",
    padding: "8px",
});

const EmojiPickerContainer = styled("div")({
    position: "absolute",
    bottom: "60px",
    right: "10px",
    zIndex: 1000,
});

const NewMessageInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);

    const handleSendMessage = () => {
        if (message.trim() === "") return;

        if (chosenChatDetails) {
            sendDirectMessage({
                message,
                receiverUserId: chosenChatDetails.userId!,
            });
        }

        if (chosenGroupChatDetails) {
            sendGroupMessage({
                message,
                groupChatId: chosenGroupChatDetails.groupId,
            });
        }

        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessage((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        if (chosenChatDetails?.userId) {
            notifyTyping({
                receiverUserId: chosenChatDetails.userId!,
                typing: focused && message.length > 0,
            });
        }
    }, [focused, message, chosenChatDetails?.userId]);

    return (
        <MainContainer>
            <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <InsertEmoticonIcon sx={{ color: "white" }} />
            </IconButton>

            <Input
                placeholder={
                    chosenChatDetails
                        ? `Write message to ${chosenChatDetails.username}`
                        : chosenGroupChatDetails
                        ? `Write message in ${chosenGroupChatDetails.groupName}`
                        : "Your message..."
                }
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
            />

            <SendButton onClick={handleSendMessage} disabled={!message.trim()}>
                <SendIcon />
            </SendButton>

            {showEmojiPicker && (
                <EmojiPickerContainer>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Picker set="apple" onSelect={handleEmojiSelect} />
                    </Suspense>
                </EmojiPickerContainer>
            )}
        </MainContainer>
    );
};

export default NewMessageInput;
