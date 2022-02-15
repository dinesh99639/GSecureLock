import { makeStyles } from "@mui/styles";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";

const useStyles = makeStyles({
    root: {
        borderBottom: "1px solid white",
        margin: "30px 5px"
    },
    input: {
        color: "inherit"
    },
});

function ImportExport(props) {
    const classes = useStyles();

    return (<>
        <Box
            sx={{
                margin: "0 10px"
            }}
        >
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "10px 0" }} >Import</Typography>
            <Grid container>
                <Grid item className="borderRight" 
                    xs={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "10px 0"
                    }}
                >
                    <Typography>Import a plain text file</Typography>
                    <TextField
                        variant="standard"
                        placeholder="New password"
                        className={classes.root}
                        InputProps={{
                            className: classes.input
                        }}
                        inputProps={{ style: { textAlign: 'center' } }}
                        InputLabelProps={{
                            style: { color: 'inherit' },
                        }}
                        style={{ margin: "10px 0" }}
                    />
                    <Button 
                        variant="contained"
                        sx={{
                            fontSize: "12px"
                        }}
                    >Import</Button>
                </Grid>
                <Grid item
                    xs={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "10px 0"
                    }}
                >
                    <Typography>Import an encrypted file</Typography>
                    <Typography sx={{ padding: "16px", fontSize: "12px" }} >Password is same as the time of exporting</Typography>
                    <Button 
                        variant="contained"
                        sx={{
                            fontSize: "12px"
                        }}
                    >Import</Button>
                </Grid>
            </Grid>
        </Box>

        <Box
            sx={{
                margin: "0 10px"
            }}
        >
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "40px 0 10px 0" }} >Export</Typography>
            <Grid container>
                <Grid item className="borderRight" 
                    xs={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "10px 0"
                    }}
                >
                    <Typography>Export a plain text file</Typography>
                    <TextField
                        variant="standard"
                        placeholder="Session password"
                        className={classes.root}
                        InputProps={{
                            className: classes.input
                        }}
                        inputProps={{ style: { textAlign: 'center' } }}
                        InputLabelProps={{
                            style: { color: 'inherit' },
                        }}
                        style={{ margin: "10px 0" }}
                    />
                    <Button 
                        variant="contained"
                        sx={{
                            fontSize: "12px"
                        }}
                    >Export</Button>
                </Grid>
                <Grid item
                    xs={6}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "10px 0"
                    }}
                >
                    <Typography>Export an encrypted file</Typography>
                    <Typography sx={{ padding: "16px", fontSize: "12px" }} >Password is same as the session password</Typography>
                    <Button 
                        variant="contained"
                        sx={{
                            fontSize: "12px"
                        }}
                    >Export</Button>
                </Grid>
            </Grid>
        </Box>
    </>);
}

export default ImportExport;