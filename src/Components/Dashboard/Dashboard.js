import { useState, useEffect } from 'react';

import crypto from '../../Utils/crypto';
import initData from '../../initData';

import { Grid, Box, Typography } from '@mui/material';

import Timebar from './Timebar';
import Categories from './Categories';
import CredentialsList from './CredentialsList';
import CredentialData from './CredentialData/CredentialData';
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
    const { theme, state, setState } = props;

    // const [lockTime, updateLockTime] = useState({ m: 5, s: 0, lockAt: new Date().getTime() + 300000 });
    const [lockTime, updateLockTime] = useState({ m: 0, s: 0, lockAt: 0 });
    const [password, updatePassword] = useState('');
    const [isEditMode, updateEditModeStatus] = useState(false);

    const [selectedCategory, updateSelectedCategory] = useState('All');

    const [categories, updateCategories] = useState({});
    const [categoriesCount, updateCategoriesCount] = useState([]);

    const [entriesById, updateEntriesById] = useState(null);
    const [selectedEntryId, updateSelectedEntryId] = useState('');
    const [newEntryId, updateNewEntryId] = useState('');

    const [selectedFieldIndex, updateSelectedFieldIndex] = useState(0);

    const addNewEntry = () => {
        let id = "C" + new Date().getTime();

        setState((state) => {
            let data = {
                id,
                user: "",
                name: "Untitled",
                category: (selectedCategory === "All") ? "Passwords" : selectedCategory,
                data: (selectedCategory === "Cards") ? initData.cardData : []
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


            updateCategoriesCount((counts) => {
                let newCounts = [...counts];
                let prevCategory = newState.data.credentials[index].category;

                counts.forEach((count, index) => {
                    if (count.name === prevCategory) {
                        newCounts[0].count--;
                        newCounts[index].count--;
                        if (newCounts[index].count === 0) newCounts.splice(index, 1);
                    }
                });

                return newCounts;
            })

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
        
        setState((prevState) => {
            let newState = { ...prevState };
            
            let id = entryData.id;
            let index = getEntryIndexById(newState.data.credentials, id);

            if (newState.data.credentials[index].category !== entryData.category) {
                updateCategoriesCount((counts) => {
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

                    return newCounts;
                })
            }

            // if (!categories[entryData.category])

            newState.data.credentials[index] = entryData;

            let encryptedData = crypto.encrypt(JSON.stringify(newState.data), password);
            newState.encryptedData = encryptedData;
            localStorage.setItem("encryptedData", encryptedData);

            return newState;
        });

        updateEntriesById((entries) => ({ ...entries, [selectedEntryId]: entryData }))

    }

    useEffect(() => {
        // if (lockTime.m > 0 && lockTime.s > 0) 
        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27) updateSelectedEntryId('')
        }, false);
    }, []);

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
            ['Passwords', 'API Keys', 'Cards', 'Coupons'].forEach((category) => {
                if (categoriesCountObj[category]) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });
                else categoriesCountArr.push({ name: category, count: 0 });

                delete categoriesCountObj[category];
            })

            for (let category in categoriesCountObj) categoriesCountArr.push({ name: category, count: categoriesCountObj[category] });

            updateCategoriesCount(categoriesCountArr)
            updateEntriesById(credentialsById);

            if (newEntryId !== '') {
                updateSelectedEntryId(newEntryId);
            }
        }
        else updateEntriesById(null);

    }, [newEntryId, state.data]);


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
                    <Categories
                        categoriesCount={categoriesCount}
                        selectedCategory={selectedCategory}
                        updateSelectedCategory={updateSelectedCategory}
                    />
                </Grid>
                <Grid item xs={2.5} >
                    <CredentialsList
                        state={props.state}
                        selectedCategory={selectedCategory}
                        selectedEntryId={selectedEntryId}
                        updateSelectedEntryId={updateSelectedEntryId}
                        updateEditModeStatus={updateEditModeStatus}
                        addNewEntry={addNewEntry}
                    />
                </Grid>

                {(selectedEntryId !== '' && entriesById) ? <>
                    <Grid item xs={4} >
                        <CredentialData
                            theme={theme}
                            
                            isEditMode={isEditMode}
                            updateEditModeStatus={updateEditModeStatus}
                            
                            entriesById={entriesById}
                            selectedEntryId={selectedEntryId}
                            entryData={entriesById[selectedEntryId]}
                            
                            categories={categories}
                            selectedFieldIndex={selectedFieldIndex}
                            updateSelectedFieldIndex={updateSelectedFieldIndex}
                            
                            newEntryId={newEntryId}
                            updateNewEntryId={updateNewEntryId}

                            saveEntry={saveEntry}
                            deleteEntry={deleteEntry}
                            showSnack={props.showSnack}
                        />
                    </Grid>
                </> : <>
                    <Grid item xs={7.34} >
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
                    </Grid>
                </>}
            </Grid>
        </> : <>
            Mobile View
        </>}

        {((lockTime.m <= 0) && (lockTime.s <= 0)) && <LockScreen
            state={props.state}
            setState={props.setState}
            updateLockTime={updateLockTime}
            showSnack={props.showSnack}

            password={password}
            updatePassword={updatePassword}
        />}
    </>);
}

export default Dashboard;