document.getElementById("tips_color").innerHTML =
    "<div style='position:relative;top:5px;width:15px;height:10px;background:red;stroke:none;border-radius:3px;float:left'></div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　射偏</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;background:pink;stroke:none;border-radius:3px;float:left'></div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　射中门框</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;background:blue;stroke:none;border-radius:3px;float:left'></div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　射门被扑</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;background:green;stroke:none;border-radius:3px;float:left'></div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　射门成功</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;background:orange;stroke:none;border-radius:3px;float:left'></div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　错失机会</p>";

document.getElementById("tips_line").innerHTML =
    "<div style='position:relative;top:5px;width:15px;height:10px;stroke:none;border-radius:3px;float:left'>" +
    "   <svg>" +
    "       <path stroke-width='2px' stroke='black' d='M0 5L15 5' stroke-dasharray='3,3'></path>" +
    "   </svg>"+
    "</div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　短传球</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;stroke:none;border-radius:3px;float:left'>" +
    "   <svg>" +
    "       <path stroke-width='2px' stroke='black' d='M0 8 Q 7.5 0 15 8' stroke-dasharray='3,3' fill='none'></path>" +
    "   </svg>"+
    "</div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　长传球</p>" +
    "<div style='position:relative;top:5px;width:15px;height:10px;stroke:none;border-radius:3px;float:left'>" +
    "   <svg>" +
    "       <path stroke-width='1px' stroke='black' d='M0 5L15 5'></path>" +
    "   </svg>"+
    "</div>" +
    "<p style='margin-top:3px;margin-bottom:0'>　带球</p>" +
    "<div style='position:relative;top:5px;width:15px;height:26px;stroke:none;border-radius:3px;float:left'>" +
    "   <svg>" +
    "       <path stroke-width='1px' stroke='red' d='M0 5L15 5'></path>" +
    "       <path stroke-width='1px' stroke='pink' d='M0 9L15 9'></path>" +
    "       <path stroke-width='1px' stroke='blue' d='M0 13L15 13'></path>" +
    "       <path stroke-width='1px' stroke='green' d='M0 17L15 17'></path>" +
    "       <path stroke-width='1px' stroke='orange' d='M0 21L15 21'></path>" +
    "   </svg>"+
    "</div>" +
    "<p style='margin-top:10px;margin-bottom:0'>　射门</p>";