ClusterManager = function(field)
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

    switch (type)
    {
        case CT_Node_Link:
        case CT_Node_Link_All:
        case CT_Hive_Plot:
        case CT_Tag_Cloud:
        case CT_Matrix:
        case CT_Shoot:
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