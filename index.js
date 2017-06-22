#!/usr/bin/env node
apiBuilder = require('./apiBuilder');
if( process.argv[2] == 'build')
	apiBuilder();