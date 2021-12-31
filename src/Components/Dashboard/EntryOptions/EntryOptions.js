import { Box } from "@mui/material";

import EntryInfo from './EntryInfo';
import FieldOptions from "./FieldOptions";
import Suggestions from './Suggestions';

function EntryOptions(props) {
    const { isEditMode } = props;

    return (<>
        <Box
            className="borderBottom"
            style={{ 
                backgroundColor: "inherit", 
                color: "inherit", 
                height: "50%"
            }} 
        >
            {(isEditMode) ? <>
                <FieldOptions />
            </> : <>
                <EntryInfo />
            </>}
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