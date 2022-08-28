

const buildings = ["main", "barracks", "stable", "garage", "watchtower", "snob", "smith", "place", "market", "wood", "stone", "iron", "farm", "storage", "hide", "wall"]

const cats = [0, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 13, 15, 16, 17, 19, 20];

const raks = [0, 2];

const minimums = {
    "main": 1,
    "farm": 1,
    "storage": 1,
    "hide": 10
}

let distArray = [];
let origins = [];

function calcDistances() {
    createTableData();
    distArray = [];
    input = document.querySelector("textarea").value;
    origins = input.match(/\d+\|\d+/gm);

    for (let row = 0; row < data.length; row++) {
        distSubArray = []
        a = data[row].target.split("|");
        x2 = a[0];
        y2 = a[1];

        for (const origin of origins) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            distSubArray.push(dist);
        }
        distArray.push(distSubArray);

        min = Math.min(...distSubArray);
        index = distSubArray.indexOf(min);

        data[row].launch = origins[index];
        data[row].launchID = getKeyByValue(villageIDs, data[row].launch);
        data[row].launchIndex = index;
        data[row].distance = min;
    }

    insertLaunches();
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
        div = document.createElement('div');
        div.id = data[row].ID;
        div.className = "coord";

        launchTo = document.createElement("a");
        launchTo.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=info_village&id=" + data[row].ID);
        launchTo.setAttribute("target", "_blank");
        launchTo.innerHTML = data[row].target;
        
        div.appendChild(launchTo);

        table.appendChild(div);

        div = document.createElement('div');
        div.className = "coord";

        launchFrom = document.createElement('a');
        launchFrom.innerHTML = data[row].launch;
        launchFrom.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=overview");
        launchFrom.setAttribute("target", "_blank");

        div.appendChild(launchFrom);

        table.appendChild(div);

        div = createDiv(Math.round(data[row].distance));
        table.appendChild(div);


        for (const building of buildings) {
            level = data[row][building];

            div = document.createElement('div');
            div.innerHTML = level;
            div.className = "data";
            div.id = data[row].ID + "_" + building;

            if (isClickable(building, level)) {
                div.className += " clickable";
            }
            table.appendChild(div)
        }
    }

}

function insertLaunches() {
    header = document.getElementById("tableHeader")
    tableData = document.getElementById("tableData")

    headerDivs = document.querySelectorAll(".header")
    if (headerDivs.length !== 19) {

        header.style.gridTemplateColumns = "60px 60px 50px repeat(16, 40px)";
        tableData.style.gridTemplateColumns = "60px 60px 50px repeat(16, 40px)";

        child = headerDivs[0];
        div = document.createElement('div');
        div.className = "header";
        div.innerHTML = "Launch";

        child.after(div);

        div2 = document.createElement('div');
        div2.className = "header";
        div2.innerHTML = "Dist";

        div.after(div2);
    }

    for (row = 0; row < data.length; row++) {
        child = document.getElementById(data[row].ID);

        div = document.createElement('div');
        div.className = "coord";

        launchFrom = document.createElement('a');
        launchFrom.innerHTML = data[row].launch;
        launchFrom.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=overview");
        launchFrom.setAttribute("target", "_blank");

        div.appendChild(launchFrom);

        child.after(div);

        div2 = document.createElement('div');
        div2.innerHTML = Math.round(data[row].distance);

        div.after(div2);
 
    }
}

function sortVillages() {
    data = data.sort((v1, v2) => (v1.distance > v2.distance) ? 1 : (v1.distance < v2.distance) ? -1 : 0);
}

function check() {
    console.log(origins, distArray);
}

function createTableHeader() {
    table = document.getElementById('tableHeader');
    div = createDiv("Village");
    div.className = "header"
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

function createTableData() {
    table = document.getElementById('tableData');

    for (row = 0; row < data.length; row++) {
        div = document.createElement('div');
        div.id = data[row].ID;
        div.className = "coord";
        
        targetOverview = document.createElement('a');
        targetOverview.innerHTML = data[row].target;
        targetOverview.setAttribute("href", "https://en129.tribalwars.net/game.php?screen=info_village&id=" + data[row].ID);
        targetOverview.setAttribute("target", "_blank");

        div.appendChild(targetOverview);

        table.appendChild(div);
        for (const building of buildings) {
            level = data[row][building];

            div = document.createElement('div');
            div.innerHTML = level;
            div.className = "data";
            div.id = data[row].ID + "_" + building;

            if (isClickable(building, level)) {
                div.className += " clickable";
            }
            table.appendChild(div)
        }
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
    document.getElementById("submit").addEventListener("click", calcDistances);
    document.getElementById("check").addEventListener("click", check);

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

        launchID = -1;
        for(let row = 0; row < data.length; row++) {
            if(id == data[row].ID){
                launchID = data[row].launchID;
                break;
            }
        }

        if (building === "wall") {
            null;
        } else {

            level = parseInt(event.target.innerHTML);
            console.log(id, building, level);

            while (isClickable(building, level)) {
                launch = document.createElement("a");
                link = launchID > -1 ? 
                    "https://en129.tribalwars.net/game.php?village=" + launchID + "&screen=place&target=" + id + "&catapult=" + cats[level]
                    :
                    "https://en129.tribalwars.net/game.php?" + "&screen=place&target=" + id + "&catapult=" + cats[level];

                launch.setAttribute("href", link);
                launch.setAttribute("target", "_blank");
                launch.click();

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