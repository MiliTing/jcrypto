'use strict';

var UglifyJS = require('uglify-js');

module.exports = function(code, options) {
    var cache;
    var ast = UglifyJS.parse(code);
    ast.figure_out_scope();
    ast.compute_char_frequency();

    if(options.names) {
        ast.mangle_names();
    }

    if(options.properties) {
        if(options.filename) {
            cache = UglifyJS.readNameCache(options.filename, 'props');
            UglifyJS.mangle_properties(ast, {cache: cache});
            UglifyJS.writeNameCache(options.filename, 'props', cache);
        } else {
            UglifyJS.mangle_properties(ast);
        }
    }
    return ast.print_to_string();
};

