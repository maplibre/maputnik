#!/usr/bin/env node

// Copied from maplibre/maplibre-gl-js
// https://github.com/maplibre/maplibre-gl-js/blob/bc70bc559cea5c987fa1b79fd44766cef68bbe28/build/release-notes.js

import * as fs from 'fs';

const changelogPath = 'CHANGELOG.md';
const changelog = fs.readFileSync(changelogPath, 'utf8');

/*
  Parse the raw changelog text and split it into individual releases.

  This regular expression:
    - Matches lines starting with "## x.x.x".
    - Groups the version number.
    - Skips the (optional) release date.
    - Groups the changelog content.
    - Ends when another "## x.x.x" is found.
*/
const regex = /^## (\d+\.\d+\.\d+.*?)\n(.+?)(?=\n^## \d+\.\d+\.\d+.*?\n)/gms;

let releaseNotes = [];
let match;
// eslint-disable-next-line no-cond-assign
while (match = regex.exec(changelog)) {
  releaseNotes.push({
    'version': match[1],
    'changelog': match[2].trim(),
  });
}

const latest = releaseNotes[0];
const previous = releaseNotes[1];

//  Print the release notes template.

let header = 'Changes since previous version'
if (previous) {
  header = `https://github.com/maplibre/maputnik
  [Changes](https://github.com/maplibre/maputnik/compare/v${previous.version}...v${latest.version}) since [Maputnik v${previous.version}](https://github.com/maplibre/maputnik/releases/tag/v${previous.version})`
}
const templatedReleaseNotes = `${header}

${latest.changelog}`;

process.stdout.write(templatedReleaseNotes.trimEnd());
