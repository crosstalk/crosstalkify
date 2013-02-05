/*
 * index.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var browserify = require( 'browserify' ),
    events = require( 'events' ),
    path = require( 'path' );

var crosstalkify = function crosstalkify ( options ) {

  options = options || {};

  var emitter = new events.EventEmitter();

  emitter.configuration = {
    directory : 
       options.directory ? path.resolve( options.directory ) : process.cwd()
  };

  return emitter;

}; // crosstalkify

module.exports = crosstalkify;