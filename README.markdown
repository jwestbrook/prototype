Prototype
=========

[![Build Status](https://travis-ci.org/jwestbrook/prototype.png?branch=master-w-updates)](https://travis-ci.org/jwestbrook/prototype)

#### An object-oriented JavaScript framework ####

Prototype is a JavaScript framework that aims to ease development of dynamic 
web applications.  It offers a familiar class-style OO framework, extensive
Ajax support, higher-order programming constructs, and easy DOM manipulation.

### Targeted platforms ###

Prototype currently targets the following platforms:

* Microsoft Internet Explorer for Windows, version 6.0 and higher
* Mozilla Firefox 1.5 and higher
* Apple Safari 2.0.4 and higher
* Opera 9.25 and higher
* Chrome 1.0 and higher

Using Prototype
---------------

To use Prototype in your application, download the latest release from the 
Prototype web site (<http://prototypejs.org/download>) and copy 
`dist/prototype.js` to a suitable location. Then include it in your HTML
like so:

    <script type="text/javascript" src="/path/to/prototype.js"></script>

Prototype is also available in the [Bower](http://bower.io) registry: `bower install prototype.js`.

### Building Prototype from source ###

`prototype.js` is a composite file generated from many source files in 
the `src/` directory. To build Prototype, you'll need:

* a copy of the Prototype source tree, either from a distribution tarball or
  from the Git repository (see below)
* Grunt 0.4.1 (<http://gruntjs.com/>)
* RDoc, if your Ruby distribution does not include it

From the root Prototype directory,

* `grunt dist` will compile the Prototype source using Grunt Resolve and generate `dist/prototype.js` <strike>and `dist/prototype.min.js` optimized with the Google Closure Compiler</strike>
* `grunt test` will run unit tests in PhantomJS

Contributing to Prototype
-------------------------

Check out the Prototype source with 

    $ git clone git://github.com/sstephenson/prototype.git
    $ cd prototype
    $ git submodule init
    $ git submodule update vendor/sprockets vendor/pdoc vendor/unittest_js

Find out how to contribute: <http://prototypejs.org/contribute>.

Running Unit Tests
-------------

New tests have been written with [MochaJS](http://visionmedia.github.io/mocha/) and [ProclaimJS](https://github.com/rowanmanning/proclaim) assertions. The AJAX and Form Namespaces require a webserver to echo responses which is built into the Mocha Test script to launch a [NodeJS](http://nodejs.org/) Webserver. Mocha can also run tests using [PhantomJS](http://phantomjs.org/) which allows command line testing.

 1. Install NodeJS
 2. In the root of the PrototypeJS directory
 3. `$ npm install`
 4. `$ grunt dist`
 5. `$ grunt test`
 

Documentation
-------------

Please see the online Prototype API: <http://api.prototypejs.org>.