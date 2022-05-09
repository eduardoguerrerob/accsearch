// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.core.Fragment} Fragment
     * @param {typeof sap.m.MessageBox} MessageBox
     */
    function (Controller, JSONModel, Fragment, MessageBox) {
        "use strict";

        const paramModel = new JSONModel();
        const chartsModel = new JSONModel();
        const groupsModel = new JSONModel();
        const currModel = new JSONModel();
        const fieldsModel = new JSONModel();

        function onInit() {
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

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
                const grpStr = '{"id":"'+ selectedItems[i].getKey() +'","description":"'+selectedItems[i].getText()+'"}'
                groups.push(JSON.parse(grpStr));
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

        function onValidateStep3(oEvent) {
            const fields = fieldsModel.getProperty("/fields");
            let selectedFields = [];
            const indices = this.getView().byId("fieldsTable").getSelectedIndices();
            fieldsModel.setProperty("/selectedFields", []);
            if (indices) {
                for (let i in indices) {
                    selectedFields.push(fields[i].id);
                }
                fieldsModel.setProperty("/selectedFields", selectedFields);
                this._oThirdStep.setValidated(true);  
            }
            else {
                this._oThirdStep.setValidated(false); 
            }

            const test = fieldsModel.getProperty("/selectedFields");
        }

        function showDescriptionDialog(){
            const oView = this.getView();
            if(!this.byId("descriptionDialog")){
                Fragment.load({
                    id: oView.getId(),
                    name: "egb.sapui5.fragment.descriptionDialog",
                    controller: this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            }
            else{
                this.byId("descriptionDialog").open();
            }
        }

        function onOkDescriptionDialog(){
            this.byId("descriptionDialog").close();
        }

        function wizardCompletedHandler() {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        }

        function step3Complete(){

        }

        function handleWizardSubmit(oEvent){
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteResult");
        }

        function handleWizardCancel(oEvent){
            MessageBox["warning"]("Confirma cancelación",{
                 actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                 onClose: function(oAction){
                     if(oAction === MessageBox.Action.YES){
                        this._wizard.goToStep(this._oFirstStep);
                        this._wizard.discardProgress(this._oFirstStep);
                        this._oNavContainer.backToPage(this._oWizardContentPage.getId());
                     }
                 }.bind(this)
            })
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
        Main.prototype.onValidateStep3 = onValidateStep3;
        Main.prototype.showDescriptionDialog = showDescriptionDialog;
        Main.prototype.onOkDescriptionDialog = onOkDescriptionDialog;
        Main.prototype.wizardCompletedHandler = wizardCompletedHandler;
        Main.prototype.step3Complete = step3Complete;
        Main.prototype.handleWizardSubmit = handleWizardSubmit;
        Main.prototype.handleWizardCancel = handleWizardCancel;

        return Main;
    });
