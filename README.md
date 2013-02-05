crosstalkify
============

Crosstalk packaging for node.js projects built on top of [browserify](https://github.com/substack/node-browserify).

`crosstalkify` uses an extension to `browserify` that is implemented in [this fork](https://github.com/tristanls/node-browserify).

example
=======

Write an `entry.js` with `require()`s in it:

```javascript
// use relative requires
var foo = require( './foo' );

// use Crosstalk requires
var self = require( 'self' );

// or use modules installed by npm into node_modules/
var uuid = require( 'prefixed-uuid' );

// global `crosstalk` variable is available
crosstalk.on( 'some.message', function () {
  crosstalk.emit( 'some.message.response' );
});
```

Now you can use `crosstalkify` command to build a worker file for upload that takes `entry.js` as it's entry point:

```
crosstak-project$ crosstalkify -o worker.js
```

All of the modules are included in the final `worker.js`, `browserify`-style.

`worker.js` is now ready for upload to Crosstalk Swarm along with it's `package.json`.

usage
=====

```
Usage: crosstalkify {OPTIONS}

Options:
  --outfile, -o    Write the crosstalkify bundle to this file.
                   If unspecified, crosstalkify prints to stdout.               
  --directory, -d  Project directory to crosstalkify.
                   The project directory is the one with package.json in it.
                   If unspecified, current working directory will be used.      
  --help, -h       Show this message    

```

compatibility
=============

For more information on what can be expected to work, see [browserify](https://github.com/substack/node-browserify).

install
=======

With [npm](http://npmjs.org) do:

```
npm install -g crosstalkify
```

test
====

```
npm test
```