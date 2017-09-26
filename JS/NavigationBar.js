navigationBar = function() {
    $(function ()
    { $("#identifier").modal({keyboard: true});
    });
};
navigationBar.prototype.setTitle = function(team0, team1, score0, score1, year, month, day) {
    $('#nav_team0')[0].innerHTML = team0;
    $('#nav_score0')[0].innerHTML = score0;
    $('#nav_vs')[0].innerHTML = "VS";
    $('#nav_score1')[0].innerHTML = score1;
    $('#nav_team1')[0].innerHTML = team1;
    $('#navigationDate')[0].innerHTML =
        '<a id="navigation_date_txt" class="navbar-brand" href="#">' +
        year+'-'+month+'-'+day+
        '</a>' +
        '<a id="navigation_date_img" class="navbar-brand" href="#">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        '</a>';
    $('#vir_nav_team0')[0].innerHTML = team0;
    $('#vir_nav_score0')[0].innerHTML = score0;
    $('#vir_nav_vs')[0].innerHTML = "VS";
    $('#vir_nav_score1')[0].innerHTML = score1;
    $('#vir_nav_team1')[0].innerHTML = team1;
    $('#vir_navigationDate')[0].innerHTML =
        '<a id="vir_navigation_date_txt" class="navbar-brand" href="#">' +
        year+'-'+month+'-'+day+
        '</a>' +
        '<a id="vir_navigation_date_img" class="navbar-brand" href="#">' +
        '<span class="glyphicon glyphicon-time"></span>' +
        '</a>';
};
