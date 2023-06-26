fs = require('fs');

const contents = fs.readFileSync('/Users/Black/Code/tw/gamedata/village133.txt', 'utf-8');
const arr = contents.split(/\r?\n/);

let json = {}

for(const line of arr) {
    data = line.split(",");
    id = data[0];
    coord = data[2] + "|" + data[3];

    // if(data[4] == "0") 
    json[coord] = id;
}

let output = JSON.stringify(json);

fs.writeFile('/Users/Black/Code/tw/gamedata/village133coordID.json', output, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });