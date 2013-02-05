/*
 * bundle.test.js
 *
 * (C) 2013 Crosstalk Systems Inc.
 */
"use strict";

var assert = require( 'assert' ),
    bundle = require( '../bundle' ),
    path = require( 'path' ),
    sandbox = require( 'sandboxed-module-strict-mode' );

describe( 'bundle()', function () {

  it( "should be implemented", function () {
    assert.fail();
  });

  let BROWSERIFY, CROSSTALKIFY, CROSSTALK_MODULES;

  beforeEach( function () {

    CROSSTALK_MODULES = [ 'assert', 'async', 'clone', 'config', 'crypto', 
       'data2xml', 'dateformat', 'env', 'http', 'https', 'inspect', 'logger', 
       'multipart', 'querystring', 'self', 'semver', 'underscore', 'url', 
       'uuid', 'xml2js' ];

    BROWSERIFY = function ( entry ) {
      return BROWSERIFY;
    };

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

  it( "should provide configuration.directory/index.js as entry point to " +
     "browserify if package.json does not contain 'main'", function ( done ) {

    CROSSTALKIFY.configuration.directory = 
       path.resolve( path.join( __dirname, 'no-main' ) );

    let oldBrowserify = BROWSERIFY;
    BROWSERIFY = function ( entry ) {

      assert.equal( entry, 
         path.resolve( 
            path.join( CROSSTALKIFY.configuration.directory, 'index.js' ) 
         ) 
      );
      done();
      return BROWSERIFY;
    };

    Object.keys( oldBrowserify ).forEach( function ( key ) {
      BROWSERIFY[ key ] = oldBrowserify[ key ];
    });

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

    let oldBrowserify = BROWSERIFY;
    BROWSERIFY = function ( entry ) {

      assert.equal( entry, 
         path.resolve( 
            path.join( CROSSTALKIFY.configuration.directory, 'myEntry.js' ) 
         ) 
      );
      done();
      return BROWSERIFY;
    };

    Object.keys( oldBrowserify ).forEach( function ( key ) {
      BROWSERIFY[ key ] = oldBrowserify[ key ];
    });

    let SANDBOX = {
      requires : {
        'browserify' : BROWSERIFY
      }
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

  it( "should return output of .bundle()", function () {

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

    assert.equal( 'stuff', bundle.call( CROSSTALKIFY ) );

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

    BROWSERIFY.insert = function ( src ) {
      
      let match = src.match( /^require\.define\('(assert|async|clone|config|crypto|data2xml|dateformat|env|http|https|inspect|logger|multipart|querystring|self|semver|underscore|url|uuid|xml2js)',function\(require,module,exports\)\{module\.exports = __require\('(assert|async|clone|config|crypto|data2xml|dateformat|env|http|https|inspect|logger|multipart|querystring|self|semver|underscore|url|uuid|xml2js)'\);\}\);/ );
      assert( match );
      assert.equal( match[ 1 ], match[ 2 ] );

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

  });

}); // describe bundle()