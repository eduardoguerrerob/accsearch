// @ts-nocheck
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

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();
        const fieldsModel = new JSONModel();

        function onInit() {
            paramModel.loadData("./localService/mockdata/params.json", false);
            this.getView().setModel(paramModel, "paramModel");

            chartsModel.loadData("./localService/mockdata/chartOfAccounts.json", false);
            this.getView().setModel(chartsModel, "chartsModel");

            groupsModel.loadData("./localService/mockdata/accountGroups.json", false);
            this.getView().setModel(groupsModel, "groupsModel");

            currModel.loadData("./localService/mockdata/currency.json", false);
            this.getView().setModel(currModel, "currModel");

            fieldsModel.loadData("./localService/mockdata/fields.json");
            this.getView().setModel(fieldsModel, "fieldsModel");
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

        function onValidateStep1(oEvent) {
            const name = this.getView().byId("employeeName").getValue();
            const description = this.getView().byId("description").getValue();
            if (name !== '' && name !== undefined && description !== '' && description !== undefined) {
                paramModel.setProperty("/employeeName", name);
                paramModel.setProperty("/description", description);
                this._oFirstStep.setValidated(true);
                this._wizard.goToStep(this._oSecondStep);
            }
            else {
                paramModel.setProperty("/employeeName", "");
                paramModel.setProperty("/description", "");
                this._oFirstStep.setValidated(false);
            }
        }

        function onValidateChart(oEvent) {
            const chart = chartsModel.getProperty("/selectedChart");
            paramModel.setProperty("/chart", chart);
            _validateStep2Complete(this);
        }

        function handleSelectionChange(oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            if (!isSelected) {
            }
        }

        function handleSelectionFinish(oEvent) {
            let groups = [];
            groupsModel.setProperty("selectedGroups", []);
            var selectedItems = oEvent.getParameter("selectedItems");
            for (var i in selectedItems) {
                groups.push(selectedItems[i].getKey());
            }
            groupsModel.setProperty("/selectedGroups", groups);
            paramModel.setProperty("/groups", groups);
            _validateStep2Complete(this);
        }

        function onValidateCurrency(oEvent) {
            const currency = currModel.getProperty("/selectedCurrency");
            paramModel.setProperty("/currency", currency);
            _validateStep2Complete(this);
        }

        function onValidateDate(oEvent) {
            const oDP = oEvent.getSource()
            const sValue = oEvent.getParameter("value");
            const bValid = oEvent.getParameter("valid");
            if (bValid) {
                paramModel.setProperty("/date", sValue);
            }
            else {
                paramModel.setProperty("/date", "");
            }
            _validateStep2Complete(this);
        }

        function _validateStep2Complete(that) {

            // that._wizard = that.byId("wizard");
            // this._oFirstStep = this._wizard.getSteps()[0];
            // this._oSecondStep = this._wizard.getSteps()[1];
            // this._oThirdStep = this._wizard.getSteps()[2];


            const selectedChart = chartsModel.getProperty("/selectedChart");
            const selectedGroups = groupsModel.getProperty("/selectedGroups");
            const selectedCurrency = currModel.getProperty("/selectedCurrency");
            const params = paramModel.getData();

            if (params.employeeName !== undefined && params.employeeName !== "" &&
                params.description !== undefined && params.description !== "" &&
                params.date !== undefined && params.date !== "" &&
                params.chart !== undefined && params.chart !== "" &&
                params.groups !== undefined && params.groups.length > 0 &&
                params.currency !== undefined && params.currency !== "") {
                that._oSecondStep.setValidated(true);
                that._wizard.goToStep(that._oThirdStep);
            }
            else {
                that._oSecondStep.setValidated(false);
            }
        }

        function aaa(oEvent) {
            const fields = fieldsModel.getProperty("/fields");
            let selectedFields = [];
            const indices = this.getView().byId("fieldsTable").getSelectedIndices();
            fieldsModel.setProperty("/selectedFields", []);
            if (indices) {
                for (let i in indices) {
                    selectedFields.push(fields[i].id);
                }
                fieldsModel.setProperty("/selectedFields", selectedFields);
            }

            const test = fieldsModel.getProperty("/selectedFields");
        }

        let Main = Controller.extend("egb.sapui5.controller.Main", {});
        Main.prototype.onInit = onInit;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onValidateStep1 = onValidateStep1;
        Main.prototype.handleSelectionChange = handleSelectionChange;
        Main.prototype.handleSelectionFinish = handleSelectionFinish;
        Main.prototype.onValidateChart = onValidateChart;
        Main.prototype.onValidateCurrency = onValidateCurrency;
        Main.prototype.onValidateDate = onValidateDate;
        Main.prototype.aaa = aaa;

        return Main;
    });
