import React from "react";
import { Tooltip, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import InvitationDecisionButtons from "./InvitationDecisionButtons";
import Avatar from "../../../../components/Avatar";

interface FriendsListItemProps {
  id: string;
  username: string;
  email: string;
}

const PendingInvitationsListItem = ({
  id,
  username,
  email,
}: FriendsListItemProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  // Debugging logs
  console.log("PendingInvitationsListItem props:", { id, username, email });

  return (
    <Tooltip title={email} arrow>
      {/* Wrap the entire content inside Tooltip as children */}
      <Box
        sx={{
          width: "100%",
          height: "42px",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Avatar username={username} />
        <Typography
          sx={{
            marginLeft: "7px",
            fontWeight: 700,
            color: "#8e9297",
            flexGrow: 1,
          }}
        >
          {username}
        </Typography>
        <InvitationDecisionButtons invitationId={id} />
      </Box>
    </Tooltip>
  );
};

export default PendingInvitationsListItem;
