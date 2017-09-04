//CatmullRom
function CatmullRomSpline(P0, P1, P2, P3) {
    //Calculate t0 to t4
    var alpha = 0.5;

    // console.log(P0);
    // console.log(P1);
    // console.log(P2);
    // console.log(P3);


    function tj(ti, Pi, Pj) {
        //xi, yi = Pi
        var xi = Pi.x;
        var yi = Pi.y;
        //xj, yj = Pj
        var xj = Pj.x;
        var yj = Pj.y;
        //return ( ( (xj-xi)**2 + (yj-yi)**2 )**0.5 )**alpha + ti
        return Math.pow( Math.pow( (Math.pow((xj-xi),2) + Math.pow((yj-yi),2)), 0.5) , alpha)+ ti ;
    }

    var t0 = 0;
    var t1 = tj(t0, P0, P1);
    var t2 = tj(t1, P1, P2);
    var t3 = tj(t2, P2, P3);

    // console.log(t1);
    // console.log(t2);
    // console.log(t3);

    var newPoints = [];


    for(var t=t1; t<t2; t+=((t2-t1)/10))
    {
        //var A1 = (t1-t)/(t1-t0)*P0 + (t-t0)/(t1-t0)*P1;
        var A1 = clone(P0);
        A1.x = (t1-t)/(t1-t0)* P0.x + (t-t0)/(t1-t0)* P1.x;
        A1.y = (t1-t)/(t1-t0)* P0.y + (t-t0)/(t1-t0)* P1.y;

        //var A2 = (t2-t)/(t2-t1)* P1 + (t-t1)/(t2-t1)*P2;
        var A2 = clone(P0);
        A2.x = (t2-t)/(t2-t1)* P1.x + (t-t1)/(t2-t1)* P2.x;
        A2.y = (t2-t)/(t2-t1)* P1.y + (t-t1)/(t2-t1)* P2.y;

        //var A3 = (t3-t)/(t3-t2)* P2 + (t-t2)/(t3-t2)*P3;
        var A3 = clone(P0);
        A3.x = (t3-t)/(t3-t2)* P2.x + (t-t2)/(t3-t2)* P3.x;
        A3.y = (t3-t)/(t3-t2)* P2.y + (t-t2)/(t3-t2)* P3.y;

        //var B1 = (t2-t)/(t2-t0)* A1 + (t-t0)/(t2-t0)*A2;
        var B1 = clone(P0);
        B1.x = (t2-t)/(t2-t0)* A1.x + (t-t0)/(t2-t0)* A2.x;
        B1.y = (t2-t)/(t2-t0)* A1.y + (t-t0)/(t2-t0)* A2.y;

        //var B2 = (t3-t)/(t3-t1)* A2 + (t-t1)/(t3-t1)*A3;
        var B2 = clone(P0);
        B2.x = (t3-t)/(t3-t1)* A2.x + (t-t1)/(t3-t1)* A3.x;
        B2.y = (t3-t)/(t3-t1)* A2.y + (t-t1)/(t3-t1)* A3.y;

        //var C = (t2-t)/(t2-t1)* B1 + (t-t1)/(t2-t1)*B2;
        var C = clone(P0);
        C.x = (t2-t)/(t2-t1)* B1.x + (t-t1)/(t2-t1)* B2.x;
        C.y = (t2-t)/(t2-t1)* B1.y + (t-t1)/(t2-t1)* B2.y;

        newPoints.push(C);
        //console.log(C);
    }
    //console.log(newPoints);
    return newPoints;

}

function CatmullRomChain(P) {

    //Calculate Catmull Rom for a chain of points and return the combined curve.

    var sz = P.length;

    // The curve C will contain an array of (x,y) points.
    var C = [];
    for (var i = 0; i<sz-3 ; i++) {
        //console.log();
        var c = CatmullRomSpline(P[i], P[i + 1], P[i + 2], P[i + 3])
        //C + = c;
        for (var j =0; j < c.length; j++) {
            C.push( c[j] );
        }
    }

    return C
}

//SIA
function SIA(lhypoints, SS, SI) {
    //console.log(lhypoints);
    function innerSIA(lhyPoints, SS) {
        //console.log(lhypoints);
        var hyXi;
        var lyXi;
        var a = SS;
        var Ub = lhyPoints.length - SS;
        for (var i = 0; i<lhyPoints.length; i++) {
            if (i<a){

                hyXi = (lhyPoints[i].x + lhyPoints[0].x + lhyPoints[2*i].x )/3;
                lyXi = (lhyPoints[i].y + lhyPoints[0].y + lhyPoints[2*i].y )/3;
                lhyPoints[i].x = hyXi;
                lhyPoints[i].y = lyXi;
            }
            else if ((i>=a)&&(i<Ub)){

                hyXi = (lhyPoints[i].x + lhyPoints[i-a].x + lhyPoints[i+a].x )/3;
                lyXi = (lhyPoints[i].y + lhyPoints[i-a].y + lhyPoints[i+a].y )/3;
                lhyPoints[i].x = hyXi;
                lhyPoints[i].y = lyXi;
            }
            else{
                hyXi = (lhyPoints[i].x + lhyPoints[2*i-lhyPoints.length].x + lhyPoints[lhyPoints.length-1].x )/3;
                lyXi = (lhyPoints[i].y + lhyPoints[2*i-lhyPoints.length].y + lhyPoints[lhyPoints.length-1].y )/3;
                lhyPoints[i].x = hyXi;
                lhyPoints[i].y = lyXi;

            }
        }
        return lhyPoints;

    }

    var lhytempPoints = [];
    lhytempPoints = lhypoints;
    if (lhypoints.length <= 6){
        return lhypoints;
    }
    //console.log(lhytempPoints);
    for (var i = 0; i < SI ; i ++ ){
        lhytempPoints = innerSIA(lhytempPoints, SS);

    }
    //console.log(lhytempPoints);
    return lhytempPoints;
}

//bezier curve

function PointOnCubicBezier(cp, t, sz, VarWeight)
{


    var ConstantWeight= 200;
    var tmp_points = [];
    for (var z = 0; z < sz; ++z) {
        tmp_points[z] = clone(cp[0]);
    }

    for (var i = 1; i < sz; ++i)
    {
        for (var j = 0; j < sz - i; ++j)
        {


            if (i == 1)
            {

                if(j == 0) {
                    tmp_points[j].x = (cp[j].x * (1 - t) * ConstantWeight + cp[j + 1].x * t * VarWeight ) / ((1 - t) * ConstantWeight +  t * VarWeight);
                    tmp_points[j].y = (cp[j].y * (1 - t) * ConstantWeight + cp[j + 1].y * t * VarWeight ) / ((1 - t) * ConstantWeight +  t * VarWeight);
                }
                else if(j == sz - 2) {
                    tmp_points[j].x = (cp[j].x * (1 - t) * VarWeight + cp[j + 1].x * t * ConstantWeight ) / ((1 - t) * VarWeight +  t * ConstantWeight);
                    tmp_points[j].y = (cp[j].y * (1 - t) * VarWeight + cp[j + 1].y * t * ConstantWeight ) / ((1 - t) * VarWeight +  t * ConstantWeight);
                }
                else {
                    tmp_points[j].x = (cp[j].x * (1 - t) * VarWeight + cp[j + 1].x * t * VarWeight ) / ((1 - t) * VarWeight +  t * VarWeight);
                    tmp_points[j].y = (cp[j].y * (1 - t) * VarWeight + cp[j + 1].y * t * VarWeight ) / ((1 - t) * VarWeight +  t * VarWeight);
                }
                continue;
            }
            // tmp_points[j].x = (tmp_points[j].x * (1 - t) + tmp_points[j + 1].x * t );
            // tmp_points[j].y = (tmp_points[j].y * (1 - t) + tmp_points[j + 1].y * t );

            if(j == 0) {
                tmp_points[j].x = (tmp_points[j].x * (1 - t) * ConstantWeight + tmp_points[j + 1].x * t * VarWeight ) / ((1 - t) * ConstantWeight +  t * VarWeight);
                tmp_points[j].y = (tmp_points[j].y * (1 - t) * ConstantWeight + tmp_points[j + 1].y * t * VarWeight ) / ((1 - t) * ConstantWeight +  t * VarWeight);
            }
            else if(j == sz - 2) {
                tmp_points[j].x = (tmp_points[j].x * (1 - t) * VarWeight + tmp_points[j + 1].x * t * ConstantWeight ) / ((1 - t) * VarWeight +  t * ConstantWeight);
                tmp_points[j].y = (tmp_points[j].y * (1 - t) * VarWeight + tmp_points[j + 1].y * t * ConstantWeight ) / ((1 - t) * VarWeight +  t * ConstantWeight);
            }
            else {
                tmp_points[j].x = (tmp_points[j].x * (1 - t) * VarWeight + tmp_points[j + 1].x * t * VarWeight ) / ((1 - t) * VarWeight +  t * VarWeight);
                tmp_points[j].y = (tmp_points[j].y * (1 - t) * VarWeight + tmp_points[j + 1].y * t * VarWeight ) / ((1 - t) * VarWeight +  t * VarWeight);
            }

        }
    }

    //console.log(tmp_points)
    return tmp_points[0];



}

function ComputeBezier( cp, VarWeight, numberOfPoints )
{

    //console.log(VarWeight);
    var   i;
    var hycurve=[];

    var step = 1.0 / numberOfPoints;
    var t = 0;

    var sz = cp.length;

    for (i = 0; i < numberOfPoints; i++) {
        hycurve[i] = PointOnCubicBezier(cp, t, sz, VarWeight);
        t += step;
    }


    //console.log(hycurve);
    return hycurve;




}

//k
function calc_k(S, X) {
    var kMax = 30;
    return Math.max(S, kMax) * X / 5.0 ;
}

function kMeans(lhyDrawPoints, k) {


    var kMeanTempPoints = [];


    for(var i=0;i<lhyDrawPoints.length;i++){
        kMeanTempPoints[i] = [];
        kMeanTempPoints[i][0] = lhyDrawPoints[i].x;
        kMeanTempPoints[i][1] = lhyDrawPoints[i].y;

    }


    var means = [];

    var assignments = kmeans.assignPointsToMeans(kMeanTempPoints, means);



    function step() {

        oldAssignments = assignments;

        kmeans.moveMeansToCenters(kMeanTempPoints, assignments, means);

        assignments = kmeans.assignPointsToMeans(kMeanTempPoints, means);

        var changeCount = kmeans.countChangedAssignments(assignments, oldAssignments);

        var aveDistance = kmeans.findAverageDistancePointToMean(kMeanTempPoints, means, assignments);
        var aveMeanSeparation = kmeans.findAverageMeanSeparation(means);
        var sse = kmeans.sumSquaredError(kMeanTempPoints, means, assignments);

        return changeCount;
    }


    function changeK(amt) {
        if (amt > 0) {
            while (amt--) {
                var i = Math.floor(Math.random() * kMeanTempPoints.length);

                var p = [];
                p[0] = [];
                p[0][0] = kMeanTempPoints[i][0];
                p[0][1] = kMeanTempPoints[i][1];
                means.push(p[0]);
            }
        }
        else while (amt < 0) {
            means.pop();
            amt++;
        }
        assignments = kmeans.assignPointsToMeans(kMeanTempPoints, means);

    }

    changeK(k);

    var ChangedNodes = 100;

    do {
        ChangedNodes = step();

    }while (ChangedNodes != 0);

    //console.log(assignments);
    var finalPoints = [];
    var j=0;

    Array.prototype.unique3 = function() {
        var res = [];
        var json = {};
        for(var i = 0; i < this.length; i++){
            if(!json[this[i]]){
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
        return res;
    };

    var myIndex = assignments.unique3();
    // console.log(myIndex);
    //myIndex.sort();
    // console.log(myIndex);

    var j = 0;
    for(var i = 0; i < myIndex.length; i++){
        //console.log(myIndex[i]);


        var k = myIndex[i];
        finalPoints[j] = [0,0];
        //console.log(finalPoints[j]);
        finalPoints[j][0] = means[k][0];
        finalPoints[j][1] = means[k][1];
        j++;
    }

    //console.log(finalPoints);
    var ChangedFinalPoints = [];
    for(var i=0;i<finalPoints.length;i++){
        ChangedFinalPoints[i] = clone(lhyDrawPoints[0]);
        ChangedFinalPoints[i].x = finalPoints[i][0];
        ChangedFinalPoints[i].y = finalPoints[i][1];

    }

    return ChangedFinalPoints;
}

function kMedoids(lhyDrawPoints, k) {

    var Particle = function(x, y) {
        this.x = x;
        this.y = y;
    };


    var particleList = [];
    var maxCluster = 9;
    var desiredNumCluster = k;
    var numCluster = 1;

    var ClusterCenters = [];
    var ClusterCentersIndex = [];

    function kMedoidsDraw() {
        var count = 0;
        var i, j, m, n;
        var cluster = kmedoids.getCluster();
        for (i=0, n=cluster.length;i<n;i++) {
            for (j=0, m=cluster[i].length;j<m;j++) {
                console.log("---------");
                console.log("cluter "+i);
                console.log("number"+j);
                console.log("cluster[i][j]"+cluster[i][j]);
                // console.log(particleList[cluster[i][j]]);
                // drawDataPoint(particleList[cluster[i][j]], i, j===0);
                if (j===0) {
                    ClusterCentersIndex[count] = cluster[i][j];
                    count++;
                }

            }
        }

        ClusterCentersIndex.sort(NumAscSort);
        console.log("ClusterCentersIndex"+ClusterCentersIndex);
        for (i=0;i<ClusterCentersIndex.length;i++){
            ClusterCenters[i] = particleList[ClusterCentersIndex[i]];
        }

        return ClusterCenters;
    }

    function NumAscSort(a,b)
    {
        return a - b;
    }

    kmedoids.init(numCluster);

    //console.log(lhyDrawPoints);
    var sz = lhyDrawPoints.length;
    for (var i=0; i<sz;i++){
        var tempx = lhyDrawPoints[i].x;
        var tempy = lhyDrawPoints[i].y;
        // console.log("tempx" + tempx);
        // console.log("tempy" + tempy);
        var p = new Particle(tempx, tempy);
        // console.log("P" + p);
        particleList.push(p);
        // console.log("particleList" + particleList);
        // console.log("particleList.length - 1 :" + (particleList.length - 1));

        kmedoids.pushToCluster(particleList.length - 1);

    }

    numCluster=Math.max(Math.min(particleList.length,desiredNumCluster), 1);

    console.log(numCluster);

    kmedoids.init(numCluster);
    kmedoids.partition(particleList);
    ClusterCenters = kMedoidsDraw();
    console.log(ClusterCenters);
    return ClusterCenters;



}
