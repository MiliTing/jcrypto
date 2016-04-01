(function (){
    'use strict';

    var estraverse = require('estraverse'),
        utility = require('./utility.js'),
        transformTable = {};
            
    function isMemberExpression(node) {
        return node.type === 'MemberExpression';
    }
    function isObjectExpression(node) {
        return node.type === 'ObjectExpression';
    }
    function isInScope(name, names) {
        return names.indexOf(name) !== -1;
    }

    function getProperty(property) {
        switch (property.type) {
            case 'Identifier': 
                return property.name;
            case 'Literal': 
                return property.value;
        }
    }

    function setProperty(property, value) {
        switch (property.type) {
            case 'Identifier': 
                property.name = value;
                break;
            case 'Literal': 
                property.value = value;
                break;
        }
    }

    function isReservedProperty(id){
        switch (id.length) {
            case 4: 
                return (id === 'call');
            case 6: 
                return (id === 'length');
            case 7: 
                return (id === 'indexOf') || (id === 'valueOf');
            case 8: 
                return (id === 'toString');
            case 9: 
                return (id === 'prototype');
            case 13: 
                return (id === 'isPrototypeOf');
            default:
                return false;
        }
    }

    function isProtected(id, protect){
        protect = protect || [];
        return protect.indexOf(id) !== -1;
    }

    function getPropertyIndex(table, str){
        for (var obj in table) {
            if (table.hasOwnProperty(obj)){
                for (var prop in table[obj]) {
                    if (table[obj].hasOwnProperty(prop) && prop === str) {
                        return table[obj][prop];
                    }
               }
           }
        }
        return '';
    }

    function renameStrings(tree){
        var str, rstr = '';
        estraverse.replace(tree, {
            leave: function (node, parent) {
                if(node.type === 'Literal' &&
                    (node.raw[0] === '"' || node.raw[0] === '\'')) {
                    str = node.value;
                    rstr = getPropertyIndex(transformTable, str);        
                    if (rstr) {
                      node.value = rstr;
                    }
                }    
            }
        });
    }

    function renameMemberExpressionProperty(node, cfg) {
        var name = node.object.name,
            property = node.property,
            pname = getProperty(property),
            rname = utility.generateRandomString(2);
        if (!isInScope(name, cfg.scope) || isProtected(pname, cfg.protect)) {
            return;
        }
        if (cfg.print) {
            console.log('Object: ' + name + '; Property: ' + pname + '; Line: ' + node.loc.start.line);
        }    
        if (isReservedProperty(pname)) {
            return;
        }
        if (!transformTable.hasOwnProperty(name)) {
            transformTable[name] = {};
        }
        if (transformTable.hasOwnProperty(name) && transformTable[name].hasOwnProperty(pname)) {
            setProperty(property, transformTable[name][pname]);
            if (cfg.print) {
                console.log('    Renamed to existing property: ' + transformTable[name][pname]);
            }
        } else {
            rname = utility.generateNextName(rname);
            transformTable[name][pname] = rname;
            setProperty(property, rname);
            if (cfg.print) {
                console.log('    Renamed to new property: ' + rname);
            }
        }
    }

    function renameObjectExpressionProperty(node, parent, cfg) {
        var name,
            properties = node.properties,
            property,
            pname,
            rname = utility.generateRandomString(1),
            i, len;
        switch (parent.type) {
            case 'AssignmentExpression': 
                name = parent.left.name;
                break;
            case 'VariableDeclarator': 
                name = parent.id.name;
                break;
        }
        if (!isInScope(name, cfg.scope)) {
            return;
        }
        if (!transformTable.hasOwnProperty(name)) {
            transformTable[name] = {};
        }
        for (i = 0, len = properties.length; i < len; i++) {
            property = properties[i];
            pname = getProperty(property.key);
            if (isReservedProperty(pname) || isProtected(pname, cfg.protect)) {
               return;
            }
            if (cfg.print) {
                console.log('Object: ' + name + '; Property: ' + pname + '; Line: ' + node.loc.start.line);
            }
            if (transformTable.hasOwnProperty(name) && transformTable[name].hasOwnProperty(pname)) {
                setProperty(property.key, transformTable[name][pname]);
                if (cfg.print) {
                    console.log('    Renamed to existing property: ' +transformTable[name][pname]);
                }
            } else {
                rname = utility.generateNextName(rname);
                transformTable[name][pname] = rname;
                setProperty(property.key, rname);
                if (cfg.print) {
                    console.log('    Renamed to new property: ' + rname);
                }
            }
        }
    }
        
    /**
     * @renameProperties - Rename properties in AST.
     * @param   {object} tree -AST.
     * @param   {object} options - configuration object:
     *              scope {object}(array)  - names of objects which properties should be rewrited
     *              print {boolean}        - print debug information to console
     *              protect {object}(array)- names of protected properties that should not be rewrited
     * @returns {object} modified AST.
     */
    function renameProperties(tree, options) {
        estraverse.replace(tree, {
            leave: function (node, parent) {
                if(isMemberExpression(node)) {
                    renameMemberExpressionProperty(node, options);
                }
                if (isObjectExpression(node)) {
                    renameObjectExpressionProperty(node, parent, options);
                }
            }
        });
        renameStrings(tree);
        return tree;
    }
    module.exports = renameProperties;  
}());