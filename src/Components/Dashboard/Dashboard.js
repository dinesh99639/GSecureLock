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


const getEntryIndexById = (credentials, id) => {
    let index = null;

    credentials.every((entry, idx) => {
        if (entry.id === id) {
            index = idx;
            return false;
        }
        return true;
    })

    return index;
}

function Dashboard(props) {
    const isDesktop = window.innerWidth > 760;
    const dispatch = useDispatch();

    const { state, setState } = props;

    // const [lockTime, updateLockTime] = useState({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 });
    const [lockTime, updateLockTime] = useState({ m: 0, s: 0, lockAt: 0 });
    const [password, updatePassword] = useState('');


    const { selectedCategory, entriesById, selectedEntryId, categoriesCount, newEntryId } = useSelector((state) => state.entries);

    const updateEditModeStatus = useCallback((isEditMode) => dispatch({ type: "updateEditModeStatus", payload: { isEditMode } }), [dispatch]);
    const updateCategories = useCallback((categories) => dispatch({ type: "updateCategories", payload: { categories } }), [dispatch]);
    const updateCategoriesCount = useCallback((categoriesCount) => dispatch({ type: "updateCategoriesCount", payload: { categoriesCount } }), [dispatch]);
    const updateEntriesById = useCallback((entriesById) => dispatch({ type: "updateEntriesById", payload: { entriesById } }), [dispatch]);
    const updateSelectedEntryId = useCallback((selectedEntryId) => dispatch({ type: "updateSelectedEntryId", payload: { selectedEntryId } }), [dispatch]);
    const updateNewEntryId = useCallback((newEntryId) => dispatch({ type: "updateNewEntryId", payload: { newEntryId } }), [dispatch]);


    const addNewEntry = () => {
        let id = "C" + new Date().getTime();

        setState((state) => {
            let data = {
                id,
                user: "",
                name: "Untitled",
                category: (selectedCategory === "All") ? "Passwords" : selectedCategory,
                data: (selectedCategory === "Cards") ? initData.cardData : [],

                createdAt: new Date().toString().substring(0, 24),
                lastModifiedAt: new Date().toString().substring(0, 24)
            }

            return {
                ...state,
                data: {
                    ...state.data,
                    credentials: [...state.data.credentials, data]
                }
            };
        });

        updateNewEntryId(id);
        updateEditModeStatus(true);
    }

    const deleteEntry = (id, closeDeleteConfirmationModal) => {
        setState((prevState) => {
            let newState = { ...prevState };

            let index = getEntryIndexById(newState.data.credentials, id);

            // updateCategoriesCount
            let counts = [...categoriesCount];
            let newCounts = [...categoriesCount];
            let prevCategory = newState.data.credentials[index].category;

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


            newState.data.credentials.splice(index, 1);

            let encryptedData = crypto.encrypt(JSON.stringify(newState.data), password);
            newState.encryptedData = encryptedData;
            localStorage.setItem("encryptedData", encryptedData);

            updateSelectedEntryId('');
            closeDeleteConfirmationModal();
            return newState;
        })
    }

    const saveEntry = (entryData) => {
        entryData.lastModifiedAt = new Date().toString().substring(0, 24);

        setState((prevState) => {
            let newState = { ...prevState };

            let id = entryData.id;
            let index = getEntryIndexById(newState.data.credentials, id);

            if (newState.data.credentials[index].category !== entryData.category) {
                let counts = [...categoriesCount];
                let newCounts = [...counts];
                let prevCategory = newState.data.credentials[index].category;
                let currCategory = entryData.category;

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

            // if (!categories[entryData.category])

            newState.data.credentials[index] = entryData;

            let encryptedData = crypto.encrypt(JSON.stringify(newState.data), password);
            newState.encryptedData = encryptedData;
            localStorage.setItem("encryptedData", encryptedData);

            return newState;
        });

        updateEntriesById({ ...entriesById, [selectedEntryId]: entryData })

    }

    useEffect(() => {
        // if (lockTime.m > 0 && lockTime.s > 0) 
        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27) updateSelectedEntryId('')
        }, false);
    }, [updateSelectedEntryId]);

    useEffect(() => {
        if ((lockTime.m <= 0) && (lockTime.s <= 0)) {
            setState((state) => ({ ...state, data: null }));
        }
    }, [lockTime, setState]);

    useEffect(() => {
        let data = state.data;

        if (data) {
            let credentialsById = {};
            let categoriesCountObj = {};
            let categoriesCountArr = [];
            let totalEntries = 0;
            data.credentials.forEach((entry) => {
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

    }, [newEntryId, state.data, updateCategories, updateCategoriesCount, updateEntriesById, updateSelectedEntryId, updateNewEntryId]);


    return (<>
        {(isDesktop) ? <>
            <Grid container style={{ display: "flex", flex: 1 }} >
                <Grid item xs={0.46} >
                    <Timebar
                        lockTime={lockTime}
                        updateLockTime={updateLockTime}
                    />
                </Grid>
                <Grid item xs={1.7} >
                    <Categories />
                </Grid>
                <Grid item xs={2.5} >
                    <CredentialsList
                        state={props.state}
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
        </> : <>
            Mobile View
        </>}

        {((lockTime.m <= 0) && (lockTime.s <= 0)) && <LockScreen
            state={props.state}
            setState={props.setState}
            updateLockTime={updateLockTime}

            password={password}
            updatePassword={updatePassword}
        />}
    </>);
}

export default Dashboard;