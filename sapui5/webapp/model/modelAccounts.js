
sap.ui.define([
    "sap/ui/model/json/JSONModel"
],
/**
 * 
 * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
 */
    function (JSONModel) {
        "use strict";
        return {
            createAccountsModel: function() {
                var accModel = new JSONModel();
                accModel.loadData("egb.sapui5.localService.mockdata.accounts.json", false);
                return accModel;
            }
        }
    })