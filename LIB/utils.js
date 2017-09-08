/*
 Array.prototype.has = function(v){
 for (i=0; i<this.length; i++){
 if (this[i]==v) return i;
 }
 return false;
 }

 Array.prototype.each = function(fn) {
 for (var i = 0, len = this.length; i < len; i++)
 fn(this[i], i);
 };
 */

// Inspired by http://javacrypt.wordpress.com/2012/12/15/improvements-to-d3s-reusable-component-pattern/
function getterSetter()  {
    for (o in this.props) {
        if (this.props.hasOwnProperty(o)) {
            this[o] =  new Function("value", "if (!arguments.length) return typeof this.props['" + o +
                "'] == 'function' ? this.props['" + o + "'].call(this) : this.props['" + o + "'];" +
                "this.props['" + o + "'] = (typeof value == 'function' ? value.call(this) : value); return this")
        }
    }
}

function cross(a) {
    return function(d) {
        var c = [];
        for (var i = 0, n = a.length; i < n; i++) c.push({x: d, y: a[i]});
        return c;
    };
}

function clone(selector) {
    var node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
}

function cloneAll(selector) {
    var nodes = d3.selectAll(selector);
    nodes.each(function(d, i) {
        nodes[0][i] = this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
    });
    return nodes;
}

function urlencode(s) {
    s = encodeURIComponent(s);
    s = s.replace(/~/g,'%7E').replace(/%20/g,'+').replace(/:/g,'%3A').replace(/'/g,'%27').replace(/!/g, '%21');
    return s.replace(/%/g, '%25');
}


// http://stackoverflow.com/questions/3729150/retrieve-specific-hash-tags-value-from-url
var HashSearch = new function () {
    var params;

    this.set = function (key, value) {
        params[key] = value;
        this.push();
    };

    this.remove = function (key, value) {
        delete params[key];
        this.push();
    };


    this.get = function (key, value) {
        return params[key];
    };

    this.keyExists = function (key) {
        return params.hasOwnProperty(key);
    };

    this.push= function () {
        var hashBuilder = [], key, value;

        for(key in params) if (params.hasOwnProperty(key)) {
            key = escape(key), value = escape(params[key]); // escape(undefined) == "undefined"
            hashBuilder.push(key + ( (value !== "undefined") ? '=' + value : "" ));
        }

        window.location.hash = hashBuilder.join("&");
    };

    (this.load = function () {
        params = {}
        var hashStr = window.location.hash, hashArray, keyVal
        hashStr = hashStr.substring(1, hashStr.length);
        hashArray = hashStr.split('&');

        for(var i = 0; i < hashArray.length; i++) {
            keyVal = hashArray[i].split('=');
            params[unescape(keyVal[0])] = (typeof keyVal[1] != "undefined") ? unescape(keyVal[1]) : keyVal[1];
        }
    })();
}

function capitaliseFirstLetter(string) {
    return string;//.charAt(0).toUpperCase() + string.slice(1);
}

var drawLineXY = d3.svg.line()
    .x(function(d){return d.x;})
    .y(function(d){return d.y;});

function truncate(string, size){
    if (string.length > size)
        return string.substring(0,size)+'...';
    else
        return string;
};

function truncateK(string){

    if (string > 1000) {
        string = string+"";
        return string.substring(0,string.length-3)+'K';
    }
    else
        return string+"";
};

// http://stackoverflow.com/questions/246801/how-can-you-encode-to-base64-using-javascript
function base64_encode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: RafaÅ‚ Kukawski (http://kukawski.pl)
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=_-{}[]$@!~";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}

function base64_decode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=_-{}[]$@!~";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return dec;
}

function export_png() {
    canvg(document.getElementById('canvas-export'), d3.select("#scatterplot").node().innerHTML, {scaleWidth : 500, scaleHeight: 500, renderCallback: shiftSelections, ignoreDimensions: true, ignoreAnimation: true, ignoreMouse: true});
    var canvas = document.getElementById("canvas-export");
    var img    = canvas.toDataURL("image/png");
    window.location = canvas.toDataURL("image/png");
}


function distance(o1, o2){
    return Math.sqrt((o1.x-o2.x)*((o1.x-o2.x))+(o1.y-o2.y)*((o1.y-o2.y)));
}

function removeDuplicateValues(_array){
    _array = _array.filter(function(elem, pos) {
        return _array.indexOf(elem) == pos;
    });
    return _array;
}

function removeNullValues(_array){
    for (var i = 0; i < _array.length; i++) {
        if (_array[i] == null) {
            _array.splice(i, 1);
            i--;
        }
    }
    return _array;
}

function degrees(radians) {
    return radians / Math.PI * 180 - 90;
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

function getFalseArray(array){
    var res = [];
    for(var i in array){
        res[i] = false;
    }
    return res;
}

function checkTrueArray(array){
    var ok = true;
    for(var i in array){
        if(array[i] == false){
            ok = false;
            break;
        }
    }
    return ok;
}

function catchEvent(){
    if(d3.event)d3.event.stopPropagation();
}


function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function open_in_new_tab(url )
{
    var win=window.open(url, '_blank');
    win.focus();
}