fs = require('fs');

const contents = fs.readFileSync('/Users/Black/Code/Tribalwars/tw/gamedata/village129.txt', 'utf-8');
const arr = contents.split(/\r?\n/);

let json = {}

for(const line of arr) {
    data = line.split(",");
    id = data[0];
    coord = data[2] + "|" + data[3];

    json[coord] = id;
}

let output = JSON.stringify(json);

fs.writeFile('/Users/Black/Code/Tribalwars/tw/gamedata/village129coordID.json', output, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });