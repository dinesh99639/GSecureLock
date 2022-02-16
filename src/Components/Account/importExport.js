import { makeStyles } from "@mui/styles";

import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

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
        <Box>
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "10px 0" }} >Import</Typography>
            <Grid container>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Import a plain text file</Typography>
                        <TextField
                            variant="standard"
                            placeholder="New password"
                            type="password"
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
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
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
                    </Paper>
                </Grid>
            </Grid>
        </Box>

        <Box>
            <Typography sx={{ fontSize: "18px", textAlign: "center", padding: "40px 0 10px 0" }} >Export</Typography>
            <Grid container>
                <Grid item xs={6} >
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Export as a plain text file</Typography>
                        <TextField
                            variant="standard"
                            placeholder="Session password"
                            type="password"
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
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "10px 0",
                            margin: "0 10px",
                            backgroundColor: "inherit",
                            color: "inherit"
                        }}
                    >
                        <Typography>Export as an encrypted file</Typography>
                        <Typography sx={{ padding: "16px", fontSize: "12px" }} >Password is same as the session password</Typography>
                        <Button
                            variant="contained"
                            sx={{
                                fontSize: "12px"
                            }}
                        >Export</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </>);
}

export default ImportExport;