const initState = {
    config: {
        theme: 'dark',
        isLoading: false,
        snack: { open: false, type: 'success', message: "" },
    },

    state: {
        isLoggedIn: null,
        dataFileId: null,
        encryptedData: '',
        data: ''
    },

    entries: {
        isEditMode: false,

        selectedCategory: "All",
        categories: {},
        categoriesCount: [],

        entriesById: null,
        selectedEntryId: '',
        newEntryId: '',

        selectedFieldIndex: 0,

        drafts: {},

        entryData: null
    },

}

function reducer(state = initState, action) {
    let props = action.payload;

    switch (action.type) {

        // Config
        case "setTheme":            return { ...state, config: { ...state.config, theme: props.theme } }
        case "updateLoadingStatus": return { ...state, config: { ...state.config, isLoading: props.isLoading } }
        case "updateSnack":         return { ...state, config: { ...state.config, snack: props.snack } }

        // Entries
        case "updateEditModeStatus":    return { ...state, entries: { ...state.entries, isEditMode: props.isEditMode } }
        case "updateSelectedCategory":  return { ...state, entries: { ...state.entries, selectedCategory: props.selectedCategory } }
        case "updateCategories":        return { ...state, entries: { ...state.entries, categories: props.categories } }
        case "updateCategoriesCount":   return { ...state, entries: { ...state.entries, categoriesCount: props.categoriesCount } }
        case "updateEntriesById":       return { ...state, entries: { ...state.entries, entriesById: props.entriesById } }
        case "updateSelectedEntryId":   return { ...state, entries: { ...state.entries, selectedEntryId: props.selectedEntryId } }
        case "updateSelectedFieldIndex":return { ...state, entries: { ...state.entries, selectedFieldIndex: props.selectedFieldIndex } }
        case "updateDrafts":            return { ...state, entries: { ...state.entries, drafts: props.drafts } }
        case "updateEntryData":         return { ...state, entries: { ...state.entries, entryData: props.entryData } }


        default: return state
    }
}

export default reducer;