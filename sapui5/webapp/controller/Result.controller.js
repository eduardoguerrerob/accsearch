// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.ui.core.routing.History} History
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 */
function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("egb.sapui5.controller.Result", {
        onInit: function () {

        },

        onNavBack: function() {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            if(sPreviousHash !== undefined){
                window.history.go(-1);
            }
            else{
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", {}, true);
            }
        }
    });
});