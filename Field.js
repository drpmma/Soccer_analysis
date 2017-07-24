Field = function (svg, x, y, width, height, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.x_scale = d3.scaleLinear().domain([0,100]).range([0, this.width]).clamp(true);
    this.y_scale = d3.scaleLinear().domain([0,100]).range([0, this.height]).clamp(true);
    this.r_scale = function(r){
        var x, y;
        x = this.x_scale(r); y = this.y_scale(r);
        if(x < y) return x;
        else return y;
    };

    this.fieldGroup = svg.append("g")
        .attr("class", "field")
        .attr("transform", "translate("+x+","+y+")")
        .attr("width", width)
        .attr("height", height);

    this.draw_field(direction);
}


Field.prototype.draw_field = function (direction) {
    if(direction == 0)
    {
        this.draw_rect(0, 0, 100, 100)
        this.draw_circle(11, 50, 12.5)
        this.draw_circle(89, 50, 12.5)
        this.draw_rect(0, 20, 15, 60)
        this.draw_rect(85, 20, 15, 60)
        this.draw_rect(0, 37, 5, 26)
        this.draw_rect(95, 37, 5, 26)
        this.draw_circle(11, 50, 0.5)
        this.draw_circle(89, 50, 0.5)
        this.draw_circle(50, 50, 12.5)
        this.draw_circle(50, 50, 0.5)
        this.draw_line(0, 45, 0, 55)
        this.draw_line(100, 45, 100, 55)
        this.draw_line(50, 0, 50, 100)
    }
    else
    {
        this.draw_rect(0, 0, 100, 100)
        this.draw_circle(50, 11, 12.5)
        this.draw_circle(50, 89, 12.5)
        this.draw_rect(20, 0, 60, 15)
        this.draw_rect(20, 85, 60, 15)
        this.draw_rect(37, 0, 26, 5)
        this.draw_rect(37, 95, 26, 5)
        this.draw_circle(50, 11, 0.5)
        this.draw_circle(50, 89, 0.5)
        this.draw_circle(50, 50, 12.5)
        this.draw_circle(50, 50, 0.5)
        this.draw_line(45, 0, 55, 0)
        this.draw_line(45, 100, 55, 100)
        this.draw_line(0, 50, 100, 50)
    }
}

Field.prototype.draw_rect = function(x, y, width, height) {
    this.fieldGroup.append("rect")
        .attr("class", "fieldRect")
        .attr("x", this.x_scale(x))
        .attr("y", this.y_scale(y))
        .attr("width", this.x_scale(width))
        .attr("height", this.y_scale(height))
        .attr("fill", "white")
        .attr("stroke", "black");
}

Field.prototype.draw_circle = function(x, y, r) {
    this.fieldGroup.append("circle")
        .attr("class", "fieldLines")
        .attr("cx", this.x_scale(x))
        .attr("cy", this.y_scale(y))
        .attr("r", this.r_scale(r))
        .attr("fill", "white")
        .attr("stroke", "black");
}

Field.prototype.draw_line = function (x1, y1, x2, y2) {
    this.fieldGroup.append("line")
        .attr("class", "fieldLines")
        .attr("x1", this.x_scale(x1))
        .attr("y1", this.y_scale(y1))
        .attr("x2", this.x_scale(x2))
        .attr("y2", this.y_scale(y2))
        .attr("stroke", "black");
}