import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import CredentialData from './CredentialData/CredentialData';
import EntryOptions from './EntryOptions/EntryOptions';

function CredentialDetails(props) {
    const {
        theme,
        isEditMode,
        updateEditModeStatus,
        entriesById,
        selectedEntryId,
        categories,
        selectedFieldIndex,
        updateSelectedFieldIndex,
        newEntryId,
        updateNewEntryId,
        saveEntry,
        deleteEntry,
    } = props;

    const [entryData, updateEntryData] = useState(entriesById[selectedEntryId]);
    const [isUpdateFromFieldOptions, updateIsUpdateFromFieldOptions] = useState(false);

    useEffect(() => {
        updateEntryData(entriesById[selectedEntryId])
    }, [entriesById, selectedEntryId])

    return (<>
        <Grid container style={{ height: "100%" }} >
            <Grid item xs={6.54}>
                <CredentialData
                    theme={theme}

                    isEditMode={isEditMode}
                    updateEditModeStatus={updateEditModeStatus}

                    entriesById={entriesById}
                    selectedEntryId={selectedEntryId}
                    entryData={entryData}
                    updateEntryData={updateEntryData}

                    categories={categories}
                    selectedFieldIndex={selectedFieldIndex}
                    updateSelectedFieldIndex={updateSelectedFieldIndex}

                    newEntryId={newEntryId}
                    updateNewEntryId={updateNewEntryId}

                    saveEntry={saveEntry}
                    deleteEntry={deleteEntry}
                    showSnack={props.showSnack}
                    
                    isUpdateFromFieldOptions={isUpdateFromFieldOptions}
                    updateIsUpdateFromFieldOptions={updateIsUpdateFromFieldOptions}
                />
            </Grid>
            <Grid item xs={5.46}>
                <EntryOptions
                    theme={theme}
                    isEditMode={isEditMode}

                    selectedFieldIndex={selectedFieldIndex}
                    updateSelectedFieldIndex={updateSelectedFieldIndex}
                    entryData={entryData}

                    saveEntry={saveEntry}

                    updateIsUpdateFromFieldOptions={updateIsUpdateFromFieldOptions}
                />
            </Grid>
        </Grid>
    </>);
}

export default CredentialDetails;