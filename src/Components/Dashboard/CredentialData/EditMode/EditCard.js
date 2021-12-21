import { darkTheme } from '../../../../Theme';

import { Box, Button } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, Select, MenuItem } from "@mui/material";


function EditCard(props) {
    const { classes, tableStyles } = props;
    
    const { Input, entryData, updateCardData, saveEntry, theme } = props;

    return (<>
        <Table className={tableStyles.table} >
            <TableBody>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Card Name
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Input
                            name="cardName"
                            fullWidth
                            value={entryData.data.cardName}
                            InputProps={{ className: classes.input }}
                            onChange={updateCardData}
                        />
                    </TableCell>
                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Card Type
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Select
                            variant="standard"
                            name="cardType"
                            value={entryData.data.cardType}
                            className={classes.root}
                            style={{
                                width: "100%",
                                backgroundColor: "inherit",
                                color: "inherit"
                            }}
                            MenuProps={{
                                sx: {
                                    "& .MuiPaper-root": {
                                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : null,
                                        color: "inherit",
                                    }
                                }
                            }}
                            onChange={updateCardData}
                        >
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                        </Select>
                    </TableCell>

                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Network
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Select
                            variant="standard"
                            name="network"
                            value={entryData.data.network}
                            className={classes.root}
                            style={{ width: "100%", backgroundColor: "inherit", color: "inherit" }}
                            MenuProps={{
                                sx: {
                                    "& .MuiPaper-root": {
                                        backgroundColor: (theme === "dark") ? darkTheme.backgroundColor : null,
                                        color: "inherit"
                                    }
                                }
                            }}
                            onChange={updateCardData}
                        >
                            <MenuItem value="VISA">VISA</MenuItem>
                            <MenuItem value="MasterCard">MasterCard</MenuItem>
                            <MenuItem value="RuPay">RuPay</MenuItem>
                            <MenuItem value="American Express">American Express</MenuItem>
                        </Select>
                    </TableCell>

                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Card Number
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Input
                            name="cardNo"
                            fullWidth
                            value={entryData.data.cardNo}
                            InputProps={{ className: classes.input }}
                            onChange={updateCardData}
                        />
                    </TableCell>
                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Valid Thru
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Input
                            name="validThru"
                            fullWidth
                            value={entryData.data.validThru}
                            InputProps={{ className: classes.input }}
                            onChange={updateCardData}
                        />
                    </TableCell>
                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        Card Holder Name
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Input
                            name="cardHolderName"
                            fullWidth
                            value={entryData.data.cardHolderName}
                            InputProps={{ className: classes.input }}
                            onChange={updateCardData}
                        />
                    </TableCell>
                </TableRow>
                <TableRow className={tableStyles.tableRow} >
                    <TableCell style={{ width: "41%" }} className={tableStyles.tableCell}>
                        CVV
                    </TableCell>
                    <TableCell style={{ width: "59%" }} className={tableStyles.tableCell}>
                        <Input
                            fullWidth
                            type="password"
                            name="CVV"
                            value={entryData.data.CVV}
                            InputProps={{ className: classes.input }}
                            onChange={updateCardData}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Box style={{ padding: "15px", display: "flex", justifyContent: "center" }} >
            <Button
                variant="standard"
                style={{ backgroundColor: "#0088fd", color: "white", margin: "0 10px", padding: "3px 12px", minWidth: "0", textTransform: "none" }}
                onClick={() => saveEntry(entryData)}
            >Save</Button>
        </Box>
    </>);
}

export default EditCard;