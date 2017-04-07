# export_file

    $ echo "hello" | export_file

    export default "hello\n";

Ever wish you could just import a text file into your javascript code? No?
Well, I needed to once. Use rollup or other modern tools to import it:

    import my_file_contents from './my_file_contents.js';


## Usage

    export_file                   ; reads stdin, writes to stdout
    export_file -o outfile        ; reads stdin, writes outfile
    export_file -o outfile infile ; reads infile, writes outfile
    export_file infile            ; reads infile, writes to stdout


## Makefile

    o/%.js : %.txt
    	export_file -o $@ $^


