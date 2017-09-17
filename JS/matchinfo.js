matchinfo.prototype.addFilters = function() {
    if(document.getElementById("sequence_filter")!==null)
        d3.select("#sequence_filter").remove();
    d3.select("#svg_div").append("div")
        .attr("id","sequence_filter")
        .attr("class","part")
        .attr("style","border-color:rgb(237,237,237);border-style:solid;border-width:1px;");

    this.filterList = new Array(5);

    this.filterList[0] = {
        idx: 0,
        content: "中路进攻"
    };
    this.filterList[1] = {
        idx: 1,
        content: "边路进攻"
    };
    this.filterList[2] = {
        idx: 2,
        content: "进攻点转移"
    };
    this.filterList[3] = {
        idx: 3,
        content: "快速反击"
    };
    this.filterList[4] = {
        idx: 4,
        content: "定位球进攻"
    };

    for(let i = 0; i < this.filterList.length; i++)
        this.addFilter(this.filterList[i]);
};

matchinfo.prototype.addFilter = function(params) {
    $('#sequence_filter')[0].innerHTML +=
        `<div class="checkbox seq_flt_cb">
            <label>
                <input type="checkbox">${params.content}
            </label>
        </div>`;
};