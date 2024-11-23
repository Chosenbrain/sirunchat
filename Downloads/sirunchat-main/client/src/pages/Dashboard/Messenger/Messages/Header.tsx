import React, { useRef, useState } from "react";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "../../../../components/Avatar";
import { useAppSelector } from "../../../../store";
import { callRequest, deleteChat } from "../../../../socket/socketConnection"; // Import deleteChat
import ChatDropDown from "./ChatDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const MainContainer = styled("div")({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: "0px",
    padding: "8px 15px",
    background: "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,255,0,1) 50%, rgba(0,0,255,1) 100%)",
    borderRadius: "0px 0px 20px 20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: "20",
    color: "white",
    "@media (max-width: 600px)": {
        padding: "5px 10px",
    },
});

const DesktopChatDropDown = styled("div")({
    display: "block",
    "@media (max-width: 600px)": {
        display: "none",
    },
});

const CenterSection = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "8px",
    "@media (max-width: 600px)": {
        flexDirection: "column",
    },
});

const StatusText = styled(Typography)({
    fontSize: "12px",
    color: "#d3d3d3",
    marginTop: "-2px",
});

const CallButtons = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "@media (max-width: 600px)": {
        display: "none",
    },
});

const MessagesHeader: React.FC<{ scrollPosition: number }> = ({ scrollPosition }) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMobileMenuOpen = Boolean(anchorEl);

    const {
        auth: { userDetails },
        chat: { chosenChatDetails },
        room: { isUserInRoom },
    } = useAppSelector((state) => state);

    const handleDeleteChat = () => {
        if (chosenChatDetails && userDetails) {
            const data = {
                userId: userDetails._id, // Corrected to use userDetails._id
                otherUserId: chosenChatDetails.userId,
            };
            console.log("Attempting to delete chat with data:", data);
            deleteChat(data); // Call deleteChat with the necessary data
        } else {
            console.error("Cannot delete chat: user details or chat details are missing");
        }
    };

    const handleRemoveFriend = () => {
        console.log("Remove friend");
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <MainContainer ref={navRef}>
            <DesktopChatDropDown>
                <ChatDropDown />
            </DesktopChatDropDown>

            <CenterSection>
                {chosenChatDetails && (
                    <>
                        <Avatar username={chosenChatDetails.username} />
                        <div style={{ textAlign: "center" }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "white",
                                    fontSize: "16px",
                                }}
                            >
                                {chosenChatDetails.username}
                            </Typography>
                            <StatusText>
                                {chosenChatDetails.isOnline ? "Online" : "Offline"}
                            </StatusText>
                        </div>
                    </>
                )}
            </CenterSection>

            <CallButtons>
                <IconButton
                    sx={{ color: "#00acee", fontSize: "16px" }}
                    disabled={isUserInRoom}
                    onClick={() =>
                        callRequest({
                            audioOnly: true,
                            callerName: userDetails ? userDetails.username : "",
                            receiverUserId: chosenChatDetails?.userId!,
                        })
                    }
                >
                    <AddIcCallIcon fontSize="small" />
                </IconButton>

                <IconButton
                    sx={{ color: "#00ff7f", fontSize: "16px" }}
                    disabled={isUserInRoom}
                    onClick={() =>
                        callRequest({
                            audioOnly: false,
                            callerName: userDetails ? userDetails.username : "",
                            receiverUserId: chosenChatDetails?.userId!,
                        })
                    }
                >
                    <VideoCallIcon fontSize="small" />
                </IconButton>

                <IconButton
                    sx={{ color: "red", fontSize: "16px" }}
                    onClick={handleDeleteChat}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </CallButtons>

            <IconButton
                aria-label="mobile menu"
                onClick={handleMobileMenuOpen}
                sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            >
                <MenuIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
                keepMounted
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={() => callRequest({ audioOnly: true, callerName: userDetails?.username ?? "", receiverUserId: chosenChatDetails?.userId! })}>
                    <AddIcCallIcon sx={{ color: "#00acee", marginRight: "8px" }} />
                    Voice Call
                </MenuItem>
                <MenuItem onClick={() => callRequest({ audioOnly: false, callerName: userDetails?.username ?? "", receiverUserId: chosenChatDetails?.userId! })}>
                    <VideoCallIcon sx={{ color: "#00ff7f", marginRight: "8px" }} />
                    Video Call
                </MenuItem>
                <MenuItem onClick={handleDeleteChat}>
                    <DeleteIcon sx={{ color: "red", marginRight: "8px" }} />
                    Delete Chat
                </MenuItem>
                <MenuItem onClick={handleRemoveFriend}>
                    <PersonRemoveIcon sx={{ color: "gray", marginRight: "8px" }} />
                    Remove Friend
                </MenuItem>
            </Menu>
        </MainContainer>
    );
};

export default MessagesHeader;
