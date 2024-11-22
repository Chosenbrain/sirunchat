import React from "react";
import { Box } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

interface OnlineIndicatorProps {
  isOnline: boolean; 
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline }) => {
  return (
    <Box
      sx={{
        color: isOnline ? "#3ba55d" : "#c0c0c0", 
        display: "flex",
        alignItems: "center",
        position: "absolute",
        right: "5px",
      }}
      aria-label={isOnline ? "Online" : "Offline"}
    >
      <FiberManualRecordIcon />
    </Box>
  );
};

export default OnlineIndicator;
