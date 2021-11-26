// Get files from app data
exports.getAllFiles = async () => {
    return await window.gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        // fields: 'files(id, name)',
        pageSize: 100
    }).then((res) => res.result)
}

exports.createFile = async () => {
    return await window.gapi.client.drive.files.create({
        resource: {
            'name': 'data',
            'parents': ['appDataFolder']
        }
    }).then((res) => res.result);
}

exports.removeAllFiles = () => {
    exports.getAllFiles().then((res) => {
        res.files.forEach((file) => {
            window.gapi.client.request({
                'path': '/drive/v3/files/' + file.id,
                'method': 'DELETE'
            }).execute((res) => {
                console.log(res)
            });
        })
    })
}

exports.updateFile = async (fileId, data) => {
    return await window.gapi.client.request({
        'path': '/upload/drive/v3/files/' + fileId,
        'method': 'PATCH',
        'params': { 'uploadType': 'multipart' },
        'body': data
    }).then((res) => res.result);
}

exports.downloadFile = async (fileId) => {
    return await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
    }).then((res) => res)
}