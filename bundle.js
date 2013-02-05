/*
 * bundle.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var browserify = require( 'browserify' ),
    path = require( 'path' );

var bundle = function bundle () {

  var crosstalkify = this;

  var packagePath = path.resolve( 
     path.join( crosstalkify.configuration.directory, 'package.json' ) );

  var pkg = require( packagePath );

  var entryFileName = pkg.main || "index.js";

  var entry = path.resolve( path.join( crosstalkify.configuration.directory,
     entryFileName ) );

  return browserify( entry ).bundle();

}; // bundle

module.exports = bundle;