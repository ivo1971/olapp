"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var component_base_class_1 = require("./component-base.class");
var TeamfieBaseComponent = (function (_super) {
    __extends(TeamfieBaseComponent, _super);
    /* Construction
     */
    function TeamfieBaseComponent(teamfieService, teamsUsersService, _websocketUserService) {
        var _this = 
        //call base class
        _super.call(this, _websocketUserService) || this;
        _this.teamfieService = teamfieService;
        _this.teamsUsersService = teamsUsersService;
        _this._websocketUserService = _websocketUserService;
        /* Protected variables intended for the template
         * (hence at the top)
         */
        _this.teamInfos = new Array();
        _this.teamfies = new Array();
        //subscribe
        _this.observableTeamInfo = _this.teamsUsersService.getObservableTeamsInfo();
        _this.subscriptionTeamInfo = _this.observableTeamInfo.subscribe(function (teamInfos) {
            _this.teamInfos = teamInfos;
            _this.merge();
        });
        _this.observableTeamfie = _this.teamfieService.getObservableTeamfie();
        _this.subscriptionTeamfie = _this.observableTeamfie.subscribe(function (teamfies) {
            _this.teamfies = teamfies;
            _this.merge();
        });
        return _this;
    }
    TeamfieBaseComponent.prototype.destructor = function () {
        this.subscriptionTeamfie.unsubscribe();
        this.subscriptionTeamInfo.unsubscribe();
    };
    /* Help functions
     */
    TeamfieBaseComponent.prototype.merge = function () {
        for (var u = 0; u < this.teamInfos.length; ++u) {
            var found = false;
            for (var v = 0; v < this.teamfies.length; ++v) {
                if (this.teamInfos[u].id != this.teamfies[v].teamId) {
                    continue;
                }
                this.teamInfos[u].image = this.teamfies[v].image;
                found = true;
                break;
            }
            if (!found) {
                this.teamInfos[u].image = "";
            }
        }
    };
    return TeamfieBaseComponent;
}(component_base_class_1.ComponentBase));
exports.TeamfieBaseComponent = TeamfieBaseComponent;
//# sourceMappingURL=Teamfie-base.class.js.map