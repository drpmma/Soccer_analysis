/**
 * Created by WuJiang on 2017/7/23.
 */

Players = function(field, data, infos) {
    //console.log(data);
    this.player = new Array();
    this.infos = infos;

    for (var i = 0; i < data.length; i++)
    {
        var x, y;
        this.player[i] = new Player(field, this, i%9*10, i/9*30, 11, data[i].pid, data[i]);
    }
};

Players.prototype.reChoose = function(pid) {

};

Player = function (field, teammate, x, y, size, pid, data) {
    this.field = field;
    this.teammate = teammate;
    this.x = x;
    this.y = y;
    this.size = size;
    this.pid = pid;
    this.data = data;

    this.x_scale = d3.scaleLinear().domain([0,100]).range([0, field.attr("width")]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0, field.attr("height")]).clamp(true);
    this.r_scale = function(r){
        var x, y;
        x = this.x_scale(r); y = this.y_scale(r);
        if(x < y) return x;
        else return y;
    };

    var that = this;
    this.playerGroup = field.append("g")
        .attr("id", "player" + pid)
        .attr("class", "player")
        .attr("transform", "translate("+(this.x_scale(x)-size/2)+","+(this.y_scale(y)-size/2)+")")
        .attr("width", size)
        .attr("height", size)
        .attr("style", "cursor: pointer;")
        .on("click", function() {return that.click();});
    this.playerGroup.append("title")
        .text(this.data.first_name + "-" + this.data.position);

    this.drawCircle();
    //this.drawJersey();
    this.writeID();
};

Player.prototype.click = function()
{
    this.teammate.reChoose(this.pid);
    console.log(this.data);
    this.teammate.infos.changeValues(this.data.stats);
};

Player.prototype.resetPos = function(x, y, changeDuration)
{
    this.x = x;
    this.y = y;

    this.playerGroup.transition().duration(changeDuration)
        .attr("transform", "translate("+(this.x_scale(x)-this.size/2)+","+(this.y_scale(y)-this.size/2)+")");
};

Player.prototype.resetSize = function(size, changeDuration)
{
    this.size = size;
    this.playerGroup.transition().duration(changeDuration)
        .attr("transform", "translate("+(this.x_scale(this.x)-this.size/2)+","+(this.y_scale(this.y)-this.size/2)+")");
    switch(this.type)
    {
        case 0:
            this.playerGroup.select("path")
                .transition()
                .duration(changeDuration)
                .attr("d","M "+(0.1*this.size)+" "+(-0.4*this.size)+
                " L "+(-0.4*this.size)+" "+(0.4*this.size)+
                " L "+(-0.3*this.size)+" "+(0.7*this.size)+
                " L "+(-0.1*this.size)+" "+(0.4*this.size)+
                " L "+(-0.1*this.size)+" "+(1.2*this.size)+
                " L "+(1.1*this.size)+" "+(1.2*this.size)+
                " L "+(1.1*this.size)+" "+(0.4*this.size)+
                " L "+(1.3*this.size)+" "+(0.7*this.size)+
                " L "+(1.4*this.size)+" "+(0.4*this.size)+
                " L "+(0.9*this.size)+" "+(-0.4*this.size)+
                " Z");
            break;
        case 1:
            this.playerGroup.select("circle")
                .transition()
                .duration(changeDuration)
                .attr("r", this.size);
            break;
    }
    this.playerGroup.select("text")
        .transition()
        .duration(changeDuration)
        .attr("x", -this.size/9)
        .attr("y", this.size/1.2)
        .attr("style", "font-size: "+(this.size));
};

Player.prototype.drawCircle = function()
{
    this.type = 1;
    this.playerGroup.select("path").remove();
    this.playerGroup.insert("circle","text")
        .attr("cx", this.size*0.5)
        .attr("cy", this.size*0.5)
        .attr("r", 0)
        .transition()
        .duration(200)
        .attr("r", this.size)
        .attr("style", "stroke: black; fill: whitesmoke; stroke-width: "+this.r_scale(0.5));
};

Player.prototype.drawJersey = function()
{
    this.type = 0;
    this.playerGroup.select("circle").remove();
    this.playerGroup.insert("path","text")
        .attr("d","M "+(0.1*this.size)+" "+(-0.4*this.size)+
                  " L "+(-0.4*this.size)+" "+(0.4*this.size)+
                  " L "+(-0.3*this.size)+" "+(0.7*this.size)+
                  " L "+(-0.1*this.size)+" "+(0.4*this.size)+
                  " L "+(-0.1*this.size)+" "+(1.2*this.size)+
                  " L "+(1.1*this.size)+" "+(1.2*this.size)+
                  " L "+(1.1*this.size)+" "+(0.4*this.size)+
                  " L "+(1.3*this.size)+" "+(0.7*this.size)+
                  " L "+(1.4*this.size)+" "+(0.4*this.size)+
                  " L "+(0.9*this.size)+" "+(-0.4*this.size)+
                  " Z")
        .attr("style", "stroke: black; fill: whitesmoke; stroke-width: "+this.r_scale(0.5))
        .attr("opacity", 0)
        .transition()
        .duration(200)
        .attr("opacity", 1);
};

Player.prototype.writeID = function()
{
    this.showIDorNot = 1;
    this.playerGroup.append("text")
        .attr("x", this.size*0.5)
        .attr("y", this.size*0.5)
        .attr("style", "text-anchor: middle; dominant-baseline: middle; font-size: "+(this.size)+"px")
        .attr("opacity", "1")
        .text(this.data.jersey);
};

Player.prototype.hideID = function()
{

    if(this.showIDorNot == 1) {
        this.playerGroup.select("text")
            .transition()
            .duration(200)
            .attr("opacity", "0")
            .attr("x", this.size*0.5)
            .attr("y", this.size*0.5)
            .attr("style", "font-size: "+(this.size)+"px");
        this.showIDorNot = 0;
    }
};

Player.prototype.showID = function()
{
    if(this.showIDorNot == 0) {
        this.playerGroup.select("text")
            .transition()
            .duration(200)
            .attr("opacity", "1")
            .attr("x", this.size*0.5)
            .attr("y", this.size*0.5)
            .attr("style", "font-size: "+(this.size));
        this.showIDorNot = 1;
    }
};