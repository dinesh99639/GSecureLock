import { makeStyles } from "@mui/styles";

import { darkTheme } from "../../../../Theme";

import { Box, Select, MenuItem, Typography, Button } from "@mui/material";

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
    const { theme, selectedFieldIndex, entryData } = props;

    const selectStyles = useSelectStyles({ theme });
    const generatePasswordBtnStyles = useGeneratePasswordBtn();
    const removeFieldBtnStyles = useRemoveFieldBtn();

    return (<>
        <Box
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Field Options</Box>
            <Box style={{ padding: "5px 10px" }} >
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
                    >Generate Password</Button>
                </> : null}

                <Button
                    className={removeFieldBtnStyles.root}
                >Remove Field</Button>
            </Box>
        </Box>
    </>);
}

export default FieldOptions;