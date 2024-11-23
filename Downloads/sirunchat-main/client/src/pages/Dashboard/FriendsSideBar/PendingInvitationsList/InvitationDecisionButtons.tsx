import React, { useState } from "react";
import { useDispatch } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { rejectInvitation, acceptInvitation } from "../../../../actions/friendActions";

interface InvitationDecisionButtonsProps {
  color?: string;
  invitationId: string;
}

const InvitationDecisionButtons: React.FC<InvitationDecisionButtonsProps> = ({
  color = "white", // Default color
  invitationId,
}) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false); // Loading state

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await dispatch(acceptInvitation(invitationId) as any);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await dispatch(rejectInvitation(invitationId) as any);
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton
        style={{ color }}
        onClick={handleAccept}
        disabled={isProcessing} // Disable button while processing
      >
        <CheckIcon />
      </IconButton>
      <IconButton
        style={{ color }}
        onClick={handleReject}
        disabled={isProcessing} // Disable button while processing
      >
        <ClearIcon />
      </IconButton>
    </Box>
  );
};

export default InvitationDecisionButtons;
