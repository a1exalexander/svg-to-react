#!/usr/bin/env node

const yargs = require('yargs');
const generate = require('./generator.js');

const argTypes = {
  OUTPUT: 'output',
  INPUT: 'input',
  CLEAN: 'clean',
};

const argv = yargs
  .usage(
    `Usage: $0 --${argTypes.INPUT} <inputDir> --${argTypes.OUTPUT} <outputDir> --${argTypes.CLEAN}`,
  )
  .option(argTypes.INPUT, {
    describe: 'Input directory containing SVG files',
    demandOption: true,
    type: 'string',
  })
  .option(argTypes.OUTPUT, {
    describe: 'Output directory for generated React icon files',
    demandOption: true,
    type: 'string',
  })
  .option(argTypes.CLEAN, {
    describe: 'Remove unnecessary attributes from SVG files',
    type: 'boolean',
  }).argv;

function checkSlash(dir) {
  return dir.endsWith('/') ? dir : `${dir}/`;
}

argv[argTypes.INPUT] = checkSlash(argv[argTypes.INPUT]);
argv[argTypes.OUTPUT] = checkSlash(argv[argTypes.OUTPUT]);

generate(argv[argTypes.INPUT], argv[argTypes.OUTPUT], argv[argTypes.CLEAN]);
