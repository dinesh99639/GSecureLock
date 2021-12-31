import { Box } from "@mui/material";

import EntryInfo from './EntryInfo';
import Suggestions from './Suggestions';

function EntryOptions(props) {
    return (<>
        <Box
            className="borderBottom"
            style={{ 
                backgroundColor: "inherit", 
                color: "inherit", 
                height: "50%"
            }} 
        >
            <EntryInfo />
        </Box>

        <Box
            style={{ 
                backgroundColor: "inherit", 
                color: "inherit", 
                height: "50%"
            }} 
        >
            <Suggestions />
        </Box>
    </>);
}

export default EntryOptions;