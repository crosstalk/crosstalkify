/*
 * bundle.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var browserify = require( 'browserify' ),
    path = require( 'path' );

var CROSSTALK_MODULES = [ 'assert', 'async', 'clone', 'config', 'crypto', 
      'data2xml', 'dateformat', 'env', 'http', 'https', 'inspect', 'logger', 
      'multipart', 'querystring', 'self', 'semver', 'underscore', 'url', 'uuid', 
      'xml2js' ];

var bundle = function bundle () {

  var crosstalkify = this;

  var packagePath = path.resolve( 
     path.join( crosstalkify.configuration.directory, 'package.json' ) );

  var pkg = require( packagePath );

  var entryFileName = pkg.main || "index.js";

  var entry = path.resolve( path.join( crosstalkify.configuration.directory,
     entryFileName ) );

  var code = browserify()
              .ignore( CROSSTALK_MODULES )
              .addEntry( entry );

  CROSSTALK_MODULES.forEach( function ( crosstalkModule ) {
    code.insert( "require.define('" + crosstalkModule
       + "',function(require,module,exports){module.exports = __require('"
       + crosstalkModule + "');});" );
  });

  code.on( 'syntaxError', function ( error ) {

    console.error( error );
    process.exit( 1 );

  });
  
  var result = '"strict mode";\n' + 'var __require = require;\n' + code.bundle();
  if ( Object.keys( code.errors ).length == 0 ) crosstalkify.ok = true;

  return result;

}; // bundle

module.exports = bundle;