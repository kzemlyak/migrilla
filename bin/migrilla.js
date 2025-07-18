#!/usr/bin/env node

const createMigrillaCLI = require('../lib/cli');

const cli = createMigrillaCLI();
const args = process.argv.slice(2);

cli.run(args);
