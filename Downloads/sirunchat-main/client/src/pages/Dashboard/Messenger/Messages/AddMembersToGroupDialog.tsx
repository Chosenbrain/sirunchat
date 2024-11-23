import React from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAppSelector } from "../../../../store";
import { addMembersToGroupAction } from "../../../../actions/groupChatActions";

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

const AddMembersToGroupDialog: React.FC<Props> = ({
    isDialogOpen,
    closeDialogHandler,
}) => {
    const {
        friends: { friends = [] },
        chat: { chosenGroupChatDetails },
    } = useAppSelector((state) => state);

    const theme = useTheme();
    const dispatch = useDispatch();

    const currentGroupMembers = React.useMemo(
        () =>
            chosenGroupChatDetails?.participants.map((participant) =>
                participant._id.toString()
            ) || [],
        [chosenGroupChatDetails]
    );

    const [friendIds, setFriendIds] = React.useState<string[]>(currentGroupMembers);

    React.useEffect(() => {
        setFriendIds(currentGroupMembers); // Update state when group members change
    }, [currentGroupMembers]);

    const handleChange = (event: SelectChangeEvent<typeof friendIds>) => {
        const {
            target: { value },
        } = event;

        setFriendIds(
            typeof value === "string" ? value.split(",") : value
        );
    };

    const handleAddMembers = () => {
        if (chosenGroupChatDetails) {
            dispatch(
                addMembersToGroupAction(
                    {
                        friendIds,
                        groupChatId: chosenGroupChatDetails.groupId,
                    },
                    closeDialogHandler
                )
            );
        }
    };

    const handleCloseDialog = () => {
        setFriendIds(currentGroupMembers); // Reset state on dialog close
        closeDialogHandler();
    };

    return (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>
                <Typography>
                    Add friends to "{chosenGroupChatDetails?.groupName || "Group"}"
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography>Select friends to add</Typography>
                </DialogContentText>
                {friends.length > 0 ? (
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="friends-select-label">Friends</InputLabel>
                        <Select
                            labelId="friends-select-label"
                            id="friends-select"
                            multiple
                            value={friendIds}
                            onChange={handleChange}
                            input={<OutlinedInput label="Friends" />}
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
                ) : (
                    <Typography>No friends available to add.</Typography>
                )}
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
                    disabled={friendIds.length === 0 || !chosenGroupChatDetails}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMembersToGroupDialog;
