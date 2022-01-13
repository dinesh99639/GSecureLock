import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import crypto from '../../Utils/crypto';
import initData from '../../initData';

import { Grid, Box, Typography } from '@mui/material';

import Timebar from './Timebar';
import Categories from './Categories';
import CredentialsList from './CredentialsList';
import CredentialDetails from './CredentialDetails/CredentialDetails';

import LockScreen from './LockScreen';

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;
    const dispatch = useDispatch();

    const [password, updatePassword] = useState('');
    const [isSessionLocked, updateIsSessionLocked] = useState(true);


    const { selectedCategory, entriesById, selectedEntryId, categoriesCount, newEntryId, selectedEntryIndex, savedEntries, modifiedEntries, templates } = useSelector((state) => state.entries);
    const { dataFileId } = useSelector((state) => state.localStore);

    const updateEditModeStatus = useCallback((isEditMode) => dispatch({ type: "updateEditModeStatus", payload: { isEditMode } }), [dispatch]);
    const updateCategories = useCallback((categories) => dispatch({ type: "updateCategories", payload: { categories } }), [dispatch]);
    const updateCategoriesCount = useCallback((categoriesCount) => dispatch({ type: "updateCategoriesCount", payload: { categoriesCount } }), [dispatch]);
    const updateEntriesById = useCallback((entriesById) => dispatch({ type: "updateEntriesById", payload: { entriesById } }), [dispatch]);
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);
    const updateNewEntryId = useCallback((newEntryId) => dispatch({ type: "updateNewEntryId", payload: { newEntryId } }), [dispatch]);

    const updateEntryData = useCallback((entryData) => dispatch({ type: "updateEntryData", payload: { entryData } }), [dispatch]);
    const updateSavedEntries = useCallback((savedEntries) => dispatch({ type: "updateSavedEntries", payload: { savedEntries } }), [dispatch]);
    const updateModifiedEntries = useCallback((modifiedEntries) => dispatch({ type: "updateModifiedEntries", payload: { modifiedEntries } }), [dispatch]);

    const updateLocalStore = useCallback((localStore) => dispatch({ type: "updateLocalStore", payload: { localStore } }), [dispatch]);

    const addNewEntry = () => {
        let id = "C" + new Date().getTime();

        let newEntryData = {
            id,
            user: "",
            name: "Untitled",
            category: (selectedCategory === "All") ? "Passwords" : selectedCategory,
            data: (selectedCategory === "Cards") ? initData.cardData : [],

            createdAt: new Date().toString().substring(0, 24),
            lastModifiedAt: new Date().toString().substring(0, 24)
        }

        updateSavedEntries([...savedEntries, newEntryData]);
        updateModifiedEntries([...modifiedEntries, newEntryData]);

        updateNewEntryId(id);
        updateEditModeStatus(true);
    }

    const deleteEntry = (id, closeDeleteConfirmationModal) => {
        let newSavedEntries = [...savedEntries];
        let newmodifiedEntries = [...modifiedEntries];

        // updateCategoriesCount
        let counts = [...categoriesCount];
        let newCounts = [...categoriesCount];
        let prevCategory = newSavedEntries[selectedEntryIndex].category;

        counts.forEach((count, index) => {
            if (count.name === prevCategory) {
                newCounts[0].count--;
                newCounts[index].count--;
                if (newCounts[index].count === 0) {
                    let isStaticCategory = false;

                    for (var i in initData.staticCategories) {
                        if (initData.staticCategories[i] === newCounts[index].name)
                            isStaticCategory = true;
                    }
                    if (!isStaticCategory) newCounts.splice(index, 1);
                }
            }
        });
        updateCategoriesCount(newCounts);


        newSavedEntries.splice(selectedEntryIndex, 1);
        newmodifiedEntries.splice(selectedEntryIndex, 1);

        let encryptedData = crypto.encrypt(JSON.stringify({ templates, credentials: newSavedEntries }), password);

        updateLocalStore({ dataFileId, encryptedData });
        updateSavedEntries(newSavedEntries);
        updateModifiedEntries(newmodifiedEntries);

        localStorage.setItem("encryptedData", encryptedData);

        updateSelectedEntryId('');
        closeDeleteConfirmationModal();
    }

    const saveEntry = (entryData) => {
        let newEntryData = { ...entryData };
        let newSavedEntries = [...savedEntries];
        let newmodifiedEntries = [...modifiedEntries];

        newEntryData.lastModifiedAt = new Date().toString().substring(0, 24);

        if (newSavedEntries[selectedEntryIndex].category !== newEntryData.category) {
            let counts = [...categoriesCount];
            let newCounts = [...counts];
            let prevCategory = newSavedEntries[selectedEntryIndex].category;
            let currCategory = newEntryData.category;

            let isNewCategoryFound = false;

            counts.forEach((count, index) => {
                if (count.name === prevCategory) {
                    newCounts[0].count--;
                    newCounts[index].count--;
                    if (newCounts[index].count === 0) newCounts.splice(index, 1);
                }
                if (count.name === currCategory) {
                    newCounts[0].count++;
                    newCounts[index].count++;
                    isNewCategoryFound = true;
                }
            });

            if (!isNewCategoryFound) {
                newCounts[0].count++;
                newCounts.push({ name: currCategory, count: 1 })
            }
            updateCategoriesCount(newCounts);
        }

        newSavedEntries[selectedEntryIndex] = newEntryData;
        newmodifiedEntries[selectedEntryIndex] = newEntryData;

        let encryptedData = crypto.encrypt(JSON.stringify({ templates, credentials: newSavedEntries }), password);

        updateLocalStore({ dataFileId, encryptedData });
        updateEntryData(newEntryData);
        updateSavedEntries(newSavedEntries);
        updateModifiedEntries(newmodifiedEntries);
        // console.log(newSavedEntries, newmodifiedEntries)

        localStorage.setItem("encryptedData", encryptedData);

        updateEntriesById({ ...entriesById, [selectedEntryId]: newEntryData })
    }

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key  === "Escape") updateSelectedEntryId('')
        }, false);
    }, [updateSelectedEntryId]);

    useEffect(() => {

        if (savedEntries) {
            let credentialsById = {};
            let categoriesCountObj = {};
            let categoriesCountArr = [];
            let totalEntries = 0;
            savedEntries.forEach((entry) => {
                credentialsById[entry.id] = entry;

                if (categoriesCountObj[entry.category]) categoriesCountObj[entry.category]++;
                else categoriesCountObj[entry.category] = 1;

                totalEntries++;
            });
            updateCategories({ ...categoriesCountObj });

            categoriesCountArr.push({ name: 'All', count: totalEntries });
            initData.staticCategories.forEach((category) => {
                if (categoriesCountObj[category]) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });
                else categoriesCountArr.push({ name: category, count: 0 });

                delete categoriesCountObj[category];
            })

            for (let category in categoriesCountObj) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });

            updateCategoriesCount(categoriesCountArr)
            updateEntriesById(credentialsById);

            if (newEntryId !== '') {
                updateSelectedEntryId(newEntryId);
                updateNewEntryId('');
            }
        }
        else updateEntriesById(null);

    }, [newEntryId, savedEntries, updateCategories, updateCategoriesCount, updateEntriesById, updateSelectedEntryId, updateNewEntryId]);


    return (<>
        {(isDesktop) ? <>
            {(!isSessionLocked) ? <>
                <Grid container style={{ display: "flex", flex: 1 }} >
                    <Grid item xs={0.46} >
                        <Timebar 
                            updateIsSessionLocked={updateIsSessionLocked}
                        />
                    </Grid>
                    <Grid item xs={1.7} >
                        <Categories />
                    </Grid>
                    <Grid item xs={2.5} >
                        <CredentialsList
                            addNewEntry={addNewEntry}
                        />
                    </Grid>

                    <Grid item xs={7.34} >
                        {(selectedEntryId !== '' && entriesById) ? <>
                            <CredentialDetails
                                saveEntry={saveEntry}
                                deleteEntry={deleteEntry}
                            />
                        </> : <>
                            <Box
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Typography style={{ fontSize: "25px" }} >GSecurePass</Typography>
                                <Typography style={{ fontSize: "15px" }} >A secure password manager</Typography>
                            </Box>
                        </>}
                    </Grid>

                </Grid>
            </> : null}
        </> : <>
            Mobile View
        </>}

        {(isSessionLocked) && <LockScreen
            updateIsSessionLocked={updateIsSessionLocked}

            password={password}
            updatePassword={updatePassword}
        />}
    </>);
}

export default Dashboard;