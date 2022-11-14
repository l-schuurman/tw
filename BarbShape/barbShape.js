

const buildings = ["main", "barracks", "stable", "garage", "watchtower", "snob", "smith", "place", "market", "wood", "stone", "iron", "farm", "storage", "hide", "wall"]

const cats = [0, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 15, 16, 17, 19, 20];

const rams = [0, 2, 4, 7, 10, 14, 19, 24, 30, 37, 45, 55, 65, 77, 91, 106, 124, 143, 166, 191, 219];

const minimums = {
    "main": 1,
    "farm": 1,
    "storage": 1,
    "hide": 10
}

let offDistArray = [];
let defDistArray = [];
let origins = [];

let offVillages = [];
let defVillages = [];

function updateOff() {
    input = document.getElementById("offText").value;
    offVillages = input.match(/\d+\|\d+/gm);

    displayList("offList", offVillages, "off")
    calcDistances();
}

function updateDef() {
    input = document.getElementById("defText").value;
    defVillages = input.match(/\d+\|\d+/gm);

    displayList("defList", defVillages, "def")
    calcDistances();
}

function displayList(id, arr, type) {
    ul = document.getElementById(id);

    deleteAllChildren(ul);

    for (const village of arr) {
        li = document.createElement('li');
        li.innerHTML = village;
        li.id = getKeyByValue(villageIDs, village) + "_" + type;
        ul.appendChild(li);
    }
}

function calcDistances() {
    if (!(offVillages.length > 0) || !(defVillages.length > 0)) {
        const table = document.getElementById("tableData");
        deleteAllChildren(table);
        return null;
    }

    offDistArray = [];
    defDistArray = [];

    for (let row = 0; row < data.length; row++) {
        obj = {};
        offDistSubArray = []
        defDistSubArray = []
        diffDistSubArray = []

        a = data[row].target.split("|");
        x2 = a[0];
        y2 = a[1];

        for (const origin of defVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            defDistSubArray.push(dist);
        }

        defDistArray.push(defDistSubArray);

        minDef = Math.min(...defDistSubArray);
        index = defDistSubArray.indexOf(minDef);

        data[row].launch = defVillages[index];
        data[row].launchID = getKeyByValue(villageIDs, data[row].launch);
        data[row].defDistance = minDef;

        for (const origin of offVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            offDistSubArray.push(dist);

            diffDist = minDef - dist;
            diffDistSubArray.push(diffDist);
        }
        
        withinVillages = diffDistSubArray.filter(element => element >= 0);

        if(withinVillages.length > 0) {
            minOff = Math.min(...withinVillages)
            index = diffDistSubArray.indexOf(minOff);
            minOff = offDistSubArray[index]
        } else {
            minOff = Math.min(...offDistSubArray);
            index = offDistSubArray.indexOf(minOff);
        }


        data[row].offLaunch = offVillages[index];
        data[row].offLaunchID = getKeyByValue(villageIDs, data[row].offLaunch);
        data[row].offDistance = minOff;
    }

    sortVillages();
    redisplayVillages();
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] == value);
}

function redisplayVillages() {
    const table = document.getElementById("tableData");
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }

    for (row = 0; row < data.length; row++) {
        // if (data[row].offDistance <= data[row].defDistance /*|| Number(data[row]["wall"]) === 0*/) {
            // if (data[row].offDistance > data[row].defDistance && Number(data[row]["wall"]) > 0) {
            div = document.createElement('div');
            div.id = data[row].ID;
            div.className = "coord";

            div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

            launchTo = document.createElement("a");
            launchTo.setAttribute("href", "https://en131.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=info_village&id=" + data[row].ID);
            launchTo.setAttribute("target", "_blank");
            launchTo.innerHTML = data[row].target;

            div.appendChild(launchTo);

            table.appendChild(div);

            div = document.createElement('div');
            div.className = "coord";

            div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

            launchFrom = document.createElement('a');
            launchFrom.innerHTML = data[row].launch;
            launchFrom.setAttribute("href", "https://en131.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=overview");
            launchFrom.setAttribute("target", "_blank");

            div.appendChild(launchFrom);

            table.appendChild(div);

            div = document.createElement('div');
            div.className = "coord";

            div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

            launchFrom = document.createElement('a');
            launchFrom.innerHTML = data[row].offLaunch;
            launchFrom.setAttribute("href", "https://en131.tribalwars.net/game.php?village=" + data[row].offLaunchID + "&screen=overview");
            launchFrom.setAttribute("target", "_blank");

            div.appendChild(launchFrom);

            table.appendChild(div);

            div = createDiv(Math.round(data[row].defDistance * 10) / 10);

            div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

            table.appendChild(div);

            div = createDiv(Math.round(data[row].offDistance * 10) / 10);

            div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

            table.appendChild(div);

            for (const building of buildings) {
                level = data[row][building];

                div = document.createElement('div');
                div.innerHTML = level;
                div.className = "data";

                div.className += data[row].offDistance > data[row].defDistance ? " tint" : ""

                div.id = data[row].ID + "_" + building;

                if (isClickable(building, level)) {
                    div.className += " clickable";
                }
                table.appendChild(div)
            }
        // }
    }

}

function sortVillages() {
    data = data.sort((v1, v2) => (v1.defDistance > v2.defDistance) ? 1 : (v1.defDistance < v2.defDistance) ? -1 : 0);
}

function check() {
    console.log(origins, distArray);
}

function createTableHeader() {
    table = document.getElementById('tableHeader');

    div = createDiv("Village");
    div.className = "header";
    table.appendChild(div);

    div = createDiv("Cat Launch");
    div.className = "header";
    table.appendChild(div);

    div = createDiv("Ram Launch");
    div.className = "header";
    table.appendChild(div);

    div = createDiv("Cat Dist");
    div.className = "header";
    table.appendChild(div);

    div = createDiv("Ram Dist");
    div.className = "header";
    table.appendChild(div);

    for (const building of buildings) {
        div = createDiv("");
        div.className = "header"
        img = document.createElement('img');
        img.src = "../assets/buildings/" + building + ".png";
        div.appendChild(img);
        table.appendChild(div)
    }
}

function createDiv(datum) {
    div = document.createElement('div');
    div.innerHTML = datum;
    return div;
}

function getID(ID, datum) {
    return ID + datum;
}

// function addButtonClick() {
//     btns = document.querySelectorAll(".data");
//     console.log(btns);
//     for (let i = 0; i < btns.length; i++) {
//         btns[i].addEventListener("click", sendCats);
//     }
// }

function addButtonClick() {
    btns = document.querySelector("#tableData");
    btns.addEventListener("click", sendCats);
    document.getElementById("check").addEventListener("click", check);
    document.querySelectorAll("ul").forEach(element => { element.addEventListener("click", sendCats) });
}

function removeVillage(id, unit) {
    console.log(id);
    coord = villageIDs[id];
    console.log(coord);
    if (unit == "off") {
        console.log(offVillages);
        offVillages = offVillages.filter(item => item !== coord);
        displayList("offList", offVillages, "off");
        console.log(offVillages);
    } else {
        console.log(defVillages);
        defVillages = defVillages.filter(item => item !== coord);
        displayList("defList", defVillages, "def");
        console.log(defVillages);
    }

    calcDistances();
}

function sendCats(event) {
    id = event.target.id;
    if (id == "tableData") {
        console.log("do nothing")
        return;
    } else if (!id.includes("_")) {
        console.log("village");
        return;
    } else {
        [id, building] = id.split("_");

        if (building == "off" || building == "def") {
            removeVillage(id, building);
        } else if (building === "wall") {

            launchID = -1;
            for (let row = 0; row < data.length; row++) {
                if (id == data[row].ID) {
                    launchID = data[row].offLaunchID;
                    vill = row
                    break;
                }
            }

            level = parseInt(event.target.innerHTML);
            console.log(id, building, level);

            if (isWallClickable(parseInt(data[vill]["main"]), parseInt(data[vill]["barracks"]), level)) {
                console.log("whyyyyyyyyyy", building, level, id)
                launch = document.createElement("a");
                link = launchID > -1 ?
                    "https://en131.tribalwars.net/game.php?village=" + launchID + "&screen=place&target=" + id + "&ram=" + rams[level + 2]
                    :
                    "https://en131.tribalwars.net/game.php?" + "&screen=place&target=" + id + "&ram=" + rams[level + 2];

                launch.setAttribute("href", link);
                launch.setAttribute("target", "_blank");
                launch.click();
                console.log("ram click", id, building, launchID)

                console.log(id)
                for (let row = 0; row < data.length; row++) {
                    if (id == data[row].ID) {
                        console.log(data[row][building])
                        data[row][building] = 0;
                        level = data[row][building];
                        break
                    }
                }
                event.target.innerHTML = level;
                event.target.className = "data";
            }
        } else if (buildings.includes(building)){

            launchID = -1;
            for (let row = 0; row < data.length; row++) {
                if (id == data[row].ID) {
                    launchID = data[row].launchID;
                    break;
                }
            }

            level = parseInt(event.target.innerHTML);
            console.log(id, building, level);

            while (isClickable(building, level)) {
                launch = document.createElement("a");
                link = launchID > -1 ?
                    "https://en131.tribalwars.net/game.php?village=" + launchID + "&screen=place&target=" + id + "&catapult=" + cats[level + 2]
                    :
                    "https://en131.tribalwars.net/game.php?" + "&screen=place&target=" + id + "&catapult=" + cats[level + 2];

                launch.setAttribute("href", link);
                launch.setAttribute("target", "_blank");
                launch.click();

                console.log("cat click", id, building, launchID)

                console.log(id)
                for (let row = 0; row < data.length; row++) {
                    if (id == data[row].ID) {
                        console.log(data[row][building])
                        data[row][building] -= 1;
                        level = data[row][building];
                        break
                    }
                }
                event.target.innerHTML = level;
            }
            event.target.className = "data";
        }
    }

}

function isClickable(building, level) {
    return (minimums[building] && minimums[building] < level) || (!minimums[building] && level > 0);
}

function isWallClickable(hq, rax, wall) {
    return wall > 0 || (hq >= 3 && rax >= 1);
}

function deleteAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}