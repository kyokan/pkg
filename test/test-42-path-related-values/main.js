#!/usr/bin/env node

'use strict';

const path = require('path');
const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const target = process.argv[2] || 'host';
const input = './project/app.js';
const output = './deploy/app-x64.exe';

let left, right;
utils.mkdirp.sync(path.dirname(output));

left = utils.spawn.sync(
  'node', [ path.basename(input) ],
  { cwd: path.dirname(input) }
);

utils.pkg.sync([
  '--target', target,
  '--output', output, input
]);

right = utils.spawn.sync(
  './' + path.basename(output), [],
  { cwd: path.dirname(output) }
);

left = JSON.parse(left);
right = JSON.parse(right);

for (let obj of [ left, right ]) {
  for (let s in obj) {
    obj[s] = obj[s].replace('\\pkg\\test\\test-42-path-related-values', '')
                   .replace('/pkg/test/test-42-path-related-values', '')
                   .replace('app-x64.exe', 'app-x64');
  }
}

function pad (s, width) {
  return s + ' '.repeat(width - s.length);
}

for (let s in left) {
  console.log(pad(s, 30), '|', pad(left[s], 22), '|', right[s]);
}

utils.vacuum.sync(path.dirname(output));
