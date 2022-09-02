const initState = {
    config: {
        theme: 'dark',
        isLoading: false,
        isLoggedIn: null,
        isSessionLocked: true,
        snack: { open: false, type: 'success', message: "" },
        entryOptionsMode: "EntryOptions",

        user: {
            name: '',
            email: '',
            image: ''
        }
    },

    lockTime: { m: 0, s: 0, lockAt: 0 },

    localStore: {
        dataFileId: null,
        encryptedData: '',
        password: '',
    },

    entries: {
        isEditMode: false,
        isTemplateMode: false,

        selectedCategory: "All",
        categories: {},
        categoriesCount: [],

        entriesById: null,
        selectedEntryId: '',
        newEntryId: '',

        selectedEntryIndex: -1,
        selectedFieldIndex: 0,

        drafts: {},
        entryData: null,

        savedEntries: [],
        modifiedEntries: [],
        templates: []
    }
}

function reducer(state = initState, action) {
    let props = action.payload;

    switch (action.type) {

        // Config
        case "setTheme": return { ...state, config: { ...state.config, theme: props.theme } }
        case "updateLoadingStatus": return { ...state, config: { ...state.config, isLoading: props.isLoading } }
        case "updateSnack": return { ...state, config: { ...state.config, snack: props.snack } }
        case "updateLoginStatus": return { ...state, config: { ...state.config, isLoggedIn: props.isLoggedIn } }
        case "updateIsSessionLocked": return { ...state, config: { ...state.config, isSessionLocked: props.isSessionLocked } }
        case "updateEntryOptionsMode": return { ...state, config: { ...state.config, entryOptionsMode: props.entryOptionsMode } }
        case "setUser": return { ...state, config: { ...state.config, user: props.user } }

        // lockTime
        case "updateLockTime": return { ...state, lockTime: { ...props.lockTime } }

        // LocalStore
        case "updateLocalStore": return { ...state, localStore: { ...state.localStore, ...props.localStore } }
        case "updatePassword": return { ...state, localStore: { ...state.localStore, password: props.password } }

        // Entries
        case "updateAllEntryAttributes": return { ...state, entries: { ...state.entries, ...props } }
        
        case "updateEditModeStatus": return { ...state, entries: { ...state.entries, isEditMode: props.isEditMode } }
        case "updateIsTemplateMode": return { ...state, entries: { ...state.entries, isTemplateMode: props.isTemplateMode } }

        case "updateSelectedCategory": return { ...state, entries: { ...state.entries, selectedCategory: props.selectedCategory } }
        case "updateCategories": return { ...state, entries: { ...state.entries, categories: props.categories } }
        case "updateCategoriesCount": return { ...state, entries: { ...state.entries, categoriesCount: props.categoriesCount } }
        case "updateEntriesById": return { ...state, entries: { ...state.entries, entriesById: props.entriesById } }
        case "updateSelectedEntryId": return { ...state, entries: { ...state.entries, selectedEntryId: props.selectedEntryId } }

        case "updateSelectedEntryIndex": return { ...state, entries: { ...state.entries, selectedEntryIndex: props.selectedEntryIndex } }
        case "updateSelectedFieldIndex": return { ...state, entries: { ...state.entries, selectedFieldIndex: props.selectedFieldIndex } }

        case "updateDrafts": return { ...state, entries: { ...state.entries, drafts: props.drafts } }
        case "updateEntryData": return { ...state, entries: { ...state.entries, entryData: props.entryData } }

        case "updateSavedEntries": return { ...state, entries: { ...state.entries, savedEntries: [...props.savedEntries] } }
        case "updateModifiedEntries": return { ...state, entries: { ...state.entries, modifiedEntries: [...props.modifiedEntries] } }

        case "updateTemplates": return { ...state, entries: { ...state.entries, templates: props.templates } }


        default: return state
    }
}

export default reducer;