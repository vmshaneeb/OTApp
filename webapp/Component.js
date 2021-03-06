var i18nModel;

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"OTApp/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("OTApp.Component", {

		metadata: {
			// manifest: "json"
			"version": "1.0.0",
			"rootView": {
				viewName: "OTApp.view.DispChng",
				type: sap.ui.core.mvc.ViewType.XML
			},
			"dependencies": {
				"libs": ["sap.ui.core", "sap.m", "sap.ui.layout"]
			},
			"includes": ["CSS/style.css"],
			"config": {
				resourceBundle: "i18n/i18n.properties",
				"i18nBundle": "OTApp.i18n.i18n",
				"favicon": "icon/logo.ico",
				"phone": "icon/logo_57px.png",
				"phone@2": "icon/logo_114px.png",
				"tablet": "icon/logo_72px.png",
				"tablet@2": "icon/logo_144px.png"
					// "icon": "",
					// "favIcon": "/sap/public/bc/ui2/logon/img/favicon.ico"
					// "https://mail.qag.gov.qa/owa/14.3.319.2/themes/resources/favicon.ico"
					// "phone": "",
					// "phone@2": "",
					// "tablet": "",
					// "tablet@2": ""
			},
			"routing": {
				"config": {
					"routerClass": "sap.m.routing.Router",
					"viewType": "XML",
					"viewPath": "OTApp.view",
					"controlId": "dispchng",
					"controlAggregation": "pages",
					"transition": "slide" //show, flip, fade
				},
				"routes": [{
					"pattern": "display",
					"name": "display",
					"target": "display"
				}, {
					"pattern": "create",
					"name": "create",
					"target": "create"
				}, {
					"pattern": "change",
					"name": "change",
					"target": "change"
				},
				 {
					"pattern": "dispChng",
					"name": "DispChng",
					"target": "DispChng"
				}],
				"targets": {
					"display": {
						"viewName": "DisplayOT",
						"viewLevel": 0
					},
					"create": {
						"viewName": "CreateOT",
						"viewLevel": 1
					},
					"change": {
						"viewName": "ChangeOT",
						"viewLevel": 2
					},
					"dispchng": {
						"viewName": "DispChng",
						"viewLevel": 3
					}
				}
			},
			"dataSources": {
				"ZHCM_OTAPP_SRV": {
					"uri": "/sap/opu/odata/sap/ZHCM_OTAPP_SRV/",
					"type": "OData",
					"settings": {
						"odataVersion": "1.0",
						"localUri": "localService/metadata.xml"
							// "disableHeadRequestForToken": true
					}
				}
			},
			"models": {
				"i18n": {
					"type": "sap.ui.model.resource.ResourceModel",
					"settings": {
						"bundleName": "OTApp.i18n.i18n"
					},
					"uri": "i18n/i18n.properties"
						// "async": true
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the resource and application models are set.
		 * @public
		 * @override
		 */
		init: function() {
			var mConfig = this.getMetadata().getConfig();

			// set the i18n model
			this.setModel(models.createResourceModel(mConfig.i18nBundle), "i18n");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

			var rootPath = jQuery.sap.getModulePath("OTApp");

			// set i18n model
			i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: [rootPath, mConfig.resourceBundle].join("/")
			});
			this.setModel(i18nModel, "i18n");
			// sap.ui.getCore().setModel(i18nModel, "i18n");

			// this.getTargets().display("display");

			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

			// // set device model
			// var deviceModel = new sap.ui.model.json.JSONModel({
			// 	isTouch: sap.ui.Device.support.touch,
			// 	isNoTouch: !sap.ui.Device.support.touch,
			// 	isPhone: sap.ui.Device.system.phone,
			// 	isNoPhone: !sap.ui.Device.system.phone,
			// 	listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			// 	listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
			// });
			// deviceModel.setDefaultBindingMode("OneWay");
			// this.setModel(deviceModel, "device");
		}
	});
});