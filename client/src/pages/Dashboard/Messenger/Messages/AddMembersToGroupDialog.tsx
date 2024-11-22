import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAppSelector } from "../../../../store";
import { addMembersToGroupAction } from "../../../../actions/groupChatActions";
import { Theme, useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Function to style selected/unselected items in the dropdown
function getStyles(name: string, selectedNames: string[], theme: Theme) {
    return {
        fontWeight:
            selectedNames.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

interface Props {
    isDialogOpen: boolean;
    closeDialogHandler: () => void;
}

const AddMembersToGroupDialog = ({
    isDialogOpen,
    closeDialogHandler,
}: Props) => {
    // Access necessary state from the store
    const {
        friends: { friends },
        chat: { chosenGroupChatDetails },
    } = useAppSelector((state) => state);

    const theme = useTheme();
    const dispatch = useDispatch();

    // Extract current group member IDs, if any, to pre-select in the dialog
    const currentGroupMembers = chosenGroupChatDetails?.participants.map(
        (participant) => participant._id.toString()
    );

    // Initialize selected friends with current group members if available
    const [friendIds, setFriendIds] = useState<string[]>(currentGroupMembers || []);

    // Handle changes in selection
    const handleChange = (event: SelectChangeEvent<typeof friendIds>) => {
        const { target: { value } } = event;
        setFriendIds(typeof value === "string" ? value.split(",") : value);
    };

    // Action to close the dialog
    const handleCloseDialog = () => {
        closeDialogHandler();
    };

    // Dispatch the action to add selected friends to the group
    const handleAddMembers = () => {
        if (chosenGroupChatDetails?.groupId) {
            dispatch(
                addMembersToGroupAction(
                    { friendIds, groupChatId: chosenGroupChatDetails.groupId },
                    handleCloseDialog
                )
            );
        }
    };

    return (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>
                <Typography>
                    Add friends to "{chosenGroupChatDetails?.groupName}" group
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography>Select friends to add</Typography>
                </DialogContentText>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="friend-select-label">Name</InputLabel>
                    <Select
                        labelId="friend-select-label"
                        id="friend-select"
                        multiple
                        value={friendIds}
                        onChange={handleChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                    >
                        {friends.map((friend) => (
                            <MenuItem
                                key={friend.id}
                                value={friend.id}
                                style={getStyles(friend.username, friendIds, theme)}
                            >
                                {friend.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: "#5865F2",
                        color: "white",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 500,
                        width: "100%",
                        height: "40px",
                        margin: "10px 15px",
                    }}
                    onClick={handleAddMembers}
                    disabled={friendIds.length === 0}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMembersToGroupDialog;
