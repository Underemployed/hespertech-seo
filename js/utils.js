function loadHTML(elementId, filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById(elementId).innerHTML = xhr.responseText;
        } else {
            console.error(`Error loading ${filePath}:`, xhr.status, xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(`Request for ${filePath} failed`);
    };
    xhr.send();
}
