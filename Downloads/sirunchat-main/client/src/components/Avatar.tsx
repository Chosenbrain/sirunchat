import React from "react";
import { styled } from "@mui/system";

const AvatarPreview = styled("div")<{
    isGroup?: boolean;
}>(({ isGroup }) => ({
    height: "32px",
    width: "32px",
    backgroundColor: isGroup ? "#f39c12" : "#5865f2", // Different color for group avatars
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "500",
    color: "white",
}));

const Avatar = ({
    username,
    large,
    isGroup,
}: {
    username: string;
    large?: boolean;
    isGroup?: boolean;
}) => {
    return (
        <AvatarPreview
            style={large ? { height: "80px", width: "80px" } : {}}
            isGroup={isGroup}
        >
            {username?.substring(0, 2)}
        </AvatarPreview>
    );
};

export default Avatar;
