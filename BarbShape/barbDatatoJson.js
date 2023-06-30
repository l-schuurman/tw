fs = require('fs');
var villageIDs = require('../gamedata/village133IDcoord.json')

const contents = fs.readFileSync('/Users/Black/Code/tw/BarbShape/barbData.txt', 'utf-8');
const arr = contents.split(/\r?\n/).splice(1);

const buildings = ["main", "barracks", "stable", "garage", "watchtower", "snob", "smith", "place", "statue", "market", "wood", "stone", "iron", "farm", "storage", "hide", "wall"]
let obj = [];

for(const line of arr) {
    tempObj = {};

    data = line.split(",");
    id = data[0];
    target = villageIDs[id];

    tempObj["ID"] = id;
    tempObj["target"] = target;

    for(let i = 1; i < data.length; i++){
        if(i == 9) {
          continue;
        }
        tempObj[buildings[i - 1]] = data[i];
    }

    obj.push(tempObj)
}

let output = JSON.stringify(obj);

fs.writeFile('/Users/Black/Code/tw/BarbShape/barbData.json', output, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });