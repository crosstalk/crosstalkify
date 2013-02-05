/*
 * onTest.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var ide = require( 'crosstalk-ide' )(),
    workerPath = require.resolve( '../build/worker' );

var worker;

worker = ide.run( workerPath );
worker.send( 'test' )
  .shouldEmit( 'test.response' );