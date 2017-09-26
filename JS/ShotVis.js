ShotVis = function (sequence, clusterGroup, width, height, pad, shotNum, endNum, currentX, currentY) {
    this.sequence = sequence;
    this.clusterGroup = clusterGroup;
    this.width = width;
    this.height = height;
    this.pad = pad;
    this.panelHeight = height / 2.8;
    this.shotNode = this.sequence.nodes[shotNum];
    this.shotNum = shotNum;
    this.endNode = this.sequence.nodes[endNum];
    this.endNum = endNum;
    this.currentX = currentX;
    this.currentY = currentY;

    this.filterModesArray = [
        {name: "goal", selected: true},
        {name: "post", selected: true},
        {name: "saved", selected: true},
        {name: "missed", selected: true}
    ];

    this.visuModesArray = ["dots", "spray"];
    this.visuMode = undefined;

    this.createBrush();
    this.getContextData();

    this.drawHalfField();
    this.drawSplitLine();
    this.drawPost();

    this.drawShots();

    this.modeSetting();
    this.drawStats();
    this.drawModes();
    this.clickFilterMode();
    this.clickVisuMode(this.visuModesArray[0]);
}

ShotVis.prototype.createBrush = function () {
    this.brush = false;

    // this.xBrushField = d3.scaleLinear().range([0, this.fieldWidth]);
    // this.yBrushField = d3.scaleLinear().range([this.fieldHeight, 0]);
    // this.xBrushShotsField = d3.scaleLinear().domain([50,100]).range([0,1]);
    // this.yBrushShotsField = d3.scaleLinear().domain([0,100]).range([0,1]);
    //
    // this.xBrushMouth = d3.scaleLinear().range([0, this.width]);
    // this.yBrushMouth = d3.scaleLinear().range([0, this.distanceHeight]);
    // this.xBrushShotsMouth = d3.scaleLinear().domain([0,100]).range([0,1]);
    // this.yBrushShotsMouth = d3.scaleLinear().domain([34.6,65.4]).range([0,1]);

    this.brushedShotsField = null;
    this.brushedShotsMouth = null;

}

ShotVis.prototype.drawHalfField = function () {
    var that = this;

    this.fieldWidth = this.width;
    this.fieldHeight = 0.4 * this.height;

    this.field = new Field(this.clusterGroup, this.pad, this.pad + this.height - this.fieldHeight - this.panelHeight,
        this.fieldWidth, this.fieldHeight, "clusterField", 0, 0, 0);
    this.field.draw_rect(0, 0, this.width, this.height);
    this.field.fieldGroup.append("path")
        .attr("d", function () {
            return "M" + that.field.x_scale(37.5) + " " + that.field.y_scale(100) + " A "
                + that.field.r_scale(12.5) + " " + that.field.r_scale(12.5) + " 0 0 1 "
                + that.field.x_scale(62.5) + " " + that.field.y_scale(100);
        })
        .attr("fill", "none")
        .attr("stroke", "grey");
    this.field.draw_circle(50, 22, 12.5);
    this.field.draw_rect(20, 0, 60, 30);
    this.field.draw_rect(37, 0, 26, 10);
    this.field.draw_circle(50, 22, 1);
    this.field.draw_circle(50, 100, 1);

}

ShotVis.prototype.drawPosition = function (duration) {
    var endX, endY;
    var shot_dest = getShotDestination(this.sequence.links[this.sequence.links.length - 1]);
    if (shot_dest.type == SHOT_DEST_TYPE_MOUTH) {
        endX = this.setPostX(shot_dest.y);
        endY = this.setPostY(shot_dest.z);
    }
    else {
        endX = this.resetX(this.endNode.y);
        endY = this.resetY(this.endNode.x);
    }
    resetNodePos(this.shotNum, this.resetX(this.shotNode.y), this.resetY(this.shotNode.x), duration, duration);
    resetNodePos(this.endNum, endX, endY, duration, duration);
    repaintPath(this.shotNum - 1, 1, duration, 2 * duration);
    repaintPath(this.endNum - 1, 2, duration, 2 * duration);
}

ShotVis.prototype.drawSplitLine = function () {
    var that = this;
    this.splitWidth = this.height / 30;
    this.distanceHeight = that.height - that.fieldHeight - that.splitWidth - that.panelHeight;
    this.clusterGroup.append("g")
        .attr("id", "splitLine")
        .attr("transform", function () {
            return "translate(" + [0, that.distanceHeight] + ")";
        })
        .attr("width", that.fieldWidth)
        .attr("height", that.splitWidth)
        .append("rect")
        .attr("x", this.pad)
        .attr("y", 0)
        .attr("rx", this.pad)
        .attr("width", this.fieldWidth)
        .attr("height", this.splitWidth);
}

ShotVis.prototype.drawPost = function () {
    this.post_x_scale = d3.scaleLinear().domain([34.6, 65.4]).range([0, 100]).clamp(true);
    this.post_y_scale = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
    this.post = new Field(this.clusterGroup, this.pad, 0, this.fieldWidth, this.distanceHeight,
        "fieldPost", 0, 0, 0);
    this.postWidth = this.post_x_scale(54.8) - this.post_x_scale(45.2);
    this.postHeight = this.post_y_scale(38);
    var rect = this.post.draw_rect(this.post_x_scale(45.2), 100 - this.postHeight, this.postWidth, this.postHeight);
    rect.attr("class", "postRect");
}

ShotVis.prototype.drawShots = function () {
    var that = this;
    if (this.shots == undefined) {
        this.shots = this.clusterGroup.append("g")
            .attr("class", "shotContext")
            .selectAll(".shots_shots")
            .data(this.context_data)
            .enter()
            .append("g")
            .attr("class", function (d) {
                return "shots_shots shots_" + d.shot_type;
            });
    }
    this.shotsField = this.shots.append("circle")
        .attr("class", "shotNode")
        .attr("transform", function (d) {
            return "translate(" + [that.resetX(d.y) - that.currentX, that.resetY(d.x) - that.currentY] + ")";
        })
        .attr("r", 3)
        .attr("fill", function (d) {
            return that.getShotColor(d.shot_type);
        });
    this.shots.each(function (d) {
        var mouth = that.getMouth(d);
        if (mouth != null) {
            d3.select(this).append("circle")
                .attr("class", "shotNode")
                .attr("transform", function () {
                    return "translate(" + [that.setPostX(mouth[0]) - that.currentX,
                        that.setPostY(mouth[1]) - that.currentY] + ")";
                })
                .attr("r", 3)
                .attr("fill", function (d) {
                    return that.getShotColor(d.shot_type);
                });

            d3.select(this).append("line")
                .attr("class", "shotLine")
                .attr("x1", function (d) {
                    return that.resetX(d.y) - that.currentX;
                })
                .attr("y1", function (d) {
                    return that.resetY(d.x) - that.currentY;
                })
                .attr("x2", function () {
                    return that.setPostX(mouth[0]) - that.currentX;
                })
                .attr("y2", function () {
                    return that.setPostY(mouth[1]) - that.currentY;
                })
                .attr("stroke", function (d) {
                    return that.getShotColor(d.shot_type);
                })
                .attr("stroke-width", 2);
        }
        else {
            var blocked = that.getBlocked(d);
            if (blocked != null) {
            }
            else {
            }
        }

    })
}

ShotVis.prototype.getShotType = function (shot) {
    console.log(shot, E_SHOT_MISS, E_SHOT_POST, E_SHOT_SAVED, E_SHOT_GOAL, E_SHOT_CHANCE_MISSED);
    switch (shot.eid) {
        case E_SHOT_MISS:
            return "missed";
            break;
        case E_SHOT_POST:
            return "post";
            break;
        case E_SHOT_SAVED:
            return "saved";
            break;
        case E_SHOT_GOAL:
            return "goal";
            break;
        case E_SHOT_CHANCE_MISSED:
            return "chance_missed";
            break;
        default:
            throw "Unknown shot event type: " + shot.eid;
    }
};

ShotVis.prototype.getBlocked = function (d) {
    var blockedX = undefined;
    var blockedY = undefined;
    for (var q in d.qualifiers) {
        var qual = d.qualifiers[q];
        if (qual.qid == Q_SHOT_BLOCKED_X) {
            blockedX = qual.value;
        }
        else if (qual.qid == Q_SHOT_BLOCKED_Y) {
            blockedY = qual.value;
        }
    }
    if (blockedX != undefined && blockedY != undefined) return [blockedX, blockedY];
    else return null;
};

ShotVis.prototype.getMouth = function (d) {
    var mouthY = undefined;
    var mouthZ = undefined;
    for (var q in d.qualifiers) {
        var qual = d.qualifiers[q];
        if (qual.qid == Q_SHOT_GOAL_MOUTH_Y) {
            mouthY = qual.value;
        }
        else if (qual.qid == Q_SHOT_GOAL_MOUTH_Z) {
            mouthZ = qual.value;
        }
    }
    if (mouthY != undefined && mouthZ != undefined) return [mouthY, mouthZ];
    else return null;
};

ShotVis.prototype.modeSetting = function () {
    this.barWidth = this.width / 7;
    this.settingPad = this.height / 40;
    this.settingMove = this.width / 4;
    this.fontSize = this.barWidth / 2.8;
}

ShotVis.prototype.drawStats = function () {
    var that = this;

    this.stats = [
        {type: "goal", nb: 0},
        {type: "post", nb: 0},
        {type: "saved", nb: 0},
        {type: "missed", nb: 0}
    ];

    this.statsPanel = this.clusterGroup.append("g")
        .attr("class", "statsPanel")
        .attr("transform", function () {
            return "translate(" + [that.pad, that.height - that.panelHeight + that.pad] + ")";
        });

    this.statsPanel.append("rect")
        .attr("width", this.fieldWidth)
        .attr("height", this.panelHeight)
        .attr("rx", 2 * this.pad)
        .style("stroke-width", 0)
        .style("fill", "rgb(36,40,51)");

    this.statsGroups = this.statsPanel.selectAll(".visuShotsStats")
        .data(this.stats)
        .enter()
        .append("g")
        .attr("class", "visuShotsStats")
        .attr("transform", function (d, i) {
            return "translate(" + [(that.barWidth * 1.2 * i), 0] + ")";
        });

    this.statsBarScale = d3.scaleLinear()
        .domain([0, d3.max(this.stats, function (d) {
            return d.nb
        })])
        .range([0, this.panelHeight / 3]);

    this.statsGroups.append("rect")
        .attr("class", (d) => "white_bar")
        .attr("x", this.barWidth / 2)
        .attr("y", function (d) {
            return that.settingPad
        })//this.panelHeight)
        .attr("width", this.barWidth)
        .attr("height", this.panelHeight / 3)
        .attr("rx", this.pad)
        .attr("fill", function (d) {
            return "white"
        });

    this.statsGroups.append("rect")
        .attr("class", function (d) {
            return "shot_bar shot_" + d.type;
        })
        .attr("x", this.barWidth / 2)
        .attr("y", function (d) {
            return (that.panelHeight / 3 + that.settingPad - that.statsBarScale(d.nb))
        })//this.panelHeight)
        .attr("width", this.barWidth)
        .attr("height", function (d) {
            return that.statsBarScale(d.nb);
        })
        .attr("rx", this.pad)
        .attr("fill", function (d) {
            return that.getShotColor(d.type);
        });

    var totalShots = d3.sum(this.stats, function (d) {
        return d.nb
    });

    // this.statsGroups.append("text")
    //     .text(function(d){return d.nb + "("+ ( totalShots != 0 ? parseInt((d.nb/totalShots)*100) : 0 )+"%)"})
    //     .attr("text-anchor", "start")
    //     .attr("class", "stats_text")
    //     .attr("font-size", this.fontSize)
    //     .attr("x", 2 * this.barWidth)
    //     .attr("y", this.height / 10)
    //     .attr("fill", "white");

    this.totalShotsGroup = this.clusterGroup.selectAll(".visuShotsTotalShots")
        .data([totalShots])
        .enter()
        .append("g")
        .attr("transform", "translate(" + [this.pad, this.pad] + ")")
        .attr("class", ".visuShotsTotalShots");

    this.totalShotsGroup.append("rect")
        .style("stroke", "black")
        .style("fill", "white")
        .attr("rx", this.pad)
        .attr("width", 2 * this.barWidth)
        .attr("height", this.height / 18);

    this.totalShotsGroup.append("text")
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "middle")
        .attr("class", "stats_text")
        .style("font-size", this.height / 20)
        .style("fill", "black")
        .attr("x", this.barWidth)
        .attr("y", this.height / 21);
}

ShotVis.prototype.drawModes = function () {
    var that = this;

    this.filterModesPanel = this.clusterGroup.append("g")
        .attr("class", "filterModes")
        .attr("transform", "translate(" + [this.pad, this.height - this.panelHeight] + ")");

    this.filterModes = this.filterModesPanel.selectAll("g.visuShotsModes")
        .data(this.filterModesArray)
        .enter()
        .append("g")
        .attr("class", "visuShotsFilterModes")
        .attr("transform", function (d, i) {
            return "translate(" + [(that.barWidth * 1.2 * i), 2.5 * that.settingPad] + ")";
        })
        .on("click", clickFilterMode)
        .on("mouseover", overFilterMode);

    this.filterModes
        .append("rect")
        .attr("x", this.barWidth / 2)
        .attr("y", this.barWidth)
        .attr("rx", this.pad)
        .attr("width", this.barWidth)
        .attr("height", this.barWidth / 2);

    this.filterModes
        .append("text")
        .attr("class", "filters_text")
        .text(function (d) {
            return that.getShotName(d.name)
        })
        .attr("text-anchor", "middle")
        .attr("x", this.barWidth)
        .attr("y", this.barWidth * 1.4)
        .attr("font-size", this.fontSize);

    function clickFilterMode(d) {
        catchEvent();
        d.selected = !d.selected;
        that.clickFilterMode();
    }

    function overFilterMode() {
        d3.select(this).style("cursor", "pointer");
    }

    this.visuModesPanel = this.clusterGroup.append("g")
        .attr("class", "visualModes")
        .attr("transform", "translate(" + [this.pad, this.height - this.panelHeight] + ")");

    this.visuModes = this.visuModesPanel.selectAll("g.visuShotsVisuModes")
        .data(this.visuModesArray)
        .enter()
        .append("g")
        .attr("class", "visuShotsVisuModes")
        .attr("transform", function (d, i) {
            return "translate(" + [that.barWidth * 1.3 * i, 10.5 * that.settingPad] + ")";
        })
        .on("click", clickVisuMode)
        .on("mouseover", overVisuMode);

    this.visuModes
        .append("rect")
        .attr("x", this.barWidth / 2)
        .attr("y", 0)
        .attr("rx", 2 * this.pad)
        .attr("width", (d, i) => i === 0 ? this.barWidth * 1.2 : this.barWidth * 4.8)
        .attr("height", this.barWidth / 1.5);

    this.visuModes
        .append("text")
        .text(function (d) {
            return that.getModeName(d)
        })
        .attr("class", "modes_text")
        .attr("text-anchor", "middle")
        .attr("x", this.barWidth * 1.1)
        .attr("y", this.barWidth / 3)
        .attr("dominant-baseline", "middle")
        .attr("font-size", this.fontSize);

    var sliderParams = {
        width: this.settingMove * 1.8,
        height: this.pad * 2,
        padding: this.pad,
        parent: this.visuModesPanel,
        sliderClass: "visuShotsSlider",
        x: this.barWidth * 3.1,
        y: this.barWidth * 2.85,
        rootSVG: that.clusterGroup,
        parentVisu: this,
        slider_range: [0, 50]
    };
    this.sliderSpray = new SimpleSlider(sliderParams);
    var min_spray_radius = 15;
    var max_spray_radius = 40;
    this.spray_radius_scale = d3.scaleLinear()
        .domain(this.sliderSpray.slider_range)
        .range([min_spray_radius, max_spray_radius]);
    this.sprayRadius = this.spray_radius_scale(0);
    this.changeSprayRadius(0);


    function clickVisuMode(d) {
        catchEvent();
        that.clickVisuMode(d);
    }

    function overVisuMode() {
        d3.select(this).style("cursor", "pointer");
    }

    // the "brush" mode
    this.brushing = this.visuModesPanel
        .append("g")
        .attr("transform", "translate(" + [that.barWidth * 5, 3 * this.settingPad] + ")")
        .attr("class", "visuShotsBrushing")
        .on("click", clickBrushing)
        .on("mouseover", overBrushing);

    this.brushing
        .append("rect")
        .attr("x", this.barWidth / 2)
        .attr("y", 0)
        .attr("rx", this.pad * 3)
        .attr("width", this.barWidth * 1.2)
        .attr("height", this.barWidth * 1.2);
    this.brushing
        .append("image")
        .attr("x", this.barWidth * 0.6)
        .attr("y", this.barWidth / 10)
        .attr("xlink:href", "img/filiter.png")
        .attr("height", this.barWidth)
        .attr("width", this.barWidth)

    function clickBrushing() {
        catchEvent();
        that.brush = !that.brush;
        d3.select(this).select("rect").classed("modes_selected", function () {
            return that.brush;
        });
        that.clickBrushing();
    }

    function overBrushing() {
        d3.select(this).style("cursor", "pointer");
    }
}

ShotVis.prototype.getModeName = function (name) {
    switch (name) {
        case "dots":
            return "点图";
        case "spray":
            return "雾图";
    }
}

ShotVis.prototype.getShotName = function (name) {
    switch (name) {
        case "goal":
            return "进球";
        case "post":
            return "门柱";
        case "saved":
            return "扑出";
        case "missed":
            return "偏出";
    }
}

ShotVis.prototype.changeSprayRadius = function (val) {
    if (this.visuMode == "spray") {
        this.sprayRadius = this.spray_radius_scale(val);
        this.shots.selectAll(".shotNode")
            .attr("r", this.sprayRadius);
    }
};

ShotVis.prototype.filterShots = function () {
    var that = this;
    var selectedFilterModes = [];
    this.filterModesArray.forEach(function (mode) {
        if (mode.selected == true) selectedFilterModes.push(mode.name);
    });

    //reset the stats
    this.stats.forEach(function (stat) {
        stat.nb = 0;
    });

    //update the shots classes and also update the stats data
    d3.selectAll(".shots_shots").each(function (d) {

        var theShot = d3.select(this);
        //remove the old class
        theShot.classed("shot_hidden", false);
        theShot.classed("shot_transparent", false);
        theShot.classed("shot_visible", false);

        if (
            // d.time < that.tMin || d.time > that.tMax //if not in the interval ||
        selectedFilterModes.indexOf(d.shot_type) == -1) { //if not the filtered type of shot{
            theShot.classed("shot_hidden", true);
        }
        else {
            var brushedField = that.brushedShotsField != null;
            var brushedMouth = that.brushedShotsMouth != null;
            if (brushedField && brushedMouth
                && (that.brushedShotsField.indexOf(d) == -1 || that.brushedShotsMouth.indexOf(d) == -1)//if not brushed by one of the brush
                || brushedField && that.brushedShotsField.indexOf(d) == -1 //if not brushed in field
                || brushedMouth && that.brushedShotsMouth.indexOf(d) == -1 //if not brushed in mouth
            ) {
                theShot.classed("shot_transparent", true);
            }
            else {//shot selected, update also the stats
                incrementStat(d.shot_type);
                theShot.classed("shot_visible", true);
            }
        }
    });

    function incrementStat(type) {
        for (var s in that.stats) {
            if (that.stats[s].type == type) {
                that.stats[s].nb++;
            }
        }
    }

    //update the stats
    this.statsBarScale = d3.scaleLinear()
        .domain([0, d3.max(this.stats, function (d) {
            return d.nb
        })])
        .range([0, that.panelHeight / 3]);
    var totalShots = d3.sum(this.stats, function (d) {
        return d.nb
    });

    var maxBarHeight = d3.max(this.stats, (d) => d.nb)
    this.statsGroups
        .select(".white_bar")
        .attr("x", this.barWidth / 2)
        .attr("y", function (d) {
            return that.settingPad
        })//this.panelHeight)
        .attr("width", this.barWidth)
        .attr("height", this.panelHeight / 3);

    this.statsGroups
        .select(".shot_bar")
        .transition().duration(600)
        .attr("y", function (d) {
            return (that.panelHeight / 3 + that.settingPad - that.statsBarScale(d.nb))
        })
        .attr("height", function (d) {
            return that.statsBarScale(d.nb);
        });

    this.statsGroups
        .select("text")
        .text(function (d) {
            return d.nb + "(" + ( totalShots != 0 ? parseInt((d.nb / totalShots) * 100) : 0 ) + "%)"
        });

    this.totalShotsGroup
        .data([totalShots])
        .select("text")
        //.transition().duration(600)
        .text(function (d) {
            return d
        });

};

ShotVis.prototype.clickBrushing = function () {
    catchEvent();
    var that = this;
    //activate the brushing
    if (this.brush) {
        var fieldBrushScale = [[2 * that.pad, that.distanceHeight + that.splitWidth + that.pad],
            [that.width, that.height - that.panelHeight]];
        //brush on the field
        this.clusterGroup.append("g")
            .attr("class", "brush")
            .attr("id", "brushField")
            // .attr("transform", that.field.fieldGroup.attr("transform"))
            .call(d3.brush()
                .extent(fieldBrushScale)
                .on("brush", brushmoveField)
                .on("end", brushendField));

        //brush on the mouth
        var postBrushScale = [[2 * that.pad, that.pad], [that.width, that.distanceHeight - that.pad]];
        this.clusterGroup.append("g")
            .attr("class", "brush")
            .attr("id", "brushPost")
            // .attr("transform", that.post.fieldGroup.attr("transform"))
            .call(d3.brush()
                .extent(postBrushScale)
                .on("brush", brushmoveMouth)
                .on("end", brushendMouth));


        function brushmoveField() {
            var e = d3.brushSelection(d3.select("#brushField").node());
            that.brushedShotsField = [];
            that.shotsField.each(function (d) {
                var shotx = that.resetX(d.y) - that.currentX;
                var shoty = that.resetY(d.x) - that.currentY;
                if (e[0][0] <= shotx && shotx <= e[1][0]
                    && e[0][1] <= shoty && shoty <= e[1][1]) {
                    that.brushedShotsField.push(d);
                }
            });
            that.filterShots();
        }

        function brushmoveMouth() {
            var e = d3.brushSelection(d3.select("#brushPost").node());
            that.brushedShotsMouth = [];
            that.shotsField.each(function (d) {
                var mouth = that.getMouth(d);
                console.log("mouth", mouth)
                if (mouth == null) return;
                var mouthx = that.setPostX(mouth[0]) - that.currentX;
                var mouthy = that.setPostY(mouth[1]) - that.currentY;
                if (e[0][0] <= mouthx && mouthx <= e[1][0]
                    && e[0][1] <= mouthy && mouthy <= e[1][1]) {
                    that.brushedShotsMouth.push(d);
                }
            });
            that.filterShots();
        }

        function brushendField() {
            if (d3.brushSelection(d3.select("#brushField").node()) == null) that.brushedShotsField = null;
            that.filterShots();
        }

        function brushendMouth() {
            if (d3.brushSelection(d3.select("#brushPost").node()) == null) that.brushedShotsMouth = null;
            that.filterShots();
        }
    }
    //cancel the brushing
    else {
        //console.log("remove brush");
        this.clusterGroup.selectAll(".brush").remove();
        this.clusterGroup.style("cursor", "default");
        that.brushedShotsField = null;
        that.brushedShotsMouth = null;
        that.filterShots();
    }
};

ShotVis.prototype.clickFilterMode = function () {
    catchEvent();
    this.filterShots();
};

ShotVis.prototype.clickVisuMode = function (mode) {
    catchEvent();
    //if a new mode
    if (mode == this.visuMode) return;

    var that = this;
    this.visuModes.selectAll("rect")
        .classed("modes_selected", function (d) {
            if (d == mode) {
                that.visuMode = d;
                return true;
            }
            return false;
        });

    switch (this.visuMode) {
        case "dots":
            this.shots.selectAll(".shotLine")
                .style("visibility", "visible");
            this.shots.selectAll(".shotNode")
                .attr("r", 2)
                .style("fill", "");
            d3.select(".visuShotsSlider")
                .style("visibility", "hidden");
            break;
        case "spray":
            this.shots.selectAll(".shotLine")
                .style("visibility", "hidden");
            this.shots.selectAll(".shotNode")
                .attr("r", that.sprayRadius)
                .style("fill", "url(#radialGradientSpray)");
            d3.select(".visuShotsSlider")
                .style("visibility", "visible");
            break;
    }

    //update the current mode
    this.visuMode = mode;
};

ShotVis.prototype.getContextShots = function () {
    var shots = [];

    data.players.team0.forEach(function (player) {
        if (player.events == undefined) return;
        player.events.forEach(function (d) {
            if (isShot(d)) {
                shots.push(d);
            }
        });
    });
    return shots;
};

ShotVis.prototype.getContextData = function () {
    this.context_data = this.getContextShots();
    console.log(this.context_data);
    for (var s = 0; s < this.context_data.length; s++) {
        this.context_data[s].shot_type = this.getShotType(this.context_data[s]);
    }
};

ShotVis.prototype.resetX = function (y) {
    return y / 100 * this.fieldWidth + this.currentX;
};

ShotVis.prototype.resetY = function (x) {
    return (50 - Math.abs(x - 50)) / 50 * this.fieldHeight + this.currentY
        + this.height - this.fieldHeight - this.panelHeight;
};

ShotVis.prototype.setPostX = function (x) {
    return this.currentX + this.post_x_scale(x) / 100 * this.width;
};

ShotVis.prototype.setPostY = function (y) {
    return this.currentY + (100 - this.post_y_scale(y)) / 100 * (this.distanceHeight);
};

ShotVis.prototype.getShotColor = function (shot_type) {
    switch (shot_type) {
        case "goal":
            return getEventColor(E_SHOT_GOAL);
        case "post":
            return getEventColor(E_SHOT_POST);
        case "saved":
            return getEventColor(E_SHOT_SAVED);
        case "missed":
            return getEventColor(E_SHOT_MISS);
        default:
//            console.log("unknown name for shot: " + d);
            return getEventColor(E_SHOT_CHANCE_MISSED);
    }
}

function SimpleSlider(params) {
    this.init(params);
}

SimpleSlider.prototype.init = function (params) {

    this.slider_range = params.slider_range;

    var slider = params.parent.append("g")
        .attr("class", params.sliderClass)
        .attr("transform", "translate(" + params.x + "," + params.y + ")");

    var rect = slider.append("rect")
        .attr("class", "layer")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", params.padding * 2)
        .attr("width", params.width)
        .attr("height", params.height);

    var _dragSliderLine;

    var sliderLine = this.sliderLine =
        slider.append("rect")
            .attr("x", 0)
            .attr("y", -3 * params.padding)
            .attr("rx", 3 * params.padding)
            .attr("width", 8 * params.padding)
            .attr("height", 8 * params.padding)
            .on("mousedown", function () {
                d3.event.preventDefault();
                d3.event.stopPropagation();
                _dragSliderLine = this;
                this.style.cursor = "pointer";
                return false;
            });


    sliderLine.on("mouseup", function () {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        if (_dragSliderLine != null) {
            _dragSliderLine.style.cursor = "pointer";
            _dragSliderLine = null;
        }
    });

    rect.on("mousemove", function () {
        d3.event.preventDefault();
        d3.event.stopPropagation();

        if (_dragSliderLine != null) {
            var coordinateX = d3.mouse(this)[0];
            sliderLine.attr("x", coordinateX - 15 / 2);
            if (params.parentVisu instanceof ShotVis) {
                params.parentVisu.changeSprayRadius(sliderLine.attr("x"));
            }

        }
    });
    rect.on("mouseup", function () {
        d3.event.stopPropagation();
    })
};