/*
 * bundle.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    path = require( 'path' ),
    sandbox = require( 'sandboxed-module-strict-mode' );

describe( 'bundle()', function () {

  let BROWSERIFY, CROSSTALKIFY, CROSSTALK_MODULES;

  beforeEach( function () {

    CROSSTALK_MODULES = [ 'assert', 'async', 'clone', 'config', 'crypto', 
       'data2xml', 'dateformat', 'env', 'http', 'https', 'inspect', 'logger', 
       'multipart', 'querystring', 'self', 'semver', 'underscore', 'url', 
       'uuid', 'xml2js' ];

    BROWSERIFY = function ( entry ) {
      return BROWSERIFY;
    };

    BROWSERIFY.addEntry = function () { return BROWSERIFY; };
    BROWSERIFY.bundle = function () {};
    BROWSERIFY.ignore = function () { return BROWSERIFY; };
    BROWSERIFY.insert = function () { return BROWSERIFY; };
    BROWSERIFY.prepend = function () { return BROWSERIFY; };

    CROSSTALKIFY = {
      configuration : {
        directory : process.cwd()
      }
    };

  });

  it( "should call ignore before addEntry", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    let addEntryCalled = false;

    BROWSERIFY.ignore = function () {

      assert( ! addEntryCalled );
      done();
      return BROWSERIFY;

    };

    BROWSERIFY.addEntry = function () {

      addEntryCalled = true;
      return BROWSERIFY;

    };

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      },
      strictMode : true
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );    

  });

  it( "should ignore all require modules provided by crosstalk", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );
    
    BROWSERIFY.ignore = function ( modules ) {

      CROSSTALK_MODULES.forEach( function ( mod ) {
        assert( modules.indexOf( mod ) >= 0, "missing " + mod );
      });
      done();
      return BROWSERIFY;

    };

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      },
      strictMode : true
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should provide configuration.directory/index.js as entry point to " +
     "browserify if package.json does not contain 'main'", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    BROWSERIFY.addEntry = function ( entry ) {

      assert.equal( entry, 
         path.resolve( 
            path.join( CROSSTALKIFY.configuration.directory, 'index.js' ) 
         ) 
      );
      done();
      return BROWSERIFY;
    };

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should provide configuration.directory/<main> as entry point to " +
     "browserify if package.json contains 'main'", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'with-main' ) );

    BROWSERIFY.addEntry = function ( entry ) {

      assert.equal( entry, 
         path.resolve( 
            path.join( CROSSTALKIFY.configuration.directory, 'myEntry.js' ) 
         ) 
      );
      done();
      return BROWSERIFY;
    };

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should return output of .bundle() with \"strict mode\";\\n prepended", function () {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    BROWSERIFY.bundle = function () { return 'stuff'; };

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      },
      strictMode : true
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    let code = bundle.call( CROSSTALKIFY );
    assert( code.match( /^"strict mode";\nstuff$/ ), code );    

  });

  it( "should prepend var __require = require to bundle", function ( done ) {

    BROWSERIFY.prepend = function ( src ) {

      assert.equal( src, "var __require = require;" );
      done();
      return BROWSERIFY;

    };

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );    

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      }
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

  });

  it( "should insert crosstalk modules", function () {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );    

    let callCount = 0;

    let modulesToCheckOff = {};
    CROSSTALK_MODULES.forEach( function ( mod ) {
      modulesToCheckOff[ mod ] = 'not checked off';
    });

    BROWSERIFY.insert = function ( src ) {
      
      let match = src.match( /^require\.define\('(assert|async|clone|config|crypto|data2xml|dateformat|env|http|https|inspect|logger|multipart|querystring|self|semver|underscore|url|uuid|xml2js)',function\(require,module,exports\)\{module\.exports = __require\('(assert|async|clone|config|crypto|data2xml|dateformat|env|http|https|inspect|logger|multipart|querystring|self|semver|underscore|url|uuid|xml2js)'\);\}\);/ );
      
      assert( match );
      assert.equal( match[ 1 ], match[ 2 ] );
      delete modulesToCheckOff[ match[ 1 ] ];

      callCount++;
      return BROWSERIFY;

    };   

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      },
      strictMode : true
    };

    let bundle = sandbox.require( '../bundle', SANDBOX );

    bundle.call( CROSSTALKIFY );

    assert.equal( callCount, CROSSTALK_MODULES.length );
    assert.equal( Object.keys( modulesToCheckOff ).length, 0 );

  });

}); // describe bundle()