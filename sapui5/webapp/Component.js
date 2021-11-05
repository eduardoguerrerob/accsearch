sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
    "egb/sapui5/model/models",
    "egb/sapui5/model/modelAccounts"
], function (UIComponent, Device, models, modelAccounts) {
	"use strict";

	return UIComponent.extend("egb.sapui5.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
            this.setModel(models.createDeviceModel(), "device");
            
            // set account model
            this.setModel(modelAccounts.createAccountsModel(), "accModel");
		}
	});
});
