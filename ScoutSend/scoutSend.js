let sent = {};

let data = [];
let spyDistArray = [];
let lcDistArray = [];
let origins = [];

let lcVillages = [];
let spyVillages = [];

function updateLC() {
    input = document.getElementById("lcText").value;
    lcVillages = input.match(/\d+\|\d+/gm);

    displayList("lcList", lcVillages, "lc")
    calcDistances();
}

function updateSpy() {
    input = document.getElementById("spyText").value;
    spyVillages = input.match(/\d+\|\d+/gm);

    displayList("spyList", spyVillages, "spy")
    calcDistances();
}

function updateVillage() {
    input = document.getElementById("villageText").value;
    barbs = input.match(/\d+\|\d+/gm);

    displayList("customVillageList", barbs, "barb")
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
    if (!(lcVillages.length > 0) || !(spyVillages.length > 0) || !(barbs.length > 0)) {
        const table = document.getElementById("tableData");
        deleteAllChildren(table);
        return null;
    }
    spyDistArray = [];
    lcDistArray = [];

    for (const village of barbs) {
        obj = {};
        spyDistSubArray = []
        lcDistSubArray = []

        a = village.split("|");
        x2 = a[0];
        y2 = a[1];

        for (const origin of spyVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            spyDistSubArray.push(dist);
        }
        for (const origin of lcVillages) {
            [x1, y1] = origin.split("|");
            dist = Math.hypot((x2 - x1), (y2 - y1));
            lcDistSubArray.push(dist);
        }
        spyDistArray.push(spyDistSubArray);

        minSpy = Math.min(...spyDistSubArray);
        index = spyDistSubArray.indexOf(minSpy);

        obj.target = village;
        obj.ID = villageIDs[village];
        obj.launch = spyVillages[index];
        obj.launchID = villageIDs[obj.launch];
        obj.launchIndex = index;
        obj.distance = minSpy;

        minLC = Math.min(...lcDistSubArray);

        if (minLC < 20) {
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

        div = createDiv(Math.round(data[row].distance));
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
    header.style.gridTemplateColumns = "60px 60px 50px 20px";

    div = createDiv("Village");
    div.className = "header";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Launch";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "Dist";
    header.appendChild(div);

    div = document.createElement('div');
    div.className = "header";
    div.innerHTML = "";
    header.appendChild(div);
}

function createTableData() {
    table = document.getElementById('tableData');
    table.style.gridTemplateColumns = "60px 60px 50px 20px";

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

        div2 = document.createElement('div');
        div2.innerHTML = Math.round(data[row].distance);
        div2.className = "send";
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
        } else if (type == "lc" || type == "spy") {
            console.log(event, id);
            removeVillage(id, type);
        } else {
            sendScouts(id, type);
        }
    } else {
        console.log(0, event);
    }
}

function removeVillage(id, unit) {
    console.log(id);
    coord = getKeyByValue(villageIDs, id);
    console.log(coord);
    if (unit == "lc") {
        console.log(lcVillages);
        lcVillages = lcVillages.filter(item => item !== coord);
        displayList("lcList", lcVillages, "lc");
        console.log(lcVillages);
    } else {
        console.log(spyVillages);
        spyVillages = spyVillages.filter(item => item !== coord);
        displayList("spyList", spyVillages, "spy");
        console.log(spyVillages);
    }

    calcDistances();
}

function sendScouts(id, launchID) {

    const i = data.findIndex(object => {
        return object.ID == id;
    })

    launch = document.createElement("a");
    link = spyReports[data[i].target] ?

        "https://en129.tribalwars.net/game.php?village=" + launchID + "&screen=place&try=confirm&type=same&report_id=" + spyReports[data[i].target]
        : "https://en129.tribalwars.net/game.php?village=" + launchID + "&screen=place&target=" + id + "&spy=" + 1;

    launch.setAttribute("href", link);
    launch.setAttribute("target", "_blank");
    launch.click();
    console.log("Click this link to go to that report", link)

    checkbox = document.getElementById(id + "_check");
    checkbox.checked = true;
    sent[id] = true;
}

function toggleCheckbox(id) {
    checkbox = document.getElementById(id + "_check")

    console.log(sent[id], !sent[id], sent.id, !sent.id);
    checkbox.checked = !sent[id];
    sent[id] = !sent[id];

    console.log(checkbox.checked, sent[id]);
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

function updateOutgoing() {
    input = document.getElementById("outgoingText").value;
    outgoingVillages = input.match(/\d+\|\d+/gm);

    // displayList("outgoingVillageList", outgoingVillages, "outgoing")

    for(village = 0; village < outgoingVillages.length; village++){
        const i = data.findIndex(object => {
            return object.target == outgoingVillages[village];
        })
        console.log(outgoingVillages[village], i)

        if(i > 0) {
            id = data[i].ID;
            checkbox = document.getElementById(id + "_check");
            checkbox.checked = true;
            sent[id] = true;
        }
    }
}

async function sendSingleVillScouts() {

    spyCoord = document.getElementById('spyCoord').value;
    spyTabs = Number(document.getElementById('spyTabs').value);

    console.log(spyCoord, spyTabs)

    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (!sent[data[i].ID] && data[i].launch === spyCoord) {
            count += 1;

            l = document.getElementById(data[i].ID + "_" + data[i].launchID);
            l.click();

            sent[data[i].ID] = true;

            checkbox = document.getElementById(data[i].ID + "_check");
            checkbox.checked = true;

            if(count % 5 == 0) await timer(tabDelay);

            if (count >= spyTabs) {
                break;
            }
        }
    }
}