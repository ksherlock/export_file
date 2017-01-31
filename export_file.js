#!/usr/bin/env node

/*
 * Copyright (c) 2017 Kelvin W Sherlock <ksherlock@gmail.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


"use strict";

var fs = require("fs");
const EX = require('sysexits');
var getopt = require('./getopt').getopt;


function read_stdin() {

	return new Promise(function(resolve, reject){
		var rv = '';
		var stdin = process.stdin;
		stdin.setEncoding("utf8");

		stdin.on("readable", function () {
			var chunk;
			while (chunk = stdin.read()) {
				rv += chunk;
			}
		});

		stdin.on("end", function () {
			resolve(rv);
		});
	})
}

function read_file(name) {

	return new Promise(function(resolve, reject){
		fs.readFile(name, 'utf8', function(err, data){
			if (err) reject(err);
			else resolve(data);
		});
	});
}


function help(status) {

	console.log("export_file [-o outfile] [infile]");
	process.exit(status);
}

function version() {
	var pkg = require('./package.json');
	console.log(`export_file version ${pkg.version}`);
}

var flags = {
	o: null
}

var argv = getopt(null, "o:hv", function(key, optarg){
	switch(key) {
		case ':':
		case '?':
			// optarg is an Error object.
			console.warn(optarg.message);
			process.exit(EX.USAGE);
			break;

		case 'o':
			if (optarg === '-') optarg = null;
			flags.o = optarg;
			break;
		case 'h':
			help(EX.OK);
			break;
		case 'v':
			version();
			process.exit(EX.OK);
			break;
	}
});


if (argv.length > 1) help(EX.USAGE);

let input = argv.length == 0 ? read_stdin() : read_file(argv[0]);

input.then((data) => {
	return JSON.stringify(data);
})
.then((data) => {
	let code = `export default ${data};\n`;
	if (flags.o) {
		fs.writeFileSync(flags.o, code);
	} else {
		process.stdout.write(code);
	}
	process.exit(0);
})
.catch((ex) => {
	console.warn(ex.message);
	process.exit(1);
});
