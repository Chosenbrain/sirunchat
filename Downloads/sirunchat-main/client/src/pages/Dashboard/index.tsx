import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for v6
import { styled } from "@mui/system";
import { connectWithSocketServer, UserDetails } from "../../socket/socketConnection";
import { useAppSelector } from "../../store";
import ResponsiveDrawer from "./Drawer";

const Wrapper = styled("div")({
    width: "100%",
    height: "100vh",
    display: "flex",
});

const Dashboard = () => {
    const {
        auth: { userDetails },
        videoChat: { localStream },
        room: { isUserInRoom = false, localStreamRoom = null, activeRooms = [] } = {},
        friends: { friends = [], pendingInvitations = [] },
        friends: { groupChatList = [] },
    } = useAppSelector((state) => state);

    const navigate = useNavigate(); // Replace useHistory with useNavigate

    useEffect(() => {
        const isLoggedIn = userDetails?.token;

        if (!isLoggedIn) {
            navigate("/login"); // Use navigate instead of history.push
        } else {
            connectWithSocketServer(userDetails as UserDetails);
        }
    }, [userDetails, navigate]);

    return (
        <Wrapper>
            <ResponsiveDrawer
                localStream={localStream || localStreamRoom}
                isUserInRoom={isUserInRoom}
                hasFriends={friends.length > 0}
                hasGroupChats={groupChatList.length > 0}
                hasActiveRooms={activeRooms.length > 0}
                hasInvitations={pendingInvitations.length > 0}
            />
        </Wrapper>
    );
};

export default Dashboard;
