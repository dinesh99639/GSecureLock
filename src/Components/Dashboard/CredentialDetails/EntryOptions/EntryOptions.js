import { useSelector } from 'react-redux';

import { Box } from "@mui/material";

import EntryInfo from './EntryInfo';
import FieldOptions from "./FieldOptions";
import Suggestions from './Suggestions';

function EntryOptions(props) {
    const { entryData, updateEntryData, updateIsUpdateFromFieldOptions } = props;

    const { isEditMode } = useSelector((state) => state.entries);

    return (<>
        <Box
            className="borderBottom"
            style={{
                backgroundColor: "inherit",
                color: "inherit",
                height: "50%"
            }}
        >
            {(isEditMode && (entryData.category !== "Cards")) ? <>
                <FieldOptions
                    entryData={entryData}
                    updateEntryData={updateEntryData}
                    updateIsUpdateFromFieldOptions={updateIsUpdateFromFieldOptions}
                />
            </> : <>
                <EntryInfo
                    entryData={entryData}
                />
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