let sent = {};

let data = [];
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
        li.id = villageIDs[village] + "_" + type;
        ul.appendChild(li);
    }
}

function calcDistances() {
    data = [];
    if (!(offVillages.length > 0) || !(defVillages.length > 0) || !(barbs.length > 0)) {
        const table = document.getElementById("tableData");
        deleteAllChildren(table);
        return null;
    }
    offDistArray = [];
    defDistArray = [];

    for (const village of barbs) {
        obj = {};
        offDistSubArray = []
        defDistSubArray = []

        a = village.split("|");
        x2 = a[0];
        y2 = a[1];

        for (const origin of offVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            offDistSubArray.push(dist);
        }
        for (const origin of defVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            defDistSubArray.push(dist);
        }
        defDistArray.push(defDistSubArray);

        minDef = Math.min(...defDistSubArray);
        index = defDistSubArray.indexOf(minDef);

        obj.target = village;
        obj.ID = villageIDs[village];
        obj.launch = defVillages[index];
        obj.launchID = villageIDs[obj.launch];
        obj.defDistance = minDef;

        minOff = Math.min(...offDistSubArray);
        index = defDistSubArray.indexOf(minDef);

        obj.offLaunch = defVillages[index];
        obj.offLaunchID = villageIDs[obj.offLaunch];
        obj.offDistance = minOff;

        if (minOff < 20 && minDef < minOff) {
            // console.log(obj);
            data.push(obj);
        }
    }

    sortVillages();
    insertLaunches();
    // displayVillages();
    addButtonClick();
}

function displayVillages() {
    const table = document.getElementById("tableData");
    deleteAllChildren(table);

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

        div = document.createElement('div');
        div.className = "coord";

        launchFrom = document.createElement('a');
        launchFrom.innerHTML = data[row].offLaunch;
        launchFrom.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].offLaunchID + "&screen=overview");
        launchFrom.setAttribute("target", "_blank");

        div.appendChild(launchFrom);

        table.appendChild(div);

        div = createDiv(Math.round(data[row].defDistance*10)/10);
        table.appendChild(div);

        div = createDiv(Math.round(data[row].offDistance*10)/10);
        table.appendChild(div);
    }

}

function insertLaunches() {
    // createTableHeader();
    createTableData();
}

function sortVillages() {
    data = data.sort((v1, v2) => (v1.distance > v2.distance) ? -1 : (v1.distance < v2.distance) ? 1 : 0);
}

function check() {
    console.log(origins, distArray);
}

function createTableHeader() {
    header = document.getElementById("tableHeader")
    header.style.gridTemplateColumns = "60px 80px 80px 60px 60px 20px";

    div = createDiv("Village");
    div.className = "header";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Def Launch";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Off Launch";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Def Dist";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Off Dist";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "";
    header.appendChild(div);
}

function createTableData() {
    table = document.getElementById('tableData');
    header.style.gridTemplateColumns = "60px 80px 80px 60px 60px 20px";

    deleteAllChildren(table);

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

        div = document.createElement('div');
        div.className = "coord";

        launchFrom = document.createElement('a');
        launchFrom.innerHTML = data[row].launch;
        launchFrom.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].launchID + "&screen=overview");
        launchFrom.setAttribute("target", "_blank");

        div.appendChild(launchFrom);

        table.appendChild(div);

        div = document.createElement('div');
        div.className = "coord";

        launchFrom = document.createElement('a');
        launchFrom.innerHTML = data[row].offLaunch;
        launchFrom.setAttribute("href", "https://en129.tribalwars.net/game.php?village=" + data[row].offLaunchID + "&screen=overview");
        launchFrom.setAttribute("target", "_blank");

        div.appendChild(launchFrom);

        table.appendChild(div);

        div2 = document.createElement('div');
        div2.innerHTML = Math.round(data[row].defDistance*10)/10;
        div2.className = "send";
        div2.id = data[row].ID + "_" + data[row].launchID;
        table.appendChild(div2);

        div2 = document.createElement('div');
        div2.innerHTML = Math.round(data[row].offDistance*10)/10;
        div2.id = data[row].ID + "_" + data[row].launchID;
        table.appendChild(div2);

        div3 = document.createElement('div');
        checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.id = data[row].ID + "_" + "check";
        checkbox.checked = sent[data[row].ID] ? true : false;
        div3.appendChild(checkbox);
        table.appendChild(div3);
    }
}

function createDiv(datum) {
    div = document.createElement('div');
    div.innerHTML = datum;
    return div;
}

function addButtonClick() {
    clicky = document.getElementById("tableData").addEventListener("click", handleClick)
    // btns = document.querySelectorAll(".send");
    // btns.forEach((btn) => {btn.addEventListener("click", sendScouts)});
    document.getElementById("check").addEventListener("click", check);
    document.querySelectorAll("ul").forEach(element => { element.addEventListener("click", handleClick) });
}

function handleClick(event) {
    id = event.target.id;
    console.log(event, id)
    if (id == "tableData") {
        console.log("do nothing")
        return;
    } else if (!id.includes("_")) {
        console.log("village");
        return;
    } else if (id.includes("_")) {
        [id, type] = id.split("_");
        console.log(id,type)
        if (type == "check") {
            toggleCheckbox(id);
        } else if (type == "barb") {
            null;
        } else if (type == "off" || type == "def") {
            console.log(event, id);
            removeVillage(id, type);
        } else {
            sendScouts(id, type);
        }
    } else {
        console.log(0, event);
    }
}

function removeVillage(id, type) {
    console.log(id);
    coord = getKeyByValue(villageIDs, id);
    console.log(coord);
    if (type == "off") {
        console.log(offVillages);
        offVillages = offVillages.filter(item => item !== coord);
        displayList("offList", offVillages, "off");
        console.log(offVillages);
    } else if (type == "def") {
        console.log(defVillages);
        defVillages = defVillages.filter(item => item !== coord);
        displayList("defList", defVillages, "def");
        console.log(defVillages);
    }

    calcDistances();
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] == value);
}

function deleteAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms));

tabDelay = 1000;
numTabs = 50;

async function openTabs() {

    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (!sent[data[i].ID]) {
            count += 1;

            l = document.getElementById(data[i].ID + "_" + data[i].launchID);
            l.click();

            sent[data[i].ID] = true;

            checkbox = document.getElementById(data[i].ID + "_check");
            checkbox.checked = true;

            if(count % 5 == 0) await timer(tabDelay);

            if (count >= numTabs) {
                break;
            }
        }
    }
}

function updateTabs() {
    numTabsTEMP = Number(document.getElementById('tabNumber').value);
    tabDelayTEMP = Number(document.getElementById('tabDelay').value);
    
    console.log(numTabsTEMP, tabDelayTEMP, numTabs, tabDelay);

    if(numTabsTEMP > 0){
        numTabs = numTabsTEMP;
    }
    if(tabDelayTEMP > 0){
        tabDelay = tabDelayTEMP;
    }

    console.log(numTabsTEMP, tabDelayTEMP, numTabs, tabDelay);

    document.getElementById('opentabs').innerHTML = "Open Up To "+numTabs+" Tabs";
}