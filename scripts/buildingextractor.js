javascript:

if (window.location.href.indexOf('report') < 0) {
    //relocate
    window.location.assign(game_data.link_base_pure + "report");
}

if (game_data.player.sitter > 0) {
    baseURL = `/game.php?t=${game_data.player.id}&screen=report&view=`;
}
else {
    baseURL = "/game.php?&screen=report&view=";
}

var buildingList = ["main", "barracks", "stable", "garage", "watchtower", "snob", "smith", "rally", "statue", "market", "wood", "stone", "iron", "farm", "storage", "hide", "wall"];
var allBuildingInfo = [];
var reportIDs = [];

// Find all reports
reportDivs = document.querySelectorAll("#report_list > tbody > tr");

// Filter all reports to find only those that included scouts
reportDivs.forEach(element => {
    scoutimg = element.querySelector('[data-title="Contains Scouts"]');
    if (scoutimg) {

        // Create array of report IDs to request
        reportLink = element.querySelector('.report-link');
        url = reportLink.href;
        reportID = url.split("=").pop();
        reportIDs.push(reportID);
    }
})

amountOfPages = reportIDs.length;
let width;
if ($("#contentContainer")[0]) {
    width = $("#contentContainer")[0].clientWidth;
    $("#contentContainer").eq(0).prepend(`
<div id="progressbar" class="progress-bar progress-bar-alive">
<span id="count" class="label">0/${amountOfPages.length}</span>
<div id="progress"><span id="count2" class="label" style="width: ${width}px;">0/${amountOfPages.length}</span></div>
</div>`);
}
else {
    width = $("#mobileHeader")[0].clientWidth;
    $("#mobileHeader").eq(0).prepend(`
<div id="progressbar" class="progress-bar progress-bar-alive">
<span id="count" class="label">0/${amountOfPages.length}</span>
<div id="progress"><span id="count2" class="label" style="width: ${width}px;">0/${amountOfPages.length}</span></div>
</div>`);
}

var URLs = [];

for (var i = 0; i < amountOfPages; i++) {
    URLs.push(baseURL + reportIDs[i]);
}
$.getAll = function (
    urls, // array of URLs
    onLoad, // called when any URL is loaded, params (index, data)
    onDone, // called when all URLs successfully loaded, no params
    onError // called when a URL load fails or if onLoad throws an exception, params (error)
) {
    var numDone = 0;
    var lastRequestTime = 0;
    var minWaitTime = 200; // ms between requests
    loadNext();
    function loadNext() {
        if (numDone == urls.length) {
            onDone();
            return;
        }

        let now = Date.now();
        let timeElapsed = now - lastRequestTime;
        if (timeElapsed < minWaitTime) {
            let timeRemaining = minWaitTime - timeElapsed;
            setTimeout(loadNext, timeRemaining);
            return;
        }
        $("#progress").css("width", `${(numDone + 1) / urls.length * 100}%`);
        $("#count").text(`${(numDone + 1)} / ${urls.length}`);
        $("#count2").text(`${(numDone + 1)} / ${urls.length}`);
        lastRequestTime = now;
        $.get(urls[numDone])
            .done((data) => {
                try {
                    onLoad(numDone, data);
                    ++numDone;
                    loadNext();
                } catch (e) {
                    onError(e);
                }
            })
            .fail((xhr) => {
                onError(xhr);
            })
    }
};


$.getAll(URLs,
    (i, data) => {
        console.log("Grabbing report " + reportIDs[i]);
        // Find input element that contains the building data
        buildingInput = $(data).find(".report_ReportAttack > input");
        if (buildingInput[0]) { // Execute if input element is found
            buildingData = JSON.parse(buildingInput[0].value); // Get the array of building data
            // Get the village ID of the defending village
            villageID = $(data).find("#attack_info_def .village_anchor")[0].getAttribute("data-id");

            // Check if village isn't already in the data array. As we go top down on the page
            // this check will ignore older scout reports of the same village
            if (!allBuildingInfo[villageID]) {
                // Initialize empty array
                allBuildingInfo[villageID] = [];

                // Reorganize data into a "building: level" key-value pairs
                tempBuilding = {};
                buildingData.forEach(building => {
                    tempBuilding[building.id] = building.level;
                })

                // Construct array of levels for ALL buildings, including level 0 buildings
                buildingList.forEach(building => {
                    if (tempBuilding[building]) {
                        allBuildingInfo[villageID].push(tempBuilding[building]);
                    } else {
                        allBuildingInfo[villageID].push(0);
                    }
                });
            }

        }
    },
    () => {
        $("#progressbar").remove();

        if (allBuildingInfo.length > 0) {
            // Create Dialog box with a 500 x 300 textarea
            Dialog.show("Log:", `
        <div width="100%">
            <textarea id="building_textarea" style="width:500px; height:300px"></textarea>
        </div>
        `);

            var textarea = document.getElementById("building_textarea");

            // Add the header row text
            textarea.value = "id,";
            textarea.value += buildingList.join(",");

            // Add each village building info
            for (const village in allBuildingInfo) {
                textarea.value += "\n";
                textarea.value += village;
                textarea.value += ",";
                textarea.value += allBuildingInfo[village].join(",");
            }
        }
    },
    (error) => {
        console.error(error);
    });