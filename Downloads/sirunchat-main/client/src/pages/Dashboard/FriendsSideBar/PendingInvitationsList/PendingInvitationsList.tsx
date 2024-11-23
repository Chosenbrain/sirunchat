import React, { useEffect } from "react";
import { styled } from "@mui/system";
import PendingInvitationsListItem from "./PendingInvitationsListItem";
import { useAppSelector } from "../../../../store";
import Typography from "@mui/material/Typography";

const MainContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "10px 0",
});

const PendingInvitationsList = () => {
  const { pendingInvitations } = useAppSelector((state) => state.friends);

  useEffect(() => {
    console.log(
      "Pending Invitations in Component:",
      pendingInvitations
    ); // Debugging
  }, [pendingInvitations]);

  return (
    <MainContainer>
      {pendingInvitations?.length > 0 ? (
        pendingInvitations.map((invitation) => {
          if (!invitation.senderId) {
            console.warn(
              `Invalid invitation data: ${JSON.stringify(invitation)}`
            );
            return null;
          }

          return (
            <PendingInvitationsListItem
              key={invitation._id}
              id={invitation._id}
              username={invitation.senderId.username || "Unknown"}
              email={invitation.senderId.email || "No email available"}
            />
          );
        })
      ) : (
        <Typography
          sx={{
            marginTop: "20px",
            color: "#8e9297",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          You have no pending friend invitations at the moment.
        </Typography>
      )}
    </MainContainer>
  );
};

export default PendingInvitationsList;
