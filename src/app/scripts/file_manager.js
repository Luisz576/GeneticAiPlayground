export function downloadFile(fileContent) {
    if(!fileContent) fileContent = {}
    fileContent = JSON.stringify(fileContent)
    const link = document.createElement("a")
    const file = new Blob([fileContent], { type: 'application/json' })
    link.href = URL.createObjectURL(file)
    link.download = "dinos.json"
    link.click()
    URL.revokeObjectURL(link.href)
};

export function requestFile(callback){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        callback(event.target)
    };

    input.click();
}

export function loadFile(inputFile, callback){
    if(!inputFile){
        console.error('input file is undefined!')
        return
    }
    const file = inputFile.files[0]
    if (!file || !file.name.endsWith('.json')) {
        console.error("File doesn't end with '.json'")
        return
    }
    const reader = new FileReader()
    reader.onload = function(event) {
        try {
            callback(JSON.parse(event.target.result))
        } catch (error) {
            console.error(error)
        }
    };
    reader.readAsText(file)
}