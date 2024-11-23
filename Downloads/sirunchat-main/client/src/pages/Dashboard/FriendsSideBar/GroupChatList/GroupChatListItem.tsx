import React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "../../../../components/Avatar"; // Add Avatar for group representation
import { setChosenGroupChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";
import { GroupChatDetails } from "../../../../actions/types";

interface GroupChatListItemProps {
    chat: GroupChatDetails;
}

const GroupChatListItem: React.FC<GroupChatListItemProps> = ({ chat }) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const dispatch = useDispatch();

    const { chosenGroupChatDetails } = useAppSelector((state) => state.chat);

    const isChatActive = chosenGroupChatDetails?.groupId === chat.groupId;

    const handleGroupChatSelection = () => {
        dispatch(setChosenGroupChatDetails(chat));
        console.log("Selected Group Chat:", chat.groupName); // Utilize `chat.groupName` for debugging/logging
    };

    return (
        <Tooltip title={chat.groupName}>
            <Button
                onClick={handleGroupChatSelection}
                style={{
                    width: "100%",
                    height: "42px",
                    marginTop: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "black",
                    position: "relative",
                    backgroundColor: isChatActive ? "#36393f" : "transparent",
                }}
            >
                {matches && (
                    <Avatar
                        username={chat.groupName}
                        isGroup // Add visual differentiation for group chats
                    />
                )}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        style={{
                            marginLeft: "7px",
                            fontWeight: 700,
                            color: "#8e9297",
                        }}
                        variant="subtitle1"
                        align="left"
                    >
                        {chat.groupName}
                    </Typography>
                    <Typography
                        style={{
                            marginLeft: "7px",
                            fontSize: "12px",
                            color: "#72767d",
                        }}
                        align="left"
                    >
                        Members: {chat.participants.length} {/* Show number of participants */}
                    </Typography>
                </div>
            </Button>
        </Tooltip>
    );
};

export default GroupChatListItem;
