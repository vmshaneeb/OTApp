var jModel = new sap.ui.model.json.JSONModel();

var result = {},
	Pernr = "",
	Mid = "",
	midSelect = "";

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, JSONModel, Fragment, Filter, MessageToast, ODataModel, jQuery) {
	"use strict";
	var url = "/sap/opu/odata/sap/ZHCM_OTAPP_SRV";
	//proxy/http/172.16.76.134:50000
	var oModel = new sap.ui.model.odata.ODataModel(url, true);
	// var oModel = new sap.ui.model.odata.v2.ODataModel(url, {
	// 	useBatch: false
	// });
	// var oModel = new ODataModel(url, true);
	// var jModel = new JSONModel();
	// var result = {},
	// 	Pernr = "",
	// 	Mid = "",
	// 	midSelect = "";
	// var i18nModel = sap.ui.getCore().getView().getModel("i18n");
	var me = this;
	return Controller.extend("OTApp.controller.CreateOT", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf OTApp.view.view.ChangeOT
		 */

		oFormatYyyymmdd: null,

		onInit: function() {
			// this.jModel = new sap.ui.model.json.JSONModel();

			// i18n = this.getView().getModel("i18n");
			// oModel.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oModel);
			// oModel.read("/Employee_f4Set", null, null, false, function(oData, oResponse) {
			oModel.read("/Employee_f4Set", {
				success: function(oData, oResponse) {
					result.Employee_f4Set = oData.results;
					jModel.setData(result);
				},
				error: function(oError) {
					// jQuery.sap.log.info("OData Read Error!!!");
					// MessageToast.show("OData Read Error!!!");
					MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});
			me = this;

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf OTApp.view.view.ChangeOT
		 */
		//	onBeforeRendering: function() {
		//
		//	},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf OTApp.view.view.ChangeOT
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf OTApp.view.view.ChangeOT
		 */
		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onBackBtnChange: function() {
			//This code was generated by the layout editor.
			this.getRouter().getTargets().display("display");
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		onCancelBtnChange: function() {
			//This code was generated by the layout editor.
			this.getRouter().getTargets().display("display");
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		addItem: function(oEvent) {
			// var me = this;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("OTApp.view.User", this);
				// this._oDialog.setModel(this.getView().getModel());
				this._oDialog.setModel(jModel);
				// this._oDialog.setModel(i18nModel);
				this.getView().addDependent(this._oDialog);
			}
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);
			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
			// toggle compact style
			// jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open(); // addIcon.setBusy(false);
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		deleteItem: function(oEvent) {
			//This code was generated by the layout editor.
			// jQuery.sap.log.info("delete pressed");
			var tbl = oEvent.getSource().getParent().getParent();
			var path = oEvent.getParameter("listItem").getBindingContext().getPath();
			var index = parseInt(path.substring(path.lastIndexOf("/") + 1), 10);
			//any other value than hex and oct, the radix is 10 (decimal)
			// var model = this.getView().getModel();
			var model = tbl.getModel();
			// var data = model.getData();
			var data = model.getProperty("/Employee_dataSet");
			data.splice(index, 1);
			model.setProperty("/Employee_dataSet", data); // model.setData(data);

			for (var j = result.AllDates.length - 1; j >= 0; j--) {
				if (result.AllDates[j].MilNo === midSelect) {
					result.AllDates.splice(j, 1);
				}
			}

			// refresh the model
			// oModel.refresh();
		},
		_handleValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Mid", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter1 = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter2 = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, sValue);
			var allfilter = new sap.ui.model.Filter([
				oFilter,
				oFilter1,
				oFilter2
			], false);
			oEvent.getSource().getBinding("items").filter(allfilter);
		},
		_handleValueHelpClose: function(oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedItems"),
				stmt = "",
				uri = "";
			if (oSelectedItems.length) {

				for (var i = 0; i < oSelectedItems.length; i++) {
					var item = oSelectedItems[i],
						context = item.getBindingContext(),
						obj = context.getProperty(null, context);
					// console.log(obj.Mid);
					var OTemp = $(result.Employee_dataSet).filter(function(i, n) {
						return n.Mid === obj.Mid;
					});

					if (OTemp.length === 0) {
						if (i === 0) {
							stmt = obj.Mid;
						} else {
							// stmt += " and " + obj.Mid; // console.log(stmt);
							stmt += "@" + obj.Mid;
						}
					}

				}
				// console.log(stmt);
				if (stmt.length) {

					uri = "/Employee_dataSet?$filter=Mid eq '" + stmt + "'";
					oModel.read(uri, {
						success: function(oData, oResponse) {
							if (result.Employee_dataSet === undefined) {
								result.Employee_dataSet = [];
							}
							if (result.Employee_dataSet.length === 0) {
								result.Employee_dataSet = oData.results;
							} else {
								for (var j = 0; j < oData.results.length; j++) {
									result.Employee_dataSet.push(oData.results[j]);
								}
							}

							jModel.setData(result);
							me.getView().setModel(jModel); // me.getView().byId("idOTTableChng").getModel().updateBindings();
							// this.getView().byId("idOTTableChng").setModel(jModel);
							// this.getView().byId("idOTTableChng").getModel().refresh(true);
						},
						error: function(oError) {
							// jQuery.sap.log.info("OData Read Error!!!");
							// console.log("OData Read Error!!!");
							MessageToast.show(i18nModel.getProperty("Oderr"));
						}
					});
				} // var oFilter = new Filter("Mid", "EQ", "6014");
				// oModel.read("/Employee_dataSet", {
				// 	filter: oFilter,
				// 	success: function(oData, oResponse) {
				// 		result.Employee_dataSet = oData.results;
				// 		// jModel.setData(result);
				// 	},
				// 	error: function(oError) {
				// 		// jQuery.sap.log.info("OData Read Error!!!");
				// 		// console.log("OData Read Error!!!");
				// 		MessageToast.show(i18nModel.getProperty('Oderr'));
				// 	}
				// });
			} else {
				var msg = i18nModel.getProperty("SelEmp");
				// var msg = i18n.getProperty("SelEmp");
				// MessageToast.show(i18n.getProperty('SelEmp'));
				MessageToast.show(msg); // MessageToast.show("!!! Pls select an employee first !!!");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		addDates: function(oEvent) {
			//This code was generated by the layout editor.

			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("OTApp.view.Popover", this);
				// this._oPopover.bindElement("/ProductCollection/0");
				this.getView().addDependent(this._oPopover);
			}
			midSelect = oEvent.getSource().data("Mid");

			if (result.AllDates === undefined) {
				result.AllDates = [];
				result.TempDates = [];
			}

			if (result.AllDates.length > 0) {

				var OTemp = $(result.AllDates).filter(function(i, n) {
					return n.MilNo === midSelect;
				});

				var cal = sap.ui.getCore().byId('calendar');

				if (OTemp.length > 0) {
					result.TempDates = [];
					sap.ui.getCore().byId("calendar").removeAllSelectedDates();

					for (var i = 0; i < OTemp.length; i++) {
						result.TempDates.push(OTemp[i]);
						var dr = new sap.ui.unified.DateTypeRange({
							startDate: OTemp[i].Dates
						});

						cal.addSelectedDate(dr);
						// result.TempDates = [];
					}
				} else {
					result.TempDates = [];
				}
			} else {
				result.TempDates = [];
			}

			jModel.setData(result);
			this.getView().setModel(jModel);

			this._oPopover.openBy(oEvent.getSource());
		},

		handleCalendarSelect: function(oEvent) {
			var aSelectedDates = oEvent.getSource().getSelectedDates();

			// if (aSelectedDates.length !== result.TempDates.length) {
			// 	result.TempDates = [];
			// }

			if (aSelectedDates.length > 0) {
				result.TempDates = [];

				for (var i = 0; i < aSelectedDates.length; i++) {
					var seldt = aSelectedDates[i].getStartDate();

					var list = {
						"MilNo": midSelect,
						"Dates": seldt,
						"Hrs": ""
					};

					result.TempDates.push(list);
				}
			} else {
				result.TempDates = [];
			}

			// if (aSelectedDates.length > 0) {
			// 	var seldt = aSelectedDates[aSelectedDates.length - 1].getStartDate();

			// 	var list = {
			// 		"MilNo": midSelect,
			// 		"Dates": seldt,
			// 		"Hrs": ""
			// 	};

			// 	result.TempDates.push(list);
			// }

			jModel.setData(result);
			this.getView().setModel(jModel);
		},

		handleCloseButton: function(oEvent) {

			if (result.TempDates.length > 0) {

				var OTemp = $(result.TempDates).filter(function(i, n) {
					return n.MilNo === midSelect;
				});

				for (var j = result.AllDates.length - 1; j >= 0; j--) {
					if (result.AllDates[j].MilNo === midSelect) {
						result.AllDates.splice(j, 1);
					}
				}

				for (var i = 0; i < OTemp.length; i++) {
					result.AllDates.push(OTemp[i]);
				}

				result.TempDates = [];

				sap.ui.getCore().byId("calendar").removeAllSelectedDates();

				jModel.setData(result);
				this.getView().setModel(jModel);
			}

			this._oPopover.close();
		},

		handleRemoveSelection: function(oEvent) {
			result.TempDates = [];

			for (var j = result.AllDates.length - 1; j >= 0; j--) {
				if (result.AllDates[j].MilNo === midSelect) {
					result.AllDates.splice(j, 1);
				}
			}

			sap.ui.getCore().byId("calendar").removeAllSelectedDates();

			jModel.setData(result);
			this.getView().setModel(jModel);
		},

		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		onRefreshBtn: function() {
			//This code was generated by the layout editor.

			var docno = this.getView().byId("docno").getValue();
			var docdt = this.getView().byId("docdt").getDateValue();

			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});

			docdt = dateFormat.format(docdt);

			var emp = [];

			for (var i = 0; i < result.Employee_dataSet.length; i++) {
				emp.push({
					Docdate: result.Employee_dataSet[i].Docdate,
					Docno: result.Employee_dataSet[i].Docno,
					Empgrp: result.Employee_dataSet[i].Empgrp,
					EmpgrpTxt: result.Employee_dataSet[i].EmpgrpTxt,
					Empsubgrp: result.Employee_dataSet[i].Empsubgrp,
					EmpsubgrpTxt: result.Employee_dataSet[i].EmpsubgrpTxt,
					Ename: result.Employee_dataSet[i].Ename,
					Endda: result.Employee_dataSet[i].Endda,
					Mid: result.Employee_dataSet[i].Mid,
					Orgtx: result.Employee_dataSet[i].Orgtx,
					Orgunit: result.Employee_dataSet[i].Orgunit,
					Otamt: result.Employee_dataSet[i].Otamt,
					Pernr: result.Employee_dataSet[i].Pernr,
					Plstx: result.Employee_dataSet[i].Plstx,
					Posn: result.Employee_dataSet[i].Posn
				});
			}

			var ot = [];

			for (i = 0; i < result.AllDates.length; i++) {
				ot.push({
					MilNo: result.AllDates[i].MilNo,
					Dates: dateFormat.format(result.AllDates[i].Dates),
					Hrs: result.AllDates[i].Hrs
				});
			}

			var data = {
				"Flag": "",
				"Docno": docno,
				"Docdate": docdt,
				"EmpSet": emp,
				"OtdetailsSet": ot
			};

			oModel.create("/DocDetailsSet", data, {
				success: function(oData, oResponse) {

					result.DocDetailsSet = oResponse.data;
					result.Employee_dataSet = result.DocDetailsSet.EmpSet.results;
					jModel.setData(result);
				},
				error: function(oError) {
					// jQuery.sap.log.info("OData Read Error!!!");
					// MessageToast.show("OData Read Error!!!");
					MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});
		}

		// handleOK: function(oEvent) {
		// 	this._storeShowResetEnabled();
		// 	this.oPersonalizationDialog.close();
		// },

		// handleCancel: function(oEvent) {
		// 	this.oPersonalizationDialog.close();
		// },

		// handleReset: function(oEvent) {
		// 	this.bIsReseted = true;
		// 	MessageToast.show("Reset button has been clicked", {
		// 		width: "auto"
		// 	});
		// }
	});
});