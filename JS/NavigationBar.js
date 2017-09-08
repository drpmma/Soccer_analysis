navigationBar = function() {
    $(function () {
        $('#navigationHead').click(function(){
            let stgbar = $('#settingBar');
            let mnwid = $('#svg_div');
            if(sideSetting.soh === 1) {
                stgbar.animate({left:'-25%'});
                mnwid.animate({left:'0'});
                sideSetting.soh = 0;
            } else {
                mnwid.animate({left: '25%'});
                stgbar.animate({left:'0'});
                sideSetting.soh = 1;
            }
        })
    });

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
    $('#navigationDate')[0].innerHTML = '比赛时间： '+year+'-'+month+'-'+day;
    $('#vir_nav_team0')[0].innerHTML = team0;
    $('#vir_nav_score0')[0].innerHTML = score0;
    $('#vir_nav_vs')[0].innerHTML = "VS";
    $('#vir_nav_score1')[0].innerHTML = score1;
    $('#vir_nav_team1')[0].innerHTML = team1;
    $('#vir_navigationDate')[0].innerHTML = '比赛时间： '+year+'-'+month+'-'+day;
};
