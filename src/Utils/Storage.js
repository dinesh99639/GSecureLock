const storage = {
    get: async (key) => localStorage.getItem(key),
    set: async (key, value) => localStorage.setItem(key, value)
}

export default storage;