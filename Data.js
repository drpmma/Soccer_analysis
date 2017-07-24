Data = function (_data) {
    this.formation = _data.formation;
    this.matchInfos = _data.matchInfos;
    this.matrixPass = _data.matrixPass;
    this.players = _data.players;
    this.sequences = _data.sequences;
    _data.sequences.forEach(function(seq){
        seq.actions.forEach(function(action){
            if(action.eid == E_DEF_CLEARANCE) {
                console.log("converting Clearance to Pass");
                action.eid = E_PASS;
                var endX, endY;
                action.qualifiers.forEach(function(qual){
                    if(qual.qid == Q_PASS_END_X) endX = true;
                    if(qual.qid == Q_PASS_END_Y) endY = true;
                });
                if(!endX) {
                    console.log("adding missing qualifier endX");
                    action.qualifiers.push({qid: Q_PASS_END_X, value: action.x});
                }
                if(!endY){
                    console.log("adding missing qualifier endY");
                    action.qualifiers.push({qid: Q_PASS_END_Y, value: action.y});
                }
            }
        });
    });

}

function distance(o1, o2){
    return Math.sqrt((o1.x-o2.x)*((o1.x-o2.x))+(o1.y-o2.y)*((o1.y-o2.y)));
}

var MIN_DIST_LONG_RUN = 20;


function isLongRunAndPass(action, previous_action){
    if(previous_action==undefined || previous_action.eid != E_PASS) return false;

    var run_orig = getPassDestPosition(previous_action),
        run_dest = {x: action.x, y:action.y};

    return run_dest.x > 50 && Math.abs(run_orig.x - run_dest.x) > MIN_DIST_LONG_RUN;
}

var MIN_DIST_SHOW_RUN = 8;

function ignorePassRun(passDest, passOrig){
    return distance(passDest,passOrig) < MIN_DIST_SHOW_RUN;
}

var MIN_DIST_LONG_PASS = 30;

function isLongPass(action,source){
    if(action.eid != E_PASS) return false;
    return distance(getPassDestPosition(action), {x:source.x, y:source.y}) > MIN_DIST_LONG_PASS;
}

function getPassDestPosition(action){
    if(action.eid != E_PASS) throw "action must be a pass !" +JSON.stringify(action);
    var endX, endY;
    for(var q in action.qualifiers){
        switch(action.qualifiers[q].qid){
            case Q_PASS_END_X:
                endX = action.qualifiers[q].value;
                break;
            case Q_PASS_END_Y:
                endY = action.qualifiers[q].value;
                break;
            default:
            //do nothing
        }
    }
    if(endX != undefined && endY != undefined) return {x: parseFloat(endX), y: parseFloat(endY)};
    else throw "Unknown pass destination in "+JSON.stringify(action);
}

function getShotDestination(action){
    if(C_SHOT.indexOf(action.eid)==-1) throw "action must be a shot ! "+JSON.stringify(action);
    var mouthY, mouthZ, blockedX, blockedY;
    for(var q in action.qualifiers){
        switch(action.qualifiers[q].qid){
            case Q_SHOT_GOAL_MOUTH_Y:
                mouthY = action.qualifiers[q].value;
                break;
            case Q_SHOT_GOAL_MOUTH_Z:
                mouthZ = action.qualifiers[q].value;
                break;
            case Q_SHOT_BLOCKED_X:
                blockedX = action.qualifiers[q].value;
                break;
            case Q_SHOT_BLOCKED_Y:
                blockedY = action.qualifiers[q].value;
                break;
            default:
            //do nothing
        }
    }
    if(mouthY != undefined && mouthZ != undefined) return {type: SHOT_DEST_TYPE_MOUTH, y: parseFloat(mouthY), z: parseFloat(mouthZ)};
    else if(blockedX != undefined && blockedY != undefined) return {type: SHOT_DEST_TYPE_BLOCKED, x: parseFloat(blockedX), y: parseFloat(blockedY)};
    else{
        console.log("Unknown shot mouth position in "+JSON.stringify(action));
        return {type: SHOT_DEST_TYPE_BLOCKED, x: parseFloat(action.x), y: parseFloat(action.y)};
    }
}

function getEventName(eid){
    switch(eid){
        case -1: return "E_DUPLICATE";
        case 1000: return "E_LONG_RUN";
        case 1001: return "E_RUN";

        case 34: return "E_FORMATION";

        case 1: return "E_PASS";
        case 2: return "E_PASS_OFFSIDE";

        case 13: return "E_SHOT_MISS";
        case 14: return "E_SHOT_POST";
        case 15: return "E_SHOT_SAVED";
        case 16: return "E_SHOT_GOAL";
        case 60: return "E_SHOT_CHANCE_MISSED";

        case 4: return "E_FOUL";
        case 57: return "E_FOUL_THROW_IN";
        case 17: return "E_FOUL_CARD";

        case 7: return "E_DEF_TACKLE";
        case 8: return "E_DEF_INTERCEPTION";
        case 12: return "E_DEF_CLEARANCE";
        case 55: return "E_DEF_OFFSIDE_PROVOKED";
        case 56: return "E_DEF_SHIELD_BALL";

        case 9: return "E_ERROR_TURNOVER";
        case 45: return "E_ERROR_CHALLENGE";
        case 50: return "E_ERROR_DISPOSSESSED";
        case 51: return "E_ERROR_ERROR";

        case 3: return "E_SPECIAL_TAKE_ON";
        case 42: return "E_SPECIAL_GOOD_SKILL";

        case 44: return "E_AERIAL_DUEL";

        case 11: return "E_GK_CLAIM";
        case 52: return "E_GK_PICK_UP";
        case 10: return "E_GK_SAVE";
        case 41: return "E_GK_PUNCH";
        case 59: return "E_GK_SWEEPER";
        case 54: return "E_GK_SMOTHER";

        case 18: return "E_FORMATION_PLAYER_OFF";
        case 19: return "E_FORMATION_PLAYER_ON";

        case 30: return "E_PERIOD_START";
        case 32: return "E_PERIOD_END";

        case 5: return "E_BALL_OUT";
        case 6: return "E_CORNER";

        default: throw "Unknown eid: "+eid;
    }
}

function getEventColor(eid){
    switch(eid){
        case E_PASS:
        case E_RUN:
            return "black";
        case E_SHOT_MISS:
            return "red";
        case E_SHOT_POST:
            return "pink";
        case E_SHOT_SAVED:
            return "blue";
        case E_SHOT_GOAL:
            return "green";
        case E_SHOT_CHANCE_MISSED:
            return "orange";
        case E_CORNER:
            return "pink";
        case E_SPECIAL_TAKE_ON:
        case E_SPECIAL_GOOD_SKILL:
            return "orange";
        case E_DEF_TACKLE:
            return "purple";
        case E_DEF_INTERCEPTION:
            return "orange";
        case E_DUPLICATE:
            return "gray";
        case E_LONG_RUN:
            return "gray";
        case E_AERIAL_DUEL:
            return "steelblue";
        case E_FOUL:
            return "brown";
        default:
            throw "unknown eid "+eid;
    }
}

var line = d3.line()
    .x(function (d) {return d.x})
    .y(function (d) {return d.y})
    .curve(d3.curveBasis);

function getArc(sx,sy,tx,ty,r){
    var pivot1 = {
        x: sx + (tx - sx) / 4 + (ty - sy) / r,
        y: sy + (ty - sy) / 4 + (sx - tx) / r
    };
    var pivot2 = {
        x: sx + 3*(tx - sx) / 4 + (ty - sy) / r,
        y: sy + 3*(ty - sy) / 4 + (sx - tx) / r
    };

    return [
        {x:sx, y:sy}, {x:pivot1.x, y:pivot1.y},
        {x:pivot2.x, y:pivot2.y},
        {x:tx, y:ty}];
}


var PID_SHOT_DEST = -1;
/*
 Constants for shots
 */
var SHOT_DEST_TYPE_MOUTH = 0;
var SHOT_DEST_TYPE_BLOCKED = 1;

//----------------------------------Events Constants---------------------------------//
var E_DUPLICATE = -1;

var E_FORMATION = 34;
var E_LONG_RUN = 1000;
var E_RUN = 1001;

var E_PASS = 1;
var E_PASS_OFFSIDE = 2;

var E_SHOT_MISS = 13;
var E_SHOT_POST = 14;
var E_SHOT_SAVED = 15;
var E_SHOT_GOAL = 16;
var E_SHOT_CHANCE_MISSED = 60;

var E_FOUL = 4;
var E_FOUL_THROW_IN = 57;
var E_FOUL_CARD = 17;

var E_DEF_TACKLE = 7;
var E_DEF_INTERCEPTION = 8;
var E_DEF_CLEARANCE = 12;
var E_DEF_OFFSIDE_PROVOKED = 55;
var E_DEF_SHIELD_BALL = 56;

var E_ERROR_TURNOVER = 9;
var E_ERROR_CHALLENGE = 45;
var E_ERROR_DISPOSSESSED = 50;
var E_ERROR_ERROR = 51;

var E_SPECIAL_TAKE_ON = 3;
var E_SPECIAL_GOOD_SKILL = 42;

var E_AERIAL_DUEL = 44;




var E_GK_CLAIM = 11;
var E_GK_PICK_UP = 52;
var E_GK_SAVE = 10;
var E_GK_PUNCH = 41;
var E_GK_SWEEPER = 59;
var E_GK_SMOTHER = 54;

var E_FORMATION_PLAYER_OFF = 18;
var E_FORMATION_PLAYER_ON = 19;

var E_PERIOD_START = 30;
var E_PERIOD_END = 32;

var E_BALL_OUT = 5;
var E_CORNER = 6;


//--------------------------------------Qualifiers Constants----------------------------//

//------Pass Qualifiers-------------//
var Q_PASS_LONG = 1;
var Q_PASS_CROSS = 2;
var Q_PASS_HEAD = 3;
var Q_PASS_THROUGH = 4;
var Q_PASS_FREE_KICK = 5;
var Q_PASS_CORNER = 6;
var Q_PASS_ID_OFFSIDE_PLAYER = 7;
var Q_PASS_GOAL_DISALLOWED = 8;
var Q_PASS_ATTACKING = 106;
var Q_PASS_THROW_IN = 107;
var Q_PASS_END_X = 140;
var Q_PASS_END_Y = 141;
var Q_PASS_CHIPPED = 155;
var Q_PASS_LAY_OFF = 156;
var Q_PASS_LAUNCH = 157;
var Q_PASS_FLICK_ON = 168;
var Q_PASS_PULL_BACK= 195;
var Q_PASS_SWITCH_OF_PLAY = 196;
var Q_PASS_ASSIST = 210;


//------Shot Qualifiers---------------//
var Q_SHOT_PENALTY = 9;
var Q_SHOT_HEAD = 15;
var Q_SHOT_SMALL_BOX_CENTRE = 16;
var Q_SHOT_BOX_CENTRE = 17;
var Q_SHOT_OUT_OF_BOX_CENTRE = 18;
var Q_SHOT_35_MORE_CENTRE = 19;
var Q_SHOT_RIGHT_FOOTED = 20;
var Q_SHOT_OTHER_BODY_PART = 21;
var Q_SHOT_REGULAR_PLAY = 22;
var Q_SHOT_FAST_BREAK = 23;
var Q_SHOT_SET_PIECE = 24;
var Q_SHOT_FROM_CORNER = 25;
var Q_SHOT_FREE_KICK = 26;
var Q_SHOT_OWN_GOAL = 28;
var Q_SHOT_ASSISTED = 29;
var Q_SHOT_RELATED_EVENT_ID = 55;
var Q_SHOT_SMALL_BOX_RIGHT = 60;
var Q_SHOT_SMALL_BOX_LEFT = 61;
var Q_SHOT_BOX_DEEP_RIGHT = 62;
var Q_SHOT_BOX_RIGHT = 63;
var Q_SHOT_BOX_LEFT = 64;
var Q_SHOT_BOX_DEEP_LEFT = 65;
var Q_SHOT_OUT_OF_BOX_DEEP_RIGHT = 66;
var Q_SHOT_OUT_OF_BOX_RIGHT = 67;
var Q_SHOT_OUT_OF_BOX_LEFT = 68;
var Q_SHOT_OUT_OF_BOX_DEEP_LEFT = 69;
var Q_SHOT_35_MORE_RIGHT = 70;
var Q_SHOT_35_MORE_LEFT = 71;
var Q_SHOT_LEFT_FOOTED = 72;
var Q_SHOT_LEFT = 73;
var Q_SHOT_HIGH = 74;
var Q_SHOT_RIGHT = 75;
var Q_SHOT_LOW_LEFT = 76;
var Q_SHOT_HIGH_LEFT = 77;
var Q_SHOT_LOW_CENTRE = 78;
var Q_SHOT_HIGH_CENTRE = 79;
var Q_SHOT_LOW_RIGHT = 80;
var Q_SHOT_HIGH_RIGHT = 81;
var Q_SHOT_BLOCKED = 82;
var Q_SHOT_CLOSE_LEFT = 83;
var Q_SHOT_CLOSE_RIGHT = 84;
var Q_SHOT_CLOSE_HIGH = 85;
var Q_SHOT_CLOSE_LEFT_AND_HIGH = 86;
var Q_SHOT_CLOSE_RIGHT_AND_HIGH = 87;
var Q_SHOT_CORNER_SITUATION = 96;
var Q_SHOT_DIRECT_FREE = 97;
var Q_SHOT_SIX_YARD_BLOCKED = 100;
var Q_SHOT_SAVED_OFF_LINE = 101;
var Q_SHOT_GOAL_MOUTH_Y = 102;
var Q_SHOT_GOAL_MOUTH_Z = 103;
var Q_SHOT_VOLLEY = 108;
var Q_SHOT_OVERHEAD = 109;
var Q_SHOT_HALF_VOLLEY = 110;
var Q_SHOT_DIVING_HEADER = 111;
var Q_SHOT_SCRAMBLE = 112;
var Q_SHOT_STRONG = 113;
var Q_SHOT_WEAK = 114;
var Q_SHOT_RISING = 115;
var Q_SHOT_DIPPING = 116;
var Q_SHOT_LOB = 117;
var Q_SHOT_ONE_BOUNCE = 118;
var Q_SHOT_FEW_BOUNCES = 119;
var Q_SHOT_SWERVE_LEFT = 120;
var Q_SHOT_SWERVE_RIGHT = 121;
var Q_SHOT_SWERVE_MOVING = 122;
var Q_SHOT_DEFLECTION = 133;
var Q_SHOT_FAR_WIDE_LEFT = 134;
var Q_SHOT_FAR_WIDE_RIGHT = 135;
var Q_SHOT_KEEPER_TOUCHED = 136;
var Q_SHOT_KEEPER_SAVED = 137;
var Q_SHOT_HIT_WOODWORK = 138;
var Q_SHOT_BLOCKED_X = 146;
var Q_SHOT_BLOCKED_Y = 147;
var Q_SHOT_NOT_PAST_GOAL_LINE = 153;
var Q_SHOT_INTENTIONAL_ASSIST = 154;
var Q_SHOT_THROW_IN_SET_PIECE = 160;
var Q_SHOT_BIG_CHANCE = 214;
var Q_SHOT_INDIVIDUAL_PLAY = 215;


//------Defence Qualifiers---------------//
var Q_DEF_LAST_LINE = 14;
var Q_DEF_BLOCK = 94;
var Q_DEF_OUT_OF_PLAY = 167;
var Q_DEF_LEADING_TO_ATTEMPT = 169;
var Q_DEF_LEADING_TO_GOAL = 170;
var Q_DEF_BLOCKED_CROSS = 185;


//------General Qualifiers---------------//
var Q_GENERAL_END_CAUSE = 54;
var Q_GENERAL_ZONE = 56;
var Q_GENERAL_END_TYPE = 57;
var Q_GENERAL_DIRECTION_OF_PLAY = 127;
var Q_GENERAL_DELETED_EVENT_TYPE = 144;
var Q_GENERAL_PLAYER_NOT_VISIBLE = 189;
var Q_GENERAL_FROM_SHOT_OFF_TARGET = 190;
var Q_GENERAL_GAME_END = 209;
var Q_GENERAL_OVERRUN = 211;
var Q_GENERAL_LENGTH = 212;
var Q_GENERAL_ANGLE = 213;


//------Goalkeeper Qualifiers---------------//
var Q_GK_HIGH_CLAIM = 88;
var Q_GK_1_1 = 89;
var Q_GK_DEFLECTED_SAVE = 90;
var Q_GK_DIVE_AND_DEFLECT = 91;
var Q_GK_CATCH = 92;
var Q_GK_DIVE_AND_CATCH = 93;
var Q_GK_KEEPER_THROW = 123;
var Q_GK_GOAL_KICK = 124;
var Q_GK_PUNCH = 128;
var Q_GK_OWN_PLAYER = 139;
var Q_GK_PARRIED_SAFE = 173;
var Q_GK_PARRIED_DANGER = 174;
var Q_GK_FINGERTIP = 175;
var Q_GK_CAUGHT = 176;
var Q_GK_COLLECTED = 177;
var Q_GK_STANDING = 178;
var Q_GK_DIVING = 179;
var Q_GK_STOOPING = 180;
var Q_GK_REACHING = 181;
var Q_GK_HANDS = 182;
var Q_GK_FEET = 183;
var Q_GK_SCORED = 186;
var Q_GK_SAVED = 187;
var Q_GK_MISSED = 188;
var Q_GK_HOOF = 198;
var Q_GK_KICK_FROM_HANDS = 199;


//------Foul Qualifiers---------------//
var Q_FOUL_HAND = 10;
var Q_FOUL_DANGEROUS = 12;
var Q_FOUL_ALL = 13;
var Q_FOUL_6_SEC = 11;
var Q_FOUL_YELLOW_CARD = 31;
var Q_FOUL_YELLOW_CARD_SECOND = 32;
var Q_FOUL_RED_CARD = 33;
var Q_FOUL_REFEREE_ABUSE = 34;
var Q_FOUL_ARGUMENT = 35;
var Q_FOUL_FIGHT = 36;
var Q_FOUL_TIME_WASTING = 37;
var Q_FOUL_EXCESSIVE_CELEBRATION = 38;
var Q_FOUL_CROWD_INTERACTION = 39;
var Q_FOUL_OTHER_REASON = 40;
var Q_FOUL_BACK_PASS = 95;
var Q_FOUL_DIVE = 132;
var Q_FOUL_PERSISTENT_INFRINGEMENT = 158;
var Q_FOUL_ABUSIVE_LANGUAGE = 159;
var Q_FOUL_ENCROACHMENT = 161;
var Q_FOUL_LEAVING_FIELD = 162;
var Q_FOUL_ENTERING_FIELD = 163;
var Q_FOUL_SPITTING = 164;
var Q_FOUL_PROFESSIONAL_FOUL = 165;
var Q_FOUL_HANDLING_ON_THE_LINE = 166;
var Q_FOUL_RESCINDED_CARD = 171;
var Q_FOUL_NO_IMPACT_ON_TIMING = 172;
var Q_FOUL_DISSENT = 184;
var Q_FOUL_OFF_THE_BALL = 191;
var Q_FOUL_BLOCK_BY_HAND = 192;


//------Line up / subs / formation qualifiers-----------//
var Q_FORMATION_INVOLVED = 30;
var Q_FORMATION_INJURY = 41;
var Q_FORMATION_TACTICAL = 42;
var Q_FORMATION_PLAYER_POSITION = 44;
var Q_FORMATION_JERSEY_NUMBER = 59;
var Q_FORMATION_TEAM_FORMATION = 130;
var Q_FORMATION_TEAM_PLAYER_FORMATION = 131;
var Q_FORMATION_FORMATION_SLOT = 145;
var Q_FORMATION_CAPTAIN = 194;
var Q_FORMATION_TEAM_KIT = 197;


//------Referee qualifiers-----------//
var Q_REFEREE_POSITION = 50;
var Q_REFEREE_ID = 51;
var Q_REFEREE_STOP = 200;
var Q_REFEREE_DELAY = 201;
var Q_REFEREE_INJURY = 208;


//------Attendance qualifiers-----------//
var Q_ATTENDANCE_FIGURE = 49;


//------Stoppages qualifiers-----------//
var Q_STOPPAGE_INJURED_PLAYER_ID = 53;
var Q_STOPPAGE_WEATHER_PROBLEM = 202;
var Q_STOPPAGE_CROWD_TROUBLE = 203;
var Q_STOPPAGE_FIRE = 204;
var Q_STOPPAGE_OBJECT_THROWN_ON_PITCH = 205;
var Q_STOPPAGE_SPECTATOR_ON_PITCH = 206;
var Q_STOPPAGE_AWAITHIN_OFFICIAL_DECISION = 207;
var Q_STOPPAGE_REFEREE_INJURY = 208;


//------Conditions qualifiers-----------//
var Q_CONDITIONS_TEMPERATURE = 45;
var Q_CONDITIONS_CONDITIONS = 46;
var Q_CONDITIONS_FIELD_PITCH = 47;
var Q_CONDITIONS_LIGHTINGS = 48;

var C_PASS = [E_PASS, E_PASS_OFFSIDE];
var C_SHOT = [E_SHOT_MISS, E_SHOT_POST, E_SHOT_SAVED, E_SHOT_GOAL, E_SHOT_CHANCE_MISSED];
var C_FOUL = [E_FOUL, E_FOUL_THROW_IN,E_FOUL_CARD];
var C_DEF = [E_DEF_TACKLE, E_DEF_INTERCEPTION, E_DEF_CLEARANCE];
var C_ERROR = [E_ERROR_TURNOVER, E_ERROR_CHALLENGE, E_ERROR_DISPOSSESSED, E_ERROR_ERROR];
var C_SPECIAL = [E_SPECIAL_TAKE_ON, E_SPECIAL_GOOD_SKILL];
var C_AERIAL = [E_AERIAL_DUEL];