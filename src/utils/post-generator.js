/* ---------------------------------
post generator
--------------------------------- */

const fs = require("fs");


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

const content = (filename, config) => `---
author: ${config.author}
caption: "${config.caption}"
image: ../../../images/itakepictures/${filename}
order: ${config.order}
timestamp: 7 Sep 2020
title: "${capitalize(config.caption.replace('-', ' '))}"
---
`

const data = {
  "itp-ph-01-sq.jpg": { caption: "astratto 11", order: 11, author: 'Alessandro Di Tecco' },
  "itp-ph-02-sq.jpg": { caption: "astratto 3", order: 3, author: 'Alessandro Di Tecco' },
  "itp-ph-02-wd.jpg": { caption: "grass", order: 1, author: 'Alessandro Di Tecco' },
  "itp-ph-03-sq.jpg": { caption: "astratto 6", order: 6, author: 'Alessandro Di Tecco' },
  "itp-ph-03-wd.jpg": { caption: "stripes", order: 4, author: 'Alessandro Di Tecco' },
  "itp-ph-04-sq.jpg": { caption: "astratto 7", order: 7, author: 'Alessandro Di Tecco' },
  "itp-ph-04-wd.jpg": { caption: "blank", order: 25, author: 'Alessandro Di Tecco' },
  "itp-ph-05-sq.jpg": { caption: "red", order: 14, author: 'Alessandro Di Tecco' },
  "itp-ph-05-wd.jpg": { caption: "ripped", order: 13, author: 'Alessandro Di Tecco' },
  "itp-ph-06-sq.jpg": { caption: "astratto 15", order: 15, author: 'Alessandro Di Tecco' },
  "itp-ph-06-wd.jpg": { caption: "untitled 26", order: 26, author: 'Alessandro Di Tecco' },
  "itp-ph-07-sq.jpg": { caption: "untitled 18", order: 18, author: 'Alessandro Di Tecco' },
  "itp-ph-07-wd.jpg": { caption: "door", order: 24, author: 'Alessandro Di Tecco' },
  "itp-ph-08-sq.jpg": { caption: "astratto 2", order: 2, author: 'Alessandro Di Tecco' },
  "itp-ph-08-wd.jpg": { caption: "untitled 27", order: 27, author: 'Alessandro Di Tecco' },
  "itp-ph-09-sq.jpg": { caption: "astratto 19", order: 19, author: 'Alessandro Di Tecco' },
  "itp-ph-09-wd.jpg": { caption: "untitled 28", order: 28, author: 'Alessandro Di Tecco' },
  "itp-ph-10-sq.jpg": { caption: "untitled 10", order: 10, author: 'Alessandro Di Tecco' },
  "itp-ph-10-wd.jpg": { caption: "astratto 20", order: 20, author: 'Alessandro Di Tecco' },
  "itp-ph-11-sq.jpg": { caption: "astratto 23", order: 23, author: 'Alessandro Di Tecco' },
  "itp-ph-11-wd.jpg": { caption: "untitled 29", order: 29, author: 'Alessandro Di Tecco' },
  "itp-ph-12-sq.jpg": { caption: "pipes", order: 22, author: 'Alessandro Di Tecco' },
  "itp-ph-12-wd.jpg": { caption: "astratto 16", order: 16, author: 'Alessandro Di Tecco' },
  "itp-ph-13-sq.jpg": { caption: "untitled 30", order: 30, author: 'Alessandro Di Tecco' },
  "itp-ph-13-wd.jpg": { caption: "untitled 17", order: 17, author: 'Alessandro Di Tecco' },
  "itp-ph-14-wd.jpg": { caption: "rain", order: 9, author: 'Alessandro Di Tecco' },
  "itp-ph-15-wd.jpg": { caption: "untitled 31", order: 31, author: 'Alessandro Di Tecco' },
  "itp-ph-16-wd.jpg": { caption: "untitled 21", order: 21, author: 'Alessandro Di Tecco' },
  "itp-ph-17-wd.jpg": { caption: "astratto 12", order: 12, author: 'Alessandro Di Tecco' },
  "itp-ph-18-wd.jpg": { caption: "19:49", order: 5, author: 'Alessandro Di Tecco' },
  "itp-ph-19-wd.jpg": { caption: "astratto 8", order: 8, author: 'Alessandro Di Tecco' },
}

Object.entries(data).forEach(([filename, config]) => {
  fs.writeFileSync(
    `/users/adt/Desktop/data/${filename.split('.').shift()}.md`,
    content(filename, config)
  );
})

