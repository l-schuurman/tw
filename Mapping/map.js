function createEmptyMap() {
    map = document.getElementById('map');
    for(let x = 330; x <= 670; x++) {
        for(let y = 330; y <= 670; y++) {
            div = document.createElement('div');
            div.id = String(x) + String(y);
            map.appendChild(div);
        }
    }
}