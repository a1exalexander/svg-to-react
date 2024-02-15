#!/usr/bin/env node

const yargs = require('yargs');
const generate = require('./generator.js');

const argv = yargs
  .usage('Usage: $0 --output <outputDir> --input <inputDir>')
  .option('output', {
    describe: 'Output directory for generated React icon files',
    demandOption: true,
    type: 'string',
  })
  .option('input', {
    describe: 'Input directory containing SVG files',
    demandOption: true,
    type: 'string',
  }).argv;

function checkSlash(dir) {
  return dir.endsWith('/') ? dir : `${dir}/`;
}

const outputDir = checkSlash(argv.output);
const inputDir = checkSlash(argv.input);

generate(inputDir, outputDir);
