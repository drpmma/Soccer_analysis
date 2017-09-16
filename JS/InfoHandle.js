function throwInfo(info) {
    switch(info) {
        case ERR_WRONGTYPE_JSON: alert("请加载.json文件！"); break;
    }
}

var INF = 0x100000;

var WNG = 0x200000;

var ERR = 0x300000;
var ERR_WRONGTYPE_JSON = 0x300001;