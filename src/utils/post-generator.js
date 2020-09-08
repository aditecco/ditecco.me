
/* ---------------------------------
post generator
--------------------------------- */

const fs = require("fs");

// capitalizes words
function capitalize(word) {
  const capitalizer = w => w.charAt(0).toUpperCase() + w.slice(1);

  if (!word) return undefined;

  if (word.includes(" ")) {
    return word
      .split(" ")
      .map(capitalizer)
      .join(" ");
  }

  return capitalizer(word);
}

// generates frontmatter for gatsby's markdown posts
const content = (filename, config) => `---
author: ${config.author}
caption: "${config.caption}"
image: ../../../images/itakepictures/${filename}
order: ${config.order}
timestamp: 7 Sep 2020
title: "${capitalize(config.caption.replace('-', ' '))}"
---
`

/**
 * This array represents the order of posts in the homepage;
 * we can rearrange the order here in the editor, then run the script
 * to regenerate the markdown posts processed by gatsby
 */

const data = [
  ["itp-ph-02-wd.jpg", { caption: "Grass", author: 'Alessandro Di Tecco' }],
  ["itp-ph-08-sq.jpg", { caption: "Astratto 2", author: 'Alessandro Di Tecco' }],
  ["itp-ph-02-sq.jpg", { caption: "Astratto 3", author: 'Alessandro Di Tecco' }],
  ["itp-ph-03-wd.jpg", { caption: "Stripes", author: 'Alessandro Di Tecco' }],
  // ["itp-ph-06-wd.jpg", { caption: "Untitled 26", author: 'Alessandro Di Tecco' }],
  ["itp-ph-18-wd.jpg", { caption: "19:49", author: 'Alessandro Di Tecco' }],
  ["itp-ph-03-sq.jpg", { caption: "Astratto 6", author: 'Alessandro Di Tecco' }],
  ["itp-ph-04-sq.jpg", { caption: "Astratto 7", author: 'Alessandro Di Tecco' }],
  ["itp-ph-19-wd.jpg", { caption: "Rain", author: 'Alessandro Di Tecco' }],
  ["itp-ph-14-wd.jpg", { caption: "Untitled 9", author: 'Alessandro Di Tecco' }],
  ["itp-ph-10-sq.jpg", { caption: "Astratto 10", author: 'Alessandro Di Tecco' }],
  ["itp-ph-01-sq.jpg", { caption: "Astratto 11", author: 'Alessandro Di Tecco' }],
  ["itp-ph-17-wd.jpg", { caption: "Ripped", author: 'Alessandro Di Tecco' }],
  ["itp-ph-05-wd.jpg", { caption: "Red", author: 'Alessandro Di Tecco' }],
  ["itp-ph-05-sq.jpg", { caption: "Astratto 14", author: 'Alessandro Di Tecco' }],
  ["itp-ph-06-sq.jpg", { caption: "Astratto 15", author: 'Alessandro Di Tecco' }],
  ["itp-ph-12-wd.jpg", { caption: "Untitled 16", author: 'Alessandro Di Tecco' }],
  // ["itp-ph-13-wd.jpg", { caption: "Untitled 17", author: 'Alessandro Di Tecco' }],
  ["itp-ph-07-sq.jpg", { caption: "Astratto 18", author: 'Alessandro Di Tecco' }],
  ["itp-ph-09-sq.jpg", { caption: "Astratto 19", author: 'Alessandro Di Tecco' }],
  ["itp-ph-10-wd.jpg", { caption: "Lights", author: 'Alessandro Di Tecco' }],
  // ["itp-ph-09-wd.jpg", { caption: "Untitled 28", author: 'Alessandro Di Tecco' }],
  // ["itp-ph-11-wd.jpg", { caption: "Untitled 29", author: 'Alessandro Di Tecco' }],
  ["itp-ph-12-sq.jpg", { caption: "Neon", author: 'Alessandro Di Tecco' }],
  ["itp-ph-11-sq.jpg", { caption: "Door", author: 'Alessandro Di Tecco' }],
  ["itp-ph-16-wd.jpg", { caption: "Pipes", author: 'Alessandro Di Tecco' }],
  ["itp-ph-07-wd.jpg", { caption: "Blank", author: 'Alessandro Di Tecco' }],
  // [ "itp-ph-04-wd.jpg", { caption: "", author: 'Alessandro Di Tecco' }],
  // ["itp-ph-08-wd.jpg", { caption: "untitled 27", author: 'Alessandro Di Tecco' }],
  ["itp-ph-13-sq.jpg", { caption: "Untitled 30", author: 'Alessandro Di Tecco' }],
  //[ "itp-ph-15-wd.jpg", { caption: "Untitled 31", author: 'Alessandro Di Tecco' }],
]

// creates populated files to be fed into gatsby
data.forEach(([filename, config], i) => {
  config['order'] = i;

  fs.writeFileSync(
    `/users/adt/Desktop/data/${filename.split('.').shift()}.md`,
    content(filename, config)
  );
})
