/* eslint-env node */
/* eslint-disable strict, no-console */
'use strict'

const exec = require('child_process').exec;
const moment = require('moment');
const dryRun = process.env['DRY_RUN'] || false;
const m = moment();

const tagName = () => {
  return m.utc().format('YYYY-MM-DD[T]HH[.]mm[.]ss');
};

const pushTag = tag => {
  const cmd = `git push origin ${tag}`;

  exec(cmd, (error, stdout, stderr) => {
    console.log('Tag pushed to origin', tag);
    if (error !== null) {
      console.log(stderr);
    }
  });
};

const createTag = n => {
  const cmd = `git tag -a ${n} -m "Releasing version: ${n}"`;

  if (dryRun) {
    console.log('Pretending to create new tag:', n);
  } else {
    exec(cmd, (error, stdout, stderr) => {
      console.log('New git tag created', n);
      pushTag(n);
      if (error !== null) {
        console.log(stderr);
      }
    });
  }
};

createTag(tagName());
