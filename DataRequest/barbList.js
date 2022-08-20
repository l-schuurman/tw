fs = require('fs');

const contents = fs.readFileSync('/Users/Black/Code/Tribalwars/tw/gamedata/village129.txt', 'utf-8');
const arr = contents.split(/\r?\n/);

let ar = [];

for(const line of arr) {
    data = line.split(",");
    id = data[0];
    coord = data[2] + "|" + data[3];

    if(data[4] == "0") ar.push(coord);
}

let output = JSON.stringify(ar);

fs.writeFile('/Users/Black/Code/Tribalwars/tw/gamedata/village129barbs.json', output, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });