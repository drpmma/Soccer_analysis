/**
 * Created by WuJiang on 2017/7/30.
 */

Infos = function(svg, x, y, width, height, data) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.infoNum = data[0].stats.length;
    this.limit = new Array(this.infoNum);
    for(var i = 0; i < this.infoNum; i++)
    {
        this.limit[i] = data[0].stats[i].nb;
        for(var j = 1; j < data.length; j++)
            if(this.limit[i] < data[j].stats[i].nb) this.limit[i] = data[j].stats[i].nb;
    }

    this.up = this.height * 0.03;
    this.dwn = this.height * 0.03;
    this.lft = this.width * 0.05;
    this.rt = this.width * 0.05;
    this.hjj = this.height * 0.01;
    this.hg = (this.height - this.up - this.dwn - this.hjj * (this.infoNum-1)) / this.infoNum;
    this.changeDuration = 200;

    this.infosGroup = svg.append("g")
        .attr("class", "infos")
        .attr("transform", "translate("+x+","+y+")")
        .attr("width", width)
        .attr("height", height);
    this.infosGroup.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", this.width-2)
        .attr("height", this.height-2)
        .attr("style", "fill:none; stroke:black; stroke-width: 0.1%");

    this.info = new Array(this.infoNum);
    for(i = 0; i < this.infoNum; i++)
    {
        var temp;
        switch(i) {
            case 0:
                temp = "射门：命中";
                break;
            case 1:
                temp = "射门：被救";
                break;
            case 2:
                temp = "射门：射偏";
                break;
            case 3:
                temp = "射门：失去机会";
                break;
            case 4:
                temp = "射门：立柱";
                break;
            case 5:
                temp = "角球：送出";
                break;
            case 6:
                temp = "角球：获得";
                break;
            case 7:
                temp = "传球：成功";
                break;
            case 8:
                temp = "传球：失败";
                break;
            case 9:
                temp = "出界：造成";
                break;
            case 10:
                temp = "出界：被动";
                break;
            case 11:
                temp = "拦截";
                break;
            case 12:
                temp = "阻挡：成功";
                break;
            case 13:
                temp = "阻挡：失败";
                break;
            case 14:
                temp = "空中争球：成功";
                break;
            case 15:
                temp = "空中争球：失败";
                break;
            case 16:
                temp = "失球";
                break;
            case 17:
                temp = "运球：成功";
                break;
            case 18:
                temp = "运球：失败";
                break;
            case 19:
                temp = "黄牌";
                break;
            case 20:
                temp = "红牌";
                break;
        }
        this.addInfo(i, this.limit[i], temp);
    }

};

Infos.prototype.changeValues = function(data) {
    for(var i = 0; i < data.length; i++)
    {
        this.info[i].changeValue(data[i].nb);
    }
};

Infos.prototype.clearAll = function() {
    for(var i = 0; i < this.infoNum; i++) this.info[i].changeValue(0);
};

Infos.prototype.addInfo = function(num, max, title) {
    this.info[num] = new Info(this, num, max, title);
};

Info = function(g, num, max, title) {
    this.g = g;
    this.num = num;
    this.maxValue = max;
    this.valueTitle = title;
    this.currentValue = 0;
    this.rect_x = (g.width - g.lft - g.rt)*0.5;
    this.rect_y = 0;
    this.rect_width = (g.width - g.lft - g.rt)*0.5;
    this.rect_height = g.hg;
    this.rect_rx = this.rect_width*0.07;
    this.rect_ry = this.rect_height*0.25;

    this.infoGroup = g.infosGroup.append("g")
        .attr("id", "info"+num)
        .attr("transform", "translate(" + (+g.lft) + "," + ((+g.up) + (+num*g.hg) + (+num*g.hjj))  + ")")
        .attr("width", g.width - g.lft - g.rt)
        .attr("height", g.hg);

    this.infoGroup.append("text") //title
        .attr("x", 0)
        .attr("y", g.hg*0.85)
        .attr("style", "font-size:"+(g.hg*0.8)+"px")
        .text(this.valueTitle);

    this.infoGroup.append("rect") //frame
        .attr("x",this.rect_x)
        .attr("y",this.rect_y)
        .attr("width",this.rect_width)
        .attr("height",this.rect_height)
        .attr("rx",this.rect_rx)
        .attr("ry",this.rect_ry)
        .attr("style","fill:none; stroke:black; stroke-width:1;");

    this.infoGroup.append("rect") //value
        .attr("id","value")
        .attr("x",this.rect_x)
        .attr("y",this.rect_y)
        .attr("width",this.currentValue * this.rect_width / this.maxValue)
        .attr("height",this.rect_height)
        .attr("rx",this.rect_rx)
        .attr("ry",this.rect_ry)
        .attr("style","fill:steelblue; stroke:none;");

    this.infoGroup.append("text") //num
        .attr("id","num")
        .attr("x", this.rect_x)
        .attr("y", g.hg*0.85)
        .attr("style", "font-size:"+(g.hg*0.9)+"px")
        .text(this.currentValue);
};

Info.prototype.changeValue = function(value) {
    this.currentValue = value;
    this.infoGroup.select("#value")
        .transition()
        .duration(this.g.changeDuration)
        .attr("width",this.currentValue * this.rect_width / this.maxValue);

    this.infoGroup.select("#num")
        .transition()
        .duration(this.g.changeDuration)
        .text(this.currentValue);
};
