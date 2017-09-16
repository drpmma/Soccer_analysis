tips = function() {
    this.data=[{"eid":E_SHOT_MISS, "name":"射偏" },{"eid":E_SHOT_POST,"name":"射中门框"},{"eid":E_SHOT_SAVED,"name":"射门被扑"},{"eid":E_SHOT_GOAL,"name":"射门成功"},{"eid":E_SHOT_CHANCE_MISSED,"name":"错失机会"}];
    this.str="";
    for(let d of this.data){
        d.color = getEventColor(d.eid)
    }
    for(let d of this.data)
    {
        this.str+= `<div style='position:relative;top:3%;width:30%;height:12%;background:${d.color};stroke:none;border-radius:3px;float:left;margin-top: 3%'></div>
                   <p style='margin-top:5%;margin-bottom:0'>　${d.name}</p>`
    }
    document.getElementById("tips_color").innerHTML =this.str;

    document.getElementById("tips_line").innerHTML =
        "<div style='position:relative;top:3%;width:30%;height:12%;stroke:none;border-radius:3px;float:left;margin-top: 3%'>" +
        "   <svg style='width:100%;height:100%;'>" +
        "       <path stroke-width='2px' stroke='black' d='M0 5L35 5' stroke-dasharray='3,3'></path>" +
        "   </svg>"+
        "</div>" +
        "<p style='margin-top:5%;margin-bottom:0'>　短传球</p>" +
        "<div style='position:relative;top:3%;width:30%;height:12%;stroke:none;border-radius:3px;float:left;margin-top: 3%'>" +
        "   <svg style='width:100%;height:100%;'>" +
        "       <path stroke-width='2px' stroke='black' d='M0 8 Q 17.5 0 35 8' stroke-dasharray='7,7' fill='none'></path>" +
        "   </svg>"+
        "</div>" +
        "<p style='margin-top:5%;margin-bottom:0'>　长传球</p>" +
        "<div style='position:relative;top:3%;width:30%;height:12%;stroke:none;border-radius:3px;float:left;margin-top: 3%'>" +
        "   <svg style='width:100%;height:100%;'>" +
        "       <path stroke-width='1px' stroke='black' d='M0 5L35 5'></path>" +
        "   </svg>"+
        "</div>" +
        "<p style='margin-top:5%;margin-bottom:0'>　带球</p>" +
        "<div style='position:relative;top:3%;width:30%;height:12%;stroke:none;border-radius:3px;float:left;margin-top: 3%'>" +
        "   <svg style='width:100%;height:100%;'>" +
        "       <path stroke-width='1px' stroke='"+this.data[0].color+"' d='M0 1L35 1'></path>" +
        "       <path stroke-width='1px' stroke='"+this.data[1].color+"' d='M0 3L35 3'></path>" +
        "       <path stroke-width='1px' stroke='"+this.data[2].color+"' d='M0 5L35 5'></path>" +
        "       <path stroke-width='1px' stroke='"+this.data[3].color+"' d='M0 7L35 7'></path>" +
        "       <path stroke-width='1px' stroke='"+this.data[4].color+"' d='M0 9L35 9'></path>" +
        "   </svg>"+
        "</div>" +
        "<p style='margin-top:5%;margin-bottom:0'>　射门</p>";
    console.log(this.data);
}
