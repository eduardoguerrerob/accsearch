sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        function onInit() {
            const paramModel = new JSONModel();
            paramModel.loadData("./localService/mockdata/params.json", false);
            this.getView().setModel(paramModel, "paramModel");

            const chartsModel = new JSONModel();
            chartsModel.loadData("./localService/mockdata/chartOfAccounts.json", false);
            this.getView().setModel(chartsModel, "chartsModel");

            const groupsModel = new JSONModel();
            groupsModel.loadData("./localService/mockdata/accountGroups.json", false);
            this.getView().setModel(groupsModel, "groupsModel");

            const currModel = new JSONModel();
            currModel.loadData("./localService/mockdata/currency.json", false);
            this.getView().setModel(currModel, "currModel");
        }

        function onBeforeRendering() {
            this._wizard = this.getView().byId("wizard");
            this._oFirstStep = this._wizard.getSteps()[0];
            this._oSecondStep = this._wizard.getSteps()[1];
            this._oThirdStep = this._wizard.getSteps()[2];
            this._oFourthStep = this._wizard.getSteps()[3];
            this._wizard.discardProgress(this._oFirstStep);
            this._wizard.goToStep(this._oFirstStep);
            this._oFirstStep.setValidated(false);
        }

        function onValidateNameDescription(oEvent) {
            const name = this.getView().byId("employeeName").getValue();
            const description = this.getView().byId("description").getValue();
            if (name !== '' && name !== undefined && description !== '' && description !== undefined) {
                this._oFirstStep.setValidated(true);
                this._wizard.goToStep(this._oSecondStep);
            }
            else {
                this._oFirstStep.setValidated(false);
            }
        }

        function handleSelectionChange(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			if (!isSelected) {
			
            }
        }
        
        function handleSelectionFinish(oEvent) {
            const oModel = this.getView().getModel("groupsModel");
            const paramModel = this.getView().getModel("paramModel");
            let groups = [];
            oModel.setProperty("selectedGroups", []);
			var selectedItems = oEvent.getParameter("selectedItems");
			for (var i in selectedItems) {
					groups.push(selectedItems[i].getKey());
            }
            
            oModel.setProperty("/selectedGroups", groups);
            paramModel.setProperty("/groups", groups)
            oModel.refresh();

            const selectedGroups = oModel.getData().selectedGroups;
            const groupsTest = paramModel.getData().groups;
        }
        
        function _validateStep2Complete(){
            
        }

        let Main = Controller.extend("egb.sapui5.controller.Main", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onValidateNameDescription = onValidateNameDescription;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionFinish =handleSelectionFinish;

        return Main;
    });
