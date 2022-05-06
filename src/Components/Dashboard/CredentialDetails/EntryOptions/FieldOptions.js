import { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from "@mui/styles";

import { darkTheme } from "../../../../Theme";

import { Box, Select, MenuItem, Typography, Button } from "@mui/material";

const chooseRandom = (string, length) => {
    var chars = '';
    for (var i = 0; i < length; i++) {
        chars += string.charAt(Math.floor(Math.random() * length));
    }
    return chars;
}

const shuffle = (string) => {
    var array = string.split('');
    var tmp, current, top = array.length;

    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array.join('');
};

const useSelectStyles = makeStyles({
    paper: {
        background: props => (props.theme === "dark") ? darkTheme.backgroundColor : "white",
        color: "inherit"
    },
    icon: {
        fill: "gray",
    }
});

const useGeneratePasswordBtn = makeStyles({
    root: {
        backgroundColor: "inherit",
        color: 'inherit',
        textTransform: "none",
        border: "1px solid rgb(0, 136, 253)",

        '&:hover': {
            backgroundColor: "rgb(0, 136, 253)",
            color: 'white',
        }
    }
});

const useRemoveFieldBtn = makeStyles({
    root: {
        backgroundColor: "inherit",
        color: 'inherit',
        textTransform: "none",
        border: "1px solid red",

        '&:hover': {
            color: "white",
            backgroundColor: "red",
        }
    }
});

function FieldOptions(props) {
    const dispatch = useDispatch();

    const theme = useSelector((state) => state.config.theme);

    const { selectedFieldIndex, entryData } = useSelector((state) => state.entries);
    const updateSelectedFieldIndex = useCallback((selectedFieldIndex) => dispatch({ type: "updateSelectedFieldIndex", payload: { selectedFieldIndex } }), [dispatch]);
    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);

    const updateSnack = useCallback((snack) => dispatch({ type: "updateSnack", payload: { snack } }), [dispatch]);
    const showSnack = (type, message) => updateSnack({ open: true, type, message, key: new Date().getTime() });

    const selectStyles = useSelectStyles({ theme });
    const generatePasswordBtnStyles = useGeneratePasswordBtn();
    const removeFieldBtnStyles = useRemoveFieldBtn();

    const handleFieldTypeChange = (e) => {
        let newEntryData = { ...entryData };
        newEntryData.data[selectedFieldIndex].type = e.target.value;

        updateEntryData(newEntryData);
    }

    const generatePassword = () => {
        var specials = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
        var lowercase = 'abcdefghijklmnopqrstuvwxyz';
        var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var numbers = '0123456789';

        var password = '';
        password += chooseRandom(specials, 3);
        password += chooseRandom(uppercase, 3);
        password += chooseRandom(lowercase, 4);
        password += chooseRandom(numbers, 3);
        password = shuffle(password);

        let newEntryData = { ...entryData };
        newEntryData.data[selectedFieldIndex].value = password;

        updateEntryData(newEntryData);
        showSnack("success", "New password: " + password);
    }

    const removeField = () => {
        let newEntryData = { ...entryData };
        newEntryData.data.splice(selectedFieldIndex, 1);

        updateSelectedFieldIndex(0);
        updateEntryData(newEntryData);
    }

    return (<>
        <Box
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {(entryData.data.length) ? <>
                <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Field Options</Box>
                <Box style={{ padding: "5px 10px 0 10px" }} >
                    <Typography style={{ fontSize: "14px" }} >Field Type</Typography>
                    <Select
                        fullWidth
                        labelId="fieldType"
                        variant="standard"
                        value={entryData.data[selectedFieldIndex].type}
                        MenuProps={{
                            classes: {
                                paper: selectStyles.paper
                            }
                        }}
                        inputProps={{
                            classes: {
                                icon: selectStyles.icon,
                            }
                        }}
                        sx={{
                            color: "inherit",
                            backgroundColor: "inherit",
                            borderBottom: "1px solid gray"
                        }}
                        onChange={handleFieldTypeChange}
                    >
                        <MenuItem value={"text"}>Text</MenuItem>
                        <MenuItem value={"password"}>Password</MenuItem>
                        <MenuItem value={"hidden"}>Hidden</MenuItem>
                        <MenuItem value={"link"}>Link</MenuItem>
                    </Select>
                </Box>

                <Box
                    style={{
                        height: "100%",
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center",
                        justifyContent: "space-evenly"
                    }}
                >
                    {(entryData.data[selectedFieldIndex].type === "password") ? <>
                        <Button
                            className={generatePasswordBtnStyles.root}
                            onClick={generatePassword}
                        >Generate Password</Button>
                    </> : null}

                    <Button
                        className={removeFieldBtnStyles.root}
                        onClick={removeField}
                    >Remove Field</Button>
                </Box>
            </> : <>
                <Box
                    style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    No Field Selected
                </Box>
            </>}
        </Box>
    </>);
}

export default FieldOptions;