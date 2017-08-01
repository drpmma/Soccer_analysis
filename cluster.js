ClusterManager = function(field, Sequence)
{
    this.field = field;
    this.clusterNum = 0;
    this.clusters = new Array();
};

ClusterManager.prototype.addCluster = function(start, end, type)
{
    this.clusters[this.clusterNum] = new Cluster(start, end, type);
    this.clusterNum++;
};

ClusterManager.prototype.clearAll = function()
{
    for(var i = 0; i < this.clusterNum; i++) this.clusters[i].delete();
};

Cluster = function(start, end, type)
{
    this.start = start;
    this.end = end;
    this.type = type;

    //origin information

    //rect

    switch (type)
    {
        case CT_Node_Link: this.nodeLink(); break;
        case CT_Node_Link_All: this.nodeLinkAll(); break;
        case CT_Hive_Plot: this.hivePlot(); break;
        case CT_Tag_Cloud: this.tagCloud(); break;
        case CT_Matrix: this.matrixVis(); break;
        case CT_Shoot: this.shoot(); break;
    }
};

Cluster.prototype.delete = function()
{

};

Cluster.prototype.nodeLink = function()
{

};

Cluster.prototype.nodeLinkAll = function()
{

};

Cluster.prototype.hivePlot = function()
{

};

Cluster.prototype.tagCloud = function()
{

};

Cluster.prototype.matrixVis = function()
{

};

Cluster.prototype.shoot = function()
{

};