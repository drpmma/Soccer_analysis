/**
 * Created by WuJiang on 2017/7/23.
 */
PlayersManager = function() {
    this.infos = infos;
    this.player = new Array();
    this.playerNum = 0;
};

PlayersManager.prototype.addPlayer = function(field, x, y, size, pid, data) {
    this.player[this.playerNum] = new Player(field, x, y, size, pid, data);
    this.playerNum++;
};

PlayersManager.prototype.reChoose = function(pid) {
    for (var i = 0; i < this.player.length; i++)
    {
        if(this.player[i].pid == pid && this.player[i].chosen == 0) this.player[i].choose();
        else if(this.player[i].pid != pid && this.player[i].chosen == 1) this.player[i].dechoose();
    }
};

PlayersManager.prototype.findJerseyByPid = function(pid) {
    for (var i = 0; i < data.players.length; i++)
        if(data.players[i].pid == pid) break;
    if(i == data.players.length) return undefined;
    else return data.players[i].jersey;
};

Players = function(field, data) {
    //console.log(data);
    this.size = field.r_scale(5);

    var num = new Array(10);
    num[0] = num[1] = num[2] = num[3] = num[4] = num[5] = num[6] = num[7] = num[8] = num[9] = 0;
    for (var i = 0; i < data.length; i++)
        switch (data[i].position)
        {
            case "Goalkeeper": num[0]++; break;
            case "Defender": num[1]++; break;
            case "Midfielder": num[2]++; break;
            case "Striker": num[3]++; break;
            case "Substitute": num[4]++; break;
        }

    for (i = 0; i < data.length; i++)
    {
        var x, y;
        switch (data[i].position)
        {
            case "Goalkeeper": num[5]++; x = num[5] * 100 / (num[0]+1); y = 90; break;
            case "Defender": num[6]++; x = num[6] * 100 / (num[1]+1); y = 70; break;
            case "Midfielder": num[7]++; x = num[7] * 100 / (num[2]+1); y = 50; break;
            case "Striker": num[8]++; x = num[8] * 100 / (num[3]+1); y = 30; break;
            case "Substitute": num[9]++; x = -6; y = 105 - num[9]*8; break;
        }
        if(field.direct == 0) pm.addPlayer(field, 100-y, x, this.size, data[i].pid, data[i]);
        else pm.addPlayer(field, x, y, this.size, data[i].pid, data[i]);
    }
};

Player = function (field, x, y, size, pid, data) {
    this.field = field.fieldGroup;
    this.x = x;
    this.y = y;
    this.size = size;
    this.pid = pid;
    this.data = data;
    this.chosen = 0;
    this.changeDuration = 200;

    this.x_scale = field.x_scale;
    this.y_scale = field.y_scale;
    this.wid_scale = field.wid_scale;
    this.hei_scale = field.hei_scale;
    this.r_scale = function(r){
        var x, y;
        x = this.wid_scale(r); y = this.hei_scale(r);
        if(x < y) return x;
        else return y;
    };

    var that = this;
    this.playerGroup = this.field.append("g")
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

Player.prototype.click = function() {
    pm.reChoose(this.pid);
    console.log(this.data);
    pm.infos.changeValues(this.data);
};

Player.prototype.resetPos = function(x, y) {
    this.x = x;
    this.y = y;

    this.playerGroup.transition().duration(this.changeDuration)
        .attr("transform", "translate("+(this.x_scale(x)-this.size/2)+","+(this.y_scale(y)-this.size/2)+")");
};

Player.prototype.resetSize = function(size) {
    this.size = size;
    this.playerGroup.transition().duration(this.changeDuration)
        .attr("transform", "translate("+(this.x_scale(this.x)-this.size/2)+","+(this.y_scale(this.y)-this.size/2)+")");
    switch(this.type)
    {
        case 0:
            this.playerGroup.select("path")
                .transition()
                .duration(this.changeDuration)
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
                .duration(this.changeDuration)
                .attr("r", this.size);
            break;
    }
    this.playerGroup.select("text")
        .transition()
        .duration(this.changeDuration)
        .attr("x", -this.size/9)
        .attr("y", this.size/1.2)
        .attr("style", "font-size: "+(this.size));
};

Player.prototype.drawCircle = function() {
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

Player.prototype.drawJersey = function() {
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

Player.prototype.writeID = function() {
    this.showIDorNot = 1;
    this.playerGroup.append("text")
        .attr("x", this.size*0.5)
        .attr("y", this.size*0.5)
        .attr("style", "text-anchor: middle; dominant-baseline: middle; font-size: "+(this.size)+"px")
        .attr("opacity", "1")
        .text(this.data.jersey);
};

Player.prototype.hideID = function() {

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

Player.prototype.showID = function() {
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

Player.prototype.choose = function() {
    this.chosen = 1;

    var temp;
    if(this.type == 0) temp = this.playerGroup.select("path");
    else if(this.type == 1) temp = this.playerGroup.select("circle");

    temp.transition()
        .duration(this.changeDuration)
        .attr("style", "stroke: red; fill:whitesmoke; stroke-width: "+this.r_scale(0.9));
};

Player.prototype.dechoose = function() {
    this.chosen = 0;

    var temp;
    if(this.type == 0) temp = this.playerGroup.select("path");
    else if(this.type == 1) temp = this.playerGroup.select("circle");

    temp.transition()
        .duration(this.changeDuration)
        .attr("style", "stroke: black; fill: whitesmoke; stroke-width: "+this.r_scale(0.5));
};