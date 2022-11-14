fs = require('fs');

const contents = fs.readFileSync('/Users/Black/Code/Tribalwars/tw/gamedata/village129.txt', 'utf-8');
const arr = contents.split(/\r?\n/);

let obj = {};
let points = {};

for (const line of arr) {
    data = line.split(",");
    if (data && data[3] && data[2]) {
        K = data[3][0] + data[2][0]

        if (obj[K] != null) {
            obj[K] += 1;
            points[K] += parseInt(data[5]);
        } else {
            obj[K] = 0;
            points[K] = 0;
        }
    }
}

let output = JSON.stringify(obj);

var ar = [];

for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        ar.push([key, obj[key], points[key]])
    }
}

console.log(ar)

ar.sort(function(a, b) {
    return a[1] - b[1];
});

for (var val of ar) {
    console.log(val[0], val[1])
}

rows = 6
columns = 6

console.log(ar)

let array = Array(rows).fill().map(() => Array(columns).fill(0));
let rank  = Array(rows).fill().map(() => Array(columns).fill(0));
let pointsMap = Array(rows).fill().map(() => Array(columns).fill(0));

for (var val in ar) {
    [x, y] = [ar[val][0].toString()[0], ar[val][0].toString()[1]]
    array[y-2][x-2] = ar[val][1]
    rank[y-2][x-2] = 32 - val
    pointsMap[y-2][x-2] = ar[val][2]
}

console.log(array)
console.log(rank)
console.log(pointsMap)

for (row of array) {
    console.log(row.join('\t'))
}

fs.writeFile('/Users/Black/Code/Tribalwars/tw/gamedata/village129continent.json', output, err => {
    if (err) {
        console.error(err);
    }
    // file written successfully
});