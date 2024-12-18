import React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import OnlineIndicator from "./OnlineIndicator";
import Avatar from "../../../../components/Avatar";
import { setChosenChatDetails } from "../../../../actions/chatActions";
import { useAppSelector } from "../../../../store";

interface FriendsListItemProps {
    id: string;
    username: string;
    email: string;
    isOnline: boolean; 
    onSelectFriend: () => void; 
}

const FriendsListItem: React.FC<FriendsListItemProps> = ({
    id,
    username,
    isOnline,
    email,
    onSelectFriend,
}) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));
    const dispatch = useDispatch();

    const { chosenChatDetails, typing } = useAppSelector((state) => state.chat);
    const isTyping = typing.find((item) => item.userId === id);
    const isFriendTyping = isTyping && isTyping.typing && id !== chosenChatDetails?.userId;
    const isChatActive = chosenChatDetails?.userId === id;

    return (
        <Tooltip title={email}>
            <Button
                onClick={onSelectFriend} 
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
                {matches && <Avatar username={username} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Typography style={{ marginLeft: "7px", fontWeight: 700, color: "#8e9297" }} variant="subtitle1" align="left">
                        {username}
                    </Typography>
                    {isFriendTyping && (
                        <Typography style={{ marginLeft: "7px", fontWeight: 500, fontSize: "15px", color: "#3ba55d" }} variant="subtitle1" align="left">
                            typing.....
                        </Typography>
                    )}
                </div>
                {isOnline && <OnlineIndicator isOnline={isOnline} />}
            </Button>
        </Tooltip>
    );
};

export default FriendsListItem;
