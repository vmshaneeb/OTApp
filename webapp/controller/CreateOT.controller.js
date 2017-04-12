var jModel = new sap.ui.model.json.JSONModel();

var result = {},
	Pernr = "",
	Mid = "",
	midSelect = "",
	i18nModel = i18nModel,
	CSRF_TOKEN = "",
	oUploadCollection = "",
	Ref_no = "",
	attach_chk = 0,
	otmaxed = 0,
	docnoexist = 0,
	idccount = 1,
	idc = "",
	cal = "";

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/v2/ODataModel",
	"OTApp/utils/Validator",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/UploadCollectionParameter"
], function(Controller, JSONModel, Fragment, Filter, MessageToast, ODataModel, jQuery, Validator, MessageBox, Button, Dialog, List,
	StandardListItem, UploadCollectionParameter) {
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
		onInit: function() {
			var oDatePicker = this.getView().byId("docdt");
			oDatePicker.addEventDelegate({
				onAfterRendering: function() {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, oDatePicker);

			// oDatePicker._oCalendar.setFirstDayOfWeek(0);
			// oDatePicker._oCalendar.setNonWorkingDays([5,6]);

			// Sets the text to the label
			this.getView().byId("UploadCollection").addEventDelegate({
				onBeforeRendering: function() {
					// this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});

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
					MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});

			//get X-CSRF Token
			var URI = url + "/Employee_f4Set";
			OData.request({
					requestUri: URI,
					method: "GET",
					headers: {
						"X-Requested-With": "XMLHttpRequest",
						"Content-Type": "application/atom+xml",
						"DataServiceVersion": "2.0",
						"X-CSRF-Token": "Fetch"
					}
				},
				function(data, response) {
					CSRF_TOKEN = response.headers['x-csrf-token'];
					oUploadCollection = me.getView().byId("UploadCollection");
					// oUploadCollectionbkp = oUploadCollection;
					// oUploadCollection = me.getView().byId("UploadCollection");
					// // Header Token
					// var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
					// 	name: "x-csrf-token",
					// 	value: CSRF_TOKEN
					// });
					// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
				}
			);

			sap.ui.getCore().attachValidationError(function(oEvent) {
				oEvent.getParameter("docno").setValueState(sap.ui.core.ValueState.Error);
			});
			sap.ui.getCore().attachValidationSuccess(function(oEvent) {
				oEvent.getParameter("docno").setValueState(sap.ui.core.ValueState.None);
			});
			me = this;

			// this.byId("docdt").setDateValue(new Date());
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
			if (this._oPopover) {
				this._oPopover.destroy();
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
			result = {};
			otmaxed = 0;
			docnoexist = 0;

			this.getView().byId("idSubmit_Create").setEnabled(true);
			this.getView().byId("docno").setValue(null);
			this.getView().byId("docdt").setValue(null);
			this.getView().byId("idOTTableChng").getModel().setProperty("/Employee_dataSet", null);

			this.getRouter().getTargets().display("dispchng");
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		onCancelBtnChange: function() {
			//This code was generated by the layout editor.
			result = {};
			otmaxed = 0;
			docnoexist = 0;

			this.getView().byId("idSubmit_Create").setEnabled(true);
			this.getView().byId("docno").setValue(null);
			this.getView().byId("docdt").setValue(null);
			this.getView().byId("idOTTableChng").getModel().setProperty("/Employee_dataSet", null);

			this.getRouter().getTargets().display("dispchng");
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		onDocChange: function() {
			//This code was generated by the layout editor.
			if (this.getView().byId("docno").getValue() === "") {
				this.getView().byId("docno").setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			} else {
				this.getView().byId("docno").setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			}
		},
		onDocdtChange: function() {
			//This code was generated by the layout editor.
			if (this.getView().byId("docdt").getValue() === "") {
				this.getView().byId("docdt").setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			} else {
				this.getView().byId("docdt").setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			}
		},
		checkOT: function(oEvent) {
			// This code was generated by the layout editor.
			if (oEvent.getSource().getValue() > 24) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error); // if the field is empty after change, it will go red
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None); // if the field is not empty after change, the value state (if any) is removed
			}
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		addItem: function(oEvent) {
			if (result.Employee_f4Set === undefined || result.Employee_f4Set.length === 0) {
				oModel.read("/Employee_f4Set", {
					success: function(oData, oResponse) {
						result.Employee_f4Set = oData.results;
						jModel.setData(result);
					},
					error: function(oError) {
						MessageToast.show(i18nModel.getProperty("Oderr"));
					}
				});
			}
			// var me = this;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("OTApp.utils.User", this);
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
			if (result.AllDates !== undefined) {
				for (var j = result.AllDates.length - 1; j >= 0; j--) {
					if (result.AllDates[j].MilNo === result.Employee_dataSet[index].Mid) {
						result.AllDates.splice(j, 1);
					}
				}
			}
			if (result.TempDates !== undefined) {
				result.TempDates = [];
			}

			if (result.DocDetailsSet !== undefined) {
				result.DocDetailsSet = [];
			}

			var data = model.getProperty("/Employee_dataSet");
			data.splice(index, 1);
			model.setProperty("/Employee_dataSet", data); // model.setData(data);
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
			if (oSelectedItems && oSelectedItems.length) {
				for (var i = 0; i < oSelectedItems.length; i++) {
					var item = oSelectedItems[i],
						context = item.getBindingContext(),
						obj = context.getProperty(null, context);
					// console.log(obj.Mid);
					var OTemp = $(result.Employee_dataSet).filter(function(i, n) {
						return n.Mid === obj.Mid;
					});
					if (OTemp && OTemp.length === 0) {
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
			// this._oDialog.destroy();

			if (Ref_no === "") {

				var Ref_URI = "/Ref_NoSet('0')";
				oModel.read(Ref_URI, null, null, false, function(oData, oResponse) {
					Ref_no = oData.ReferenceNumber;
					var uploadUrl = url + "/AttachmentsSet";
					oUploadCollection.setUploadUrl(uploadUrl);
				});
			}
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		addDates: function(oEvent) {
			//This code was generated by the layout editor.
			// if (!this._oPopover) {
			idc = "PopoverNew" + idccount;
			// this._oPopover = sap.ui.xmlfragment("OTApp.utils.Popover", this);
			this._oPopover = sap.ui.xmlfragment(idc, "OTApp.utils.Popover", this);
			// this._oPopover.bindElement("/ProductCollection/0");
			this.getView().addDependent(this._oPopover);
			idccount += 1;
			// }

			var calid = idc + "--calendar";
			cal = sap.ui.getCore().byId(calid);

			midSelect = oEvent.getSource().data("Mid");
			if (result.AllDates === undefined) {
				result.AllDates = [];
				result.TempDates = [];
			}
			if (result.AllDates.length > 0) {
				var OTemp = $(result.AllDates).filter(function(i, n) {
					return n.MilNo === midSelect;
				});

				// var calid = idc + "--calendar";

				// var cal = sap.ui.getCore().byId("calendar");
				// cal = sap.ui.getCore().byId(calid);

				// sap.ui.getCore().byId("calendar").removeAllSelectedDates();

				if (cal) {
					cal.removeAllSelectedDates();
				}

				if (OTemp && OTemp.length > 0) {
					result.TempDates = [];
					// sap.ui.getCore().byId("calendar").removeAllSelectedDates();

					if (cal) {
						cal.removeAllSelectedDates();
					}

					for (var i = 0; i < OTemp.length; i++) {
						result.TempDates.push(OTemp[i]);
						var dr = new sap.ui.unified.DateTypeRange({
							startDate: OTemp[i].Dates
						});
						cal.addSelectedDate(dr);
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
			var tmp = [],
				list = [],
				OTemp = [];
			// if (aSelectedDates.length !== result.TempDates.length) {
			// 	result.TempDates = [];
			// }
			if (aSelectedDates && aSelectedDates.length > 0) {
				tmp = result.TempDates;
				result.TempDates = [];
				for (var i = 0; i < aSelectedDates.length; i++) {
					var seldt = aSelectedDates[i].getStartDate();
					if (tmp && tmp.length !== 0) {
						OTemp = $(tmp).filter(function(i, n) {
							return n.Dates === seldt;
						});
						if (OTemp && OTemp.length !== 0) {
							list = {
								"MilNo": midSelect,
								"Dates": seldt,
								"Hrs": OTemp[0].Hrs
							};
						} else {
							list = {
								"MilNo": midSelect,
								"Dates": seldt,
								"Hrs": ""
							};
						}
					} else {
						list = {
							"MilNo": midSelect,
							"Dates": seldt,
							"Hrs": ""
						};
					}
					result.TempDates.push(list);
				}
			} else {
				result.TempDates = [];
			}

			jModel.setData(result);
			this.getView().setModel(jModel);
		},
		handleCloseButton: function(oEvent) {
			var status = 0;
			for (var k = 0; k < result.TempDates.length; k++) {
				if (result.TempDates[k].Hrs > 24) {
					status = 1;
				}
			}
			if (status === 0) {
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
					// sap.ui.getCore().byId("calendar").removeAllSelectedDates();
					if (cal) {
						cal.removeAllSelectedDates();
					}
					jModel.setData(result);
					this.getView().setModel(jModel);
				}
				this._oPopover.close();
				// this._oPopover.destroy();
			} else {
				MessageToast.show(i18nModel.getProperty("chkOTHrs"));
			}

		},
		handleRemoveSelection: function(oEvent) {
			result.TempDates = [];
			for (var j = result.AllDates.length - 1; j >= 0; j--) {
				if (result.AllDates[j].MilNo === midSelect) {
					result.AllDates.splice(j, 1);
				}
			}
			// sap.ui.getCore().byId("calendar").removeAllSelectedDates();
			if (cal) {
				cal.removeAllSelectedDates();
			}

			jModel.setData(result);
			this.getView().setModel(jModel);
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		onRefreshBtn: function() {
			// Create new validator instance
			// var validator = new Validator();
			// Validate input fields against root page with id ‘somePage’
			// if (validator.validate(this.byId("idCreate"))) {
			//This code was generated by the layout editor.
			var docno = this.getView().byId("docno").getValue();
			var docdt = this.getView().byId("docdt").getDateValue();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});

			if (docdt && docdt.length !== 0) {
				docdt = dateFormat.format(docdt);
			}

			if (docno === "") {
				MessageToast.show(i18nModel.getProperty("DocnEmpt"));
			} else if (docdt === "" || docdt === null) {
				MessageToast.show(i18nModel.getProperty("DocdtEmpt"));
			} else if (result.Employee_dataSet === undefined || result.Employee_dataSet.length === 0) {
				MessageToast.show(i18nModel.getProperty("EmpEmpt"));
			} else if (result.AllDates === undefined || result.AllDates.length === 0) {
				MessageToast.show(i18nModel.getProperty("OtEmpt"));
			} else {
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
						Mid: result.Employee_dataSet[i].Mid,
						Orgtx: result.Employee_dataSet[i].Orgtx,
						Orgunit: result.Employee_dataSet[i].Orgunit,
						Orgtx2: result.Employee_dataSet[i].Orgtx2,
						Orgunit2: result.Employee_dataSet[i].Orgunit2,
						Otamt: result.Employee_dataSet[i].Otamt,
						Pernr: result.Employee_dataSet[i].Pernr,
						Plstx: result.Employee_dataSet[i].Plstx,
						Posn: result.Employee_dataSet[i].Posn
					});
				}

				var ot = [];
				for (i = 0; i < result.AllDates.length; i++) {
					if (result.AllDates[i].Hrs === "") {
						ot.push({
							MilNo: result.AllDates[i].MilNo,
							Dates: dateFormat.format(result.AllDates[i].Dates),
							Hrs: "0"
						});
					} else {
						ot.push({
							MilNo: result.AllDates[i].MilNo,
							Dates: dateFormat.format(result.AllDates[i].Dates),
							Hrs: result.AllDates[i].Hrs
						});
					}
				}

				var data = {
					"Flag": "",
					"Docno": docno,
					"Docdate": docdt,
					"EmpSet": emp,
					"OtdetailsSet": ot
				};

				otmaxed = docnoexist = 0;

				oModel.create("/DocDetailsSet", data, {
					success: function(oData, oResponse) {
						result.DocDetailsSet = oResponse.data;
						result.Employee_dataSet = result.DocDetailsSet.EmpSet.results;
						result.OtdetailsSet = result.DocDetailsSet.OtdetailsSet.results;
						jModel.setData(result);

						for (var ii = 0; ii < result.Employee_dataSet.length; ii++) {
							if (result.Employee_dataSet[ii].Otmaxed === "X") {
								otmaxed += 1;
							} else {
								otmaxed = 0;
							}

							if (result.Employee_dataSet[ii].Docnoexist === "X") {
								docnoexist += 1;
							} else {
								docnoexist = 0;
							}
						}

						if (otmaxed !== 0) {
							if (docnoexist === 0) {
								MessageToast.show(i18nModel.getProperty("OTmaxed"));
							} else {
								MessageToast.show(i18nModel.getProperty("OTmaxed"), {
									offset: "0 -152"
								});
							}
						}
						if (docnoexist !== 0) {
							MessageToast.show(i18nModel.getProperty("DocnoExist"));
						}
					},
					error: function(oError) {
						// jQuery.sap.log.info("OData Read Error!!!");
						// MessageToast.show("OData Read Error!!!");
						MessageToast.show(i18nModel.getProperty("Oderr"));
					}
				});
			}
		},

		pressDialog: null,

		// upload collection logic
		onChange: function(oEvent) {
			// oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: CSRF_TOKEN
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

			var docno = this.getView().byId("docno").getValue();
			var docdt = this.getView().byId("docdt").getDateValue();

			if (docno === "" || docno === null) {
				MessageToast.show(i18nModel.getProperty("DocnEmpt"));
			} else if (docdt === "" || docdt === null) {
				MessageToast.show(i18nModel.getProperty("DocdtEmpt"));
			} else {
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyyMMdd"
				});

				docdt = dateFormat.format(docdt);

				// Header Slug
				var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "slug",
					value: encodeURIComponent(oEvent.getParameter("files")[0].name + "/" + Ref_no + "/" + docno + "/" + docdt)
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderSlug);
			}
		},

		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show(i18nModel.getProperty("fildel"));
		},

		deleteItemById: function(sItemToDeleteId) {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			// jQuery.each(aItems, function(index) {
			// 	if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
			// 		aItems.splice(index, 1);
			// 	};
			// });
			// this.getView().byId("UploadCollection").getModel().setData({
			// 	"items": aItems
			// });
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		onFilenameLengthExceed: function(oEvent) {
			MessageToast.show(i18nModel.getProperty("filexe"));
		},

		onFileRenamed: function(oEvent) {
			var oData = this.getView().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var sDocumentId = oEvent.getParameter("documentId");
			// jQuery.each(aItems, function(index) {
			// 	if (aItems[index] && aItems[index].documentId === sDocumentId) {
			// 		aItems[index].fileName = oEvent.getParameter("item").getFileName();
			// 	};
			// });
			// this.getView().byId("UploadCollection").getModel().setData({
			// 	"items": aItems
			// });
			MessageToast.show(i18nModel.getProperty("filren"));
		},

		onFileSizeExceed: function(oEvent) {
			MessageToast.show(i18nModel.getProperty("filsiz"));
		},

		onTypeMissmatch: function(oEvent) {
			MessageToast.show(i18nModel.getProperty("filmis"));
		},

		onUploadTerminated: function(oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},

		onBeforeUploadStarts: function(oEvent) {
			var docno = this.getView().byId("docno").getValue();
			var docdt = this.getView().byId("docdt").getDateValue();

			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				// value: oEvent.getParameter("files")[0].name + "/" + Ref_no
				value: oEvent.getParameter("fileName") + "/" + Ref_no + "/" + docno + "/" + docdt
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			// MessageToast.show("BeforeUploadStarts event triggered.");
		},

		onUploadComplete: function(oEvent) {
			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show(i18nModel.getProperty("filcom"));
			}, 4000);
			attach_chk += 1;
		},

		getAttachmentTitleText: function() {
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		onSubmitBtn: function() {
			//This code was generated by the layout editor.

			this.getView().byId("idSubmit_Create").setEnabled(false);

			var docno = this.getView().byId("docno").getValue();
			var docdt = this.getView().byId("docdt").getDateValue();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});
			docdt = dateFormat.format(docdt);
			if (docno === "") {
				MessageToast.show(i18nModel.getProperty("DocnEmpt"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else if (docdt === "") {
				MessageToast.show(i18nModel.getProperty("DocdtEmpt"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else if (result.Employee_dataSet === undefined || result.Employee_dataSet.length === 0) {
				MessageToast.show(i18nModel.getProperty("EmpEmpt"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else if (result.AllDates === undefined || result.AllDates.length === 0) {
				MessageToast.show(i18nModel.getProperty("OtEmpt"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else if (attach_chk === 0) {
				MessageToast.show(i18nModel.getProperty("Attach"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else if (docnoexist !== 0) {
				MessageToast.show(i18nModel.getProperty("DocnoExist"));
				this.getView().byId("idSubmit_Create").setEnabled(true);
			} else {
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
						Mid: result.Employee_dataSet[i].Mid,
						Hrs: result.Employee_dataSet[i].Hrs,
						Orgtx: result.Employee_dataSet[i].Orgtx,
						Orgunit: result.Employee_dataSet[i].Orgunit,
						Orgtx2: result.Employee_dataSet[i].Orgtx2,
						Orgunit2: result.Employee_dataSet[i].Orgunit2,
						Otamt: result.Employee_dataSet[i].Otamt,
						Pernr: result.Employee_dataSet[i].Pernr,
						Plstx: result.Employee_dataSet[i].Plstx,
						Posn: result.Employee_dataSet[i].Posn,
						RefNo: Ref_no
					});
				}

				var ot = [];
				for (i = 0; i < result.OtdetailsSet.length; i++) {
					if (result.AllDates[i].Hrs === "") {
						ot.push({
							MilNo: result.OtdetailsSet[i].MilNo,
							Dates: dateFormat.format(result.OtdetailsSet[i].Dates),
							Hrs: "0",
							Amt: result.OtdetailsSet[i].Amt
						});
					} else {
						ot.push({
							MilNo: result.OtdetailsSet[i].MilNo,
							Dates: dateFormat.format(result.OtdetailsSet[i].Dates),
							Hrs: result.OtdetailsSet[i].Hrs,
							Amt: result.OtdetailsSet[i].Amt
						});
					}
				}

				var data = {
					"Flag": "X",
					"Docno": docno,
					"Docdate": docdt,
					"EmpSet": emp,
					"OtdetailsSet": ot
				};

				var that = this;

				oModel.create("/DocDetailsSet", data, {
					success: function(oData, oResponse) {
						MessageToast.show(i18nModel.getProperty("reqSend"));
						result.DocDetailsSet = oResponse.data;
						result.Employee_dataSet = result.DocDetailsSet.EmpSet.results;
						result.OtdetailsSet = result.DocDetailsSet.OtdetailsSet.results;
						jModel.setData(result);

						result.Wids = [];

						for (i = 0; i < result.Employee_dataSet.length; i++) {
							result.Wids.push({
								"Mid": result.Employee_dataSet[i].Mid,
								"Wid": result.Employee_dataSet[i].Wid
							});
						}

						var oTable = new sap.m.Table({
								fixedLayout: false
							}),

							oModel2 = new JSONModel(result.Wids);

						oTable.addColumn(new sap.m.Column({
							header: new sap.m.Label({
								text: i18nModel.getProperty("MID")
							})
						}));

						oTable.addColumn(new sap.m.Column({
							header: new sap.m.Label({
								text: i18nModel.getProperty("WID")
							})
						}));

						var oTemplate = new sap.m.ColumnListItem({
							type: sap.m.ListType.Active,
							cells: [
								new sap.m.Label({
									text: "{Mid}"
								}),
								new sap.m.Label({
									text: "{Wid}"
								})
							]
						});

						oTable.setModel(oModel2);
						oTable.bindAggregation("items", "/", oTemplate);

						var tit = i18nModel.getProperty("witems");

						if (!that.pressDialog) {
							that.pressDialog = new Dialog({
								title: tit,
								content: oTable,
								beginButton: new Button({
									text: 'Close',
									press: function() {
										that.pressDialog.close();
									}
								})
							});

							//to get access to the global model
							that.getView().addDependent(that.pressDialog);
						}

						that.pressDialog.open();
					},
					error: function(oError) {
						MessageToast.show(i18nModel.getProperty("Oderr"));
					}
				});
			}
		}
	});
});