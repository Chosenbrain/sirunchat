import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InvitationDecisionButtons from "./InvitationDecisionButtons";

interface ComponentProps {
    username: string;
    invitationId: string;
}

export default function PendingInvitationListItemSmall({ username, invitationId }: ComponentProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // API Call for accepting invitation
    const handleAcceptInvitation = async () => {
        try {
            // Assuming you have an API call to accept the invitation
            await acceptInvitationAPI(invitationId); // Replace with your API call
            console.log(`Invitation accepted for: ${username}`);
            // Optionally, update your state or UI to reflect the acceptance
        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    };

    // API Call for rejecting invitation
    const handleRejectInvitation = async () => {
        try {
            // Assuming you have an API call to reject the invitation
            await rejectInvitationAPI(invitationId); // Replace with your API call
            console.log(`Invitation rejected for: ${username}`);
            // Optionally, update your state or UI to reflect the rejection
        } catch (error) {
            console.error("Error rejecting invitation:", error);
        }
    };

    return (
        <div>
            <Box
                sx={{
                    width: "100%",
                    height: "42px",
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Typography
                    sx={{
                        marginLeft: "7px",
                        fontWeight: 700,
                        color: "#8e9297",
                        flexGrow: 1,
                    }}
                    variant="subtitle1"
                >
                    {username}
                </Typography>

                {/* Icon buttons to accept or reject the invitation */}
                <Box sx={{ display: "flex" }}>
                    <IconButton onClick={handleAcceptInvitation} sx={{ color: "green" }}>
                        <CheckIcon />
                    </IconButton>
                    <IconButton onClick={handleRejectInvitation} sx={{ color: "red" }}>
                        <ClearIcon />
                    </IconButton>
                </Box>
            </Box>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem>
                    <InvitationDecisionButtons color="#8e9297" invitationId={invitationId} />
                </MenuItem>
            </Menu>
        </div>
    );
}

// Placeholder API call functions for accepting and rejecting invitations
const acceptInvitationAPI = async (invitationId: string) => {
    try {
        // Replace with your actual API call logic
        const response = await fetch(`/api/invite-friend/accept/${invitationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ invitationId }),
        });

        if (!response.ok) {
            throw new Error("Failed to accept invitation");
        }

        // Return response data if needed
        return await response.json();
    } catch (error) {
        console.error("Error in acceptInvitationAPI:", error);
        throw error;
    }
};

const rejectInvitationAPI = async (invitationId: string) => {
    try {
        // Replace with your actual API call logic
        const response = await fetch(`/api/invite-friend/reject/${invitationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ invitationId }),
        });

        if (!response.ok) {
            throw new Error("Failed to reject invitation");
        }

        // Return response data if needed
        return await response.json();
    } catch (error) {
        console.error("Error in rejectInvitationAPI:", error);
        throw error;
    }
};
