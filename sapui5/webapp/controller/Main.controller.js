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

        function onVerif(oEvent) {
            const datos1 = this.getView().getModel("paramModel");
            const datos2 = datos1.getData();
        }

        let Main = Controller.extend("egb.sapui5.controller.Main", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onValidateNameDescription = onValidateNameDescription;
        Main.prototype.onVerif = onVerif;

        return Main;
    });
