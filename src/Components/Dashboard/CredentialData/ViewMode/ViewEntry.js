
import { Button, IconButton } from "@mui/material";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


function ViewEntry(props) {
    const { classes, tableStyles } = props;

    const { theme, Input, entryData, updateSelectedFieldIndex, copyText, openLink } = props;

    return (<>
        <Table className={tableStyles.table} >
            <TableBody>
                {entryData.data?.map((field, index) => {
                    if (field.type === "hidden") return null;

                    return <TableRow
                        key={index}
                        className={tableStyles.tableRow}
                        onClick={() => updateSelectedFieldIndex(index)}
                    >
                        <TableCell style={{ width: "38%" }} className={tableStyles.tableCell}>{field.name}</TableCell>
                        <TableCell style={{ width: "56%" }} className={tableStyles.tableCell}>
                            <Button
                                style={{ padding: 0 }}
                                sx={{
                                    "& .MuiTouchRipple-root": {
                                        color: (theme === "dark") ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)"
                                    }
                                }}
                            >
                                <Input
                                    readOnly
                                    disabled
                                    type={field.type}
                                    value={field.value}
                                    InputProps={{ className: classes.input }}
                                    sx={{
                                        "& .Mui-disabled": {
                                            cursor: "pointer",
                                            textFillColor: (theme === "dark") ? "white" : "black",
                                        }
                                    }}
                                    onClick={() => copyText(field.type, field.value)}
                                />
                            </Button>
                        </TableCell>
                        <TableCell style={{ width: "6%" }} className={tableStyles.tableCell} >
                            {(field.type === "password" || field.type === "text") &&
                                <IconButton style={{ color: "inherit" }} onClick={() => copyText(field.name, field.value)} >
                                    <ContentCopyIcon style={{ fontSize: "17px" }} />
                                </IconButton>
                            }
                            {(field.type === "link") &&
                                <IconButton style={{ color: "inherit" }} onClick={() => openLink(field.value)} >
                                    <OpenInNewIcon style={{ fontSize: "17px" }} />
                                </IconButton>
                            }
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </>);
}

export default ViewEntry;