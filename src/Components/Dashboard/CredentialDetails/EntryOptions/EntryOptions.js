import { Box } from "@mui/material";

import EntryInfo from './EntryInfo';
import FieldOptions from "./FieldOptions";
import Suggestions from './Suggestions';

function EntryOptions(props) {
    const { theme, isEditMode, entryData, updateEntryData, selectedFieldIndex, updateSelectedFieldIndex, updateIsUpdateFromFieldOptions } = props;

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
                    theme={theme}
                    selectedFieldIndex={selectedFieldIndex}
                    updateSelectedFieldIndex={updateSelectedFieldIndex}
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