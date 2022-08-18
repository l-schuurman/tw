const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');
const fs = require('fs');

async function fetch_demo() {
  
  let url = "https://en129.tribalwars.net/map/village.txt"
  const resp = await fetch(url);
  const body = await resp.text();

  fs.writeFile('/Users/Black/Code/Tribalwars/tw/gamedata/village129.txt', body, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

fetch_demo();