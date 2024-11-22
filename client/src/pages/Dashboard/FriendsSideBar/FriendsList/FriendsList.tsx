import React from "react";
import { styled } from "@mui/system";
import FriendsListItem from "./FriendsListItem";
import { useAppSelector } from "../../../../store";
import { useDispatch } from "react-redux";
import { setChosenChatDetails } from "../../../../actions/chatActions"; 
import { Friend } from "../../../../actions/types"; 

const MainContainer = styled("div")({
    flexGrow: 1,
    width: "100%",
    margin: "20px 0"
});

const FriendsList: React.FC = () => {
    const dispatch = useDispatch();
    const { friends, onlineUsers } = useAppSelector(state => state.friends);

    const modifiedFriends: Friend[] = friends.map(friend => {
        const isOnline = onlineUsers.find(user => user.userId === friend.id);
        return { ...friend, isOnline: !!isOnline }; 
    });

    const handleSelectFriend = (friend: Friend) => {
        dispatch(setChosenChatDetails({
            userId: friend.id,
            username: friend.username,
            isOnline: friend.isOnline || false 
        }));
    };

    return (
        <MainContainer>
            {modifiedFriends.map((f) => (
                <FriendsListItem
                    username={f.username}
                    id={f.id}
                    key={f.id}
                    isOnline={f.isOnline || false} 
                    email={f.email}
                    onSelectFriend={() => handleSelectFriend(f)} 
                />
            ))}
        </MainContainer>
    );
};

export default FriendsList;
