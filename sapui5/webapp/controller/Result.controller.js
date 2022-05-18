// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.ui.core.routing.History} History
 * @param {typeof sap.ui.core.UIComponent} UIComponent
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
 */
function (Controller, History, UIComponent, JSONModel) {
    "use strict";

    var resultModel = new JSONModel();

    return Controller.extend("egb.sapui5.controller.Result", {
        onInit: function () {
            // resultModel.loadData("./localService/mockdata/accountsResult.json", false);
            // this.getView().setModel(resultModel, "resultModel");

            this.getView().setModel(this.getOwnerComponent().getModel('northwind'));
            this.getView().byId("table0").rebindTable();
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