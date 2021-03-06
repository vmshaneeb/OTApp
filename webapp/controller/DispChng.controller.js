var i18nModel = i18nModel,
	bckp_OtdetailsSet = [];

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"OTApp/utils/Formatter",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem"
], function(Controller, JSONModel, ODataModel, ODataModelv2, Fragment, MessageToast, MessageBox, Filter, Formatter, Button, Dialog, List,
	StandardListItem) {
	"use strict";

	var url = "/sap/opu/odata/sap/ZHCM_OTAPP_SRV";

	var oModel = new ODataModel(url),
		// oModelv2 = new ODataModelv2(url),
		jModel = new JSONModel();

	var result = {},
		local = {},
		Pernr = "",
		Mid = "",
		midSelect = "",
		docSelect = "",
		paySelect = "",
		// i18nModel = i18nModel,
		stmt = "",
		uri = "",
		selItems = [],
		theTokenInput = "",
		selItemChng = [],
		selItemChngOT = [],
		me = this,
		idcount = 1,
		id = "",
		chng_count = 1,
		chng_id = "",
		otmaxed = 0;

	return Controller.extend("OTApp.controller.DispChng", {

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf OTApp.view.DispChng
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf OTApp.view.DispChng
		 */
		//	onAfterRendering: function() {
		//
		//	},
		onInit: function() {

			// var oDatePicker = this.getView().byId("docdtChng");
			// oDatePicker.addEventDelegate({
			// 	onAfterRendering: function() {
			// 		var oDateInner = this.$().find('.sapMInputBaseInner');
			// 		var oID = oDateInner[0].id;
			// 		$('#' + oID).attr("disabled", "disabled");
			// 	}
			// }, oDatePicker);

			var oMonthPicker = this.getView().byId("month");
			oMonthPicker.addEventDelegate({
				onAfterRendering: function() {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, oMonthPicker);

			var oYearPicker = this.getView().byId("year");
			oYearPicker.addEventDelegate({
				onAfterRendering: function() {
					var oDateInner = this.$().find('.sapMInputBaseInner');
					var oID = oDateInner[0].id;
					$('#' + oID).attr("disabled", "disabled");
				}
			}, oYearPicker);

			this.getView().setModel(oModel);

			oModel.read("/Employee_f4Set", {
				success: function(oData, oResponse) {
					result.Employee_f4Set = oData.results;
					jModel.setData(result);
				},
				error: function(oError) {
					MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});

			me = this;

			oModel.read("/AccessControlSet('')", {
				success: function(oData, oResponse) {
					if (oData.Change !== "X") {
						me.getView().byId("idChange").setVisible(false);
					}
				},
				error: function(oError) {
					// MessageToast.show(i18nModel.getProperty("Oderr"));
				}
			});
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		onChngBtn: function() {
			//This code was generated by the layout editor.
			//this is create function
			this.getRouter().getTargets().display("create");
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		onEditBtn: function(oEvent) {
			//This code was generated by the layout editor.
			//this is the change function

			if (result.AllDates && result.TempDates) {
				result.AllDates = [];
				result.TempDates = [];
			}

			var tbl = this.getView().byId("idOTTable");
			var selitm = tbl.getSelectedItems();

			selItemChng = [];
			selItemChngOT = [];

			if (selitm && selitm.length) {
				for (var i = 0; i < selitm.length; i++) {
					selItemChng.push(selitm[i].getBindingContext().getProperty());
				}

				for (i = 0; i < selItemChng.length; i++) {
					var Milno = selItemChng[i].Mid;
					var docno = selItemChng[i].Docno;
					var paymod = selItemChng[i].Paymode;

					var OTemp = $(result.OtdetailsSet).filter(function(k, n) {
						return n.MilNo === Milno && n.Docno === docno && n.Paymode === paymod;
					});
					if (OTemp && OTemp.length) {
						for (var j = 0; j < OTemp.length; j++) {
							selItemChngOT.push(OTemp[j]);
						}
					}
				}
			}

			if ((selItemChng && selItemChng.length) && (selItemChngOT && selItemChngOT)) {
				// send data to the next page
				// var eventBus = sap.ui.getCore().getEventBus();

				// // 1. ChannelName, 2. EventName, 3. the data
				// eventBus.publish("MainDetailChannel", "onNavigateEvent", {
				// 	EmpDet: selItemChng,
				// 	OTDet: selItemChngOT
				// });

				result.EmpDet = selItemChng;
				result.OTDet = selItemChngOT;

				for (var k = 0; k < result.OTDet.length; k++) {
					result.OTDet[k].Hrs = parseInt(result.OTDet[k].Hrs, 10);
				}

				jModel.setData(result);
				this.getView().setModel(jModel);

				var navCon = this.getView().byId("navCon");
				navCon.to(this.getView().byId("idChng"));

			} else {
				MessageToast.show(i18nModel.getProperty("EmpEmpt"));
			}
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		onNavBackBtn: function() {
			//This code was generated by the layout editor.
			window.history.go(-1);
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		OnPressCancel: function() {
			//This code was generated by the layout editor.
			window.history.go(-1);
		},
		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		convertToInt: function(n) {
			return parseInt(n, 10);
		},
		//  For User Search help
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		handleValueHelp: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("OTApp.utils.User", this);
				this.getView().addDependent(this._oDialog);
			}
			this.getView().setModel(jModel);

			// Multi-select if required
			this._oDialog.setMultiSelect(true);

			// Remember selections if required
			// this._oDialog.setRememberSelections(true);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
			this._oDialog.open();
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
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
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		_handleValueHelpClose: function(oEvent) {
			var oSelectedItems = oEvent.getParameter("selectedItems");
			var aTokens = [];
			// stmt = "",
			// var uri = "";
			selItems = [];
			if (oSelectedItems && oSelectedItems.length) {
				for (var i = 0; i < oSelectedItems.length; i++) {
					var item = oSelectedItems[i],
						context = item.getBindingContext(),
						obj = context.getProperty(null, context);
					selItems.push(obj.Mid);
					theTokenInput = this.getView().byId("multiinput1");
					var token1 = new sap.m.Token({
						key: obj.Mid,
						text: obj.Mid,
						editable: false
					});
					aTokens.push(token1);
					theTokenInput.setTokens(aTokens);
					var OTemp = $(result.EmpSet).filter(function(i, n) {
						return n.Mid === obj.Mid;
					});
					if (OTemp && OTemp.length === 0) {
						if (i === 0) {
							stmt = obj.Mid;
						} else {
							stmt += "@" + obj.Mid;
						}
					}
				}
			} else {
				var msg = i18nModel.getProperty("SelEmp");
				MessageToast.show(msg);
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		showDates: function(oEvent) {
			// var oView = this.getView();
			// var oPopover = oView.byId("PopoverDisp");

			// if (!this._oPopover) {
			id = "Popover" + idcount;

			this._oPopover = sap.ui.xmlfragment(id, "OTApp.utils.PopoverDisp", this);
			this.getView().addDependent(this._oPopover);

			idcount += 1;
			// }
			midSelect = oEvent.getSource().data("Mid");
			docSelect = oEvent.getSource().data("Docno");
			paySelect = oEvent.getSource().data("Paymode");

			if (result.OtdetailsSet.length > 0) {
				result.TempDates = [];
				var OTemp = $(result.OtdetailsSet).filter(function(i, n) {
					return n.MilNo === midSelect && n.Docno === docSelect && n.Paymode === paySelect;
				});

				var calid = id + "--calendarDisp";

				// var cal = sap.ui.getCore().byId("calendarDisp");
				var cal = sap.ui.getCore().byId(calid);

				if (cal) {
					cal.removeAllSelectedDates();
				}
				if (OTemp && OTemp.length > 0) {
					for (var i = 0; i < OTemp.length; i++) {
						result.TempDates.push(OTemp[i]);
						var dt = new Date(OTemp[i].Dates);
						var dr = new sap.ui.unified.DateTypeRange({
							startDate: dt
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
			// oPopover.open();
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		handleCloseButtonDisp: function() {
			this._oPopover.close();
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		RemoveAll: function() {
			var tbl = this.getView().byId("idOTTable");
			tbl.removeSelections();

			result.TempDates = [];
			result.Employee_DispSet = [];
			result.EmpSet = [];
			result.OtdetailsSet = [];
			result.AttachmentsSet = [];

			this.getView().byId("multiinput1").removeAllTokens();
			this.getView().byId("docno").setValue(null);
			this.getView().byId("month").setValue(null);
			this.getView().byId("year").setValue(null);

			this.getView().byId("empFilter").setCount(0);
			this.getView().byId("attachFilter").setCount(0);

			jModel.setData(result);
			this.getView().setModel(jModel);
		},
		/**
		 *@memberOf OTApp.controller.DisplayOT
		 */
		OnPressSearch: function(oEvent) {

			this.getView().byId("idSearch").setEnabled(false);

			var me = this,
				docno = "",
				month = "",
				year = "";
			// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 	pattern: "yyyy-MM-ddTKK:mm:ss"
			// });
			docno = this.getView().byId("docno").getValue();
			if (this.getView().byId("month").getDateValue() !== null) {
				month = this.getView().byId("month").getDateValue().getMonth() + 1;
			}
			if (this.getView().byId("year").getDateValue() !== null) {
				year = this.getView().byId("year").getDateValue().getFullYear();
			}
			// var milno = this.getView().byId("milno").getValue();
			// if (milno.length === 0 && (result.EmpSet === undefined || result.EmpSet.length === 0)) {
			// 	stmt = " ";
			// }
			if (stmt === "" && (result.EmpSet === undefined || result.EmpSet.length === 0)) {
				stmt = " ";
			} else {
				if (stmt === "") {
					result.EmpSet = [];
					result.OtdetailsSet = [];
					stmt = " ";
				} else {
					result.EmpSet = [];
					result.OtdetailsSet = [];
				}
			}

			if (stmt && stmt.length) {
				this.getView().byId("idOTTable").setBusy(true);

				uri = "/Employee_DispSet?$filter=Mid eq '" + stmt + "'" + " and Docno eq '" + docno + "'" + " and Month eq '" + month + "'" +
					" and Year eq '" + year + "'" + " &$expand=EmpSet,OtdetailsSet";
				// uri = "/Employee_DispSet?$filter=Mid eq '" + stmt + "' &$expand=EmpSet,OtdetailsSet";
				oModel.read(uri, {
					success: function(oData, oResponse) {
						if (result.Employee_DispSet === undefined) {
							result.Employee_DispSet = [];
						}
						if (result.EmpSet === undefined) {
							result.EmpSet = [];
						}
						if (result.OtdetailsSet === undefined) {
							result.OtdetailsSet = [];
						}
						if (result.Employee_DispSet.length === 0) {
							result.Employee_DispSet = oData.results;
						}
						if (result.EmpSet.length === 0) {
							result.EmpSet = oData.results[0].EmpSet.results;
						} else {
							for (var j = 0; j < oData.results[0].EmpSet.results.length; j++) {
								result.EmpSet.push(oData.results[0].EmpSet.results[j]);
							}
						}
						if (result.OtdetailsSet.length === 0) {
							result.OtdetailsSet = oData.results[0].OtdetailsSet.results;
						} else {
							for (j = 0; j < oData.results[0].OtdetailsSet.results.length; j++) {
								result.OtdetailsSet.push(oData.results[0].OtdetailsSet.results[j]);
							}
						}

						me.getView().byId("idOTTable").setBusy(false);

						for (var kk = 0; kk < result.EmpSet.length; kk++) {
							if (result.EmpSet[kk].Paymode === "S") {
								result.EmpSet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.EmpSet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						for (kk = 0; kk < result.OtdetailsSet.length; kk++) {
							if (result.OtdetailsSet[kk].Paymode === "S") {
								result.OtdetailsSet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.OtdetailsSet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						jModel.setData(result);
						me.getView().setModel(jModel);

						bckp_OtdetailsSet = [];

						for (var k = 0; k < result.OtdetailsSet.length; k++) {
							bckp_OtdetailsSet.push({
								Amt: result.OtdetailsSet[k].Amt,
								Dates: result.OtdetailsSet[k].Dates,
								Del: result.OtdetailsSet[k].Del,
								Docdate: result.OtdetailsSet[k].Docdate,
								Docno: result.OtdetailsSet[k].Docno,
								Hrs: result.OtdetailsSet[k].Hrs,
								MilNo: result.OtdetailsSet[k].MilNo,
								Pernr: result.OtdetailsSet[k].Pernr
							});
						}

						me.getView().byId("idSearch").setEnabled(true);

						me.getView().byId("empFilter").setCount(result.EmpSet.length);

						var docnosearch = "";

						for (var iii = 0; iii < result.OtdetailsSet.length; iii++) {
							if (iii === 0) {
								docnosearch = result.OtdetailsSet[iii].Docno;
							} else {
								docnosearch += "@" + result.OtdetailsSet[iii].Docno;
							}
						}

						uri = "/AttachmentsSet?$filter=RefNo eq ('" + docnosearch + "')";
						oModel.read(uri, {
							success: function(oData2, oResponse2) {
								result.AttachmentsSet = oData2.results;

								for (var ii = 0; ii < result.AttachmentsSet.length; ii++) {
									result.AttachmentsSet[ii].url = url +
										"/AttachmentsSet(RefNo='" +
										result.AttachmentsSet[ii].RefNo +
										"',Seq='" + result.AttachmentsSet[ii].Seq +
										"')/$value";
								}

								jModel.setData(result);

								var meme = me;
								meme.getView().byId("attachFilter").setCount(result.AttachmentsSet.length);
							},
							error: function(oError2) {
								MessageToast.show(i18nModel.getProperty("Oderr"));
							}
						});
					},
					error: function(oError) {
						MessageToast.show(i18nModel.getProperty("Oderr"));
						me.getView().byId("idSearch").setEnabled(true);
						me.getView().byId("idOTTable").setBusy(false);
					}
				});
				stmt = "";
			}

		},
		// *************************
		// start of change page
		// *************************
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		onBackBtnChange: function() {
			//This code was generated by the layout editor.
			var navCon = this.getView().byId("navCon");
			navCon.to(this.getView().byId("idDisp"));

			if (result.AllDates && result.TempDates) {
				result.AllDates = [];
				result.TempDates = [];
			}

			for (var k = 0; k < bckp_OtdetailsSet.length; k++) {
				result.OtdetailsSet[k].Amt = bckp_OtdetailsSet[k].Amt;
				result.OtdetailsSet[k].Dates = bckp_OtdetailsSet[k].Dates;
				result.OtdetailsSet[k].Del = bckp_OtdetailsSet[k].Del;
				result.OtdetailsSet[k].Docdate = bckp_OtdetailsSet[k].Docdate;
				result.OtdetailsSet[k].Docno = bckp_OtdetailsSet[k].Docno;
				result.OtdetailsSet[k].Hrs = bckp_OtdetailsSet[k].Hrs;
				result.OtdetailsSet[k].MilNo = bckp_OtdetailsSet[k].MilNo;
				result.OtdetailsSet[k].Pernr = bckp_OtdetailsSet[k].Pernr;
			}

			otmaxed = 0;

			// this.getView().byId("docnoChng").setValue(null);
			// this.getView().byId("docdtChng").setValue(null);

			jModel.setData(result);
			this.getView().setModel(jModel);
		},
		/**
		 *@memberOf OTApp.controller.ChangeOT
		 */
		onCancelBtnChange: function() {
			//This code was generated by the layout editor.

			this.getView().byId("idSubmitChng").setEnabled(true);

			var navCon = this.getView().byId("navCon");
			navCon.to(this.getView().byId("idDisp"));

			if (result.AllDates && result.TempDates) {
				result.AllDates = [];
				result.TempDates = [];
			}

			for (var k = 0; k < bckp_OtdetailsSet.length; k++) {
				result.OtdetailsSet[k].Amt = bckp_OtdetailsSet[k].Amt;
				result.OtdetailsSet[k].Dates = bckp_OtdetailsSet[k].Dates;
				result.OtdetailsSet[k].Del = bckp_OtdetailsSet[k].Del;
				result.OtdetailsSet[k].Docdate = bckp_OtdetailsSet[k].Docdate;
				result.OtdetailsSet[k].Docno = bckp_OtdetailsSet[k].Docno;
				result.OtdetailsSet[k].Hrs = bckp_OtdetailsSet[k].Hrs;
				result.OtdetailsSet[k].MilNo = bckp_OtdetailsSet[k].MilNo;
				result.OtdetailsSet[k].Pernr = bckp_OtdetailsSet[k].Pernr;
			}

			otmaxed = 0;

			// this.getView().byId("docnoChng").setValue(null);
			// this.getView().byId("docdtChng").setValue(null);

			jModel.setData(result);
			this.getView().setModel(jModel);
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
		 *@memberOf OTApp.controller.CreateOT
		 */
		addDatesChng: function(oEvent) {
			//This code was generated by the layout editor.
			// if (!this._oPopover) {
			chng_id = "PopoverChng" + chng_count;

			this._oPopover = sap.ui.xmlfragment(chng_id, "OTApp.utils.PopoverChng", this);
			// this._oPopover = sap.ui.xmlfragment("OTApp.utils.PopoverChng", this);
			this.getView().addDependent(this._oPopover);

			chng_count += 1;
			// }
			midSelect = oEvent.getSource().data("Mid");
			docSelect = oEvent.getSource().data("Docno");
			paySelect = oEvent.getSource().data("Paymode");

			if (result.AllDates === undefined || result.AllDates.length) {
				result.AllDates = [];
				result.TempDates = [];
			}

			if ((result.OTDet && result.OTDet.length) && result.AllDates.length === 0) {
				// result.AllDates = result.OTDet;
				for (var k = 0; k < result.OTDet.length; k++) {
					result.AllDates.push({
						Amt: result.OTDet[k].Amt,
						Dates: result.OTDet[k].Dates,
						Del: result.OTDet[k].Del,
						Docdate: result.OTDet[k].Docdate,
						Docno: result.OTDet[k].Docno,
						Hrs: result.OTDet[k].Hrs,
						MilNo: result.OTDet[k].MilNo,
						Paymode: result.OTDet[k].Paymode,
						Pernr: result.OTDet[k].Pernr
					});
				}
			}

			if (result.AllDates.length > 0) {

				var OTemp = $(result.OTDet).filter(function(i, n) {
					return n.MilNo === midSelect && n.Docno === docSelect && n.Paymode === paySelect;
				});

				var calid = chng_id + "--calendarChng";

				// var cal = sap.ui.getCore().byId("calendarChng");
				var cal = sap.ui.getCore().byId(calid);
				// var cal = oEvent.getSource().mEventRegistry.press[0].oListener._oPopover.mAggregations._popup.mAggregations.content[0];

				if (cal) {
					cal.removeAllSelectedDates();
				}

				if (OTemp && OTemp.length > 0) {
					for (var i = 0; i < OTemp.length; i++) {
						result.TempDates.push(OTemp[i]);
						var dt = new Date(OTemp[i].Dates);
						var dr = new sap.ui.unified.DateTypeRange({
							startDate: dt
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
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		handleCalendarSelect: function(oEvent) {
			var aSelectedDates = oEvent.getSource().getSelectedDates();
			var tmp = [],
				list = [],
				OTemp = [];

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
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		handleCloseButtonChng: function(oEvent) {
			// this._oPopover.close();
			var status = 0;
			for (var k = 0; k < result.TempDates.length; k++) {
				if (result.TempDates[k].Hrs > 24) {
					status = 1;
				}
			}
			if (status === 0) {
				if (result.TempDates.length > 0) {
					var OTemp = $(result.TempDates).filter(function(i, n) {
						return n.MilNo === midSelect && n.Docno === docSelect;
					});
					for (var j = result.AllDates.length - 1; j >= 0; j--) {
						if ((result.AllDates[j].MilNo === midSelect) && (result.AllDates[j].Docno === docSelect)) {
							result.AllDates.splice(j, 1);
						}
					}
					for (var i = 0; i < OTemp.length; i++) {
						result.AllDates.push(OTemp[i]);
					}
					result.TempDates = [];
					// sap.ui.getCore().byId("calendar").removeAllSelectedDates();
					jModel.setData(result);
					this.getView().setModel(jModel);
				}
				this._oPopover.close();
			} else {
				MessageToast.show(i18nModel.getProperty("chkOTHrs"));
			}
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
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
		onRefreshBtnChng: function() {
			//This code was generated by the layout editor.
			// var docno = this.getView().byId("docnoChng").getValue();
			// var docdt = this.getView().byId("docdtChng").getDateValue();
			// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 	pattern: "yyyy-MM-ddTKK:mm:ss"
			// });

			// if (docdt && docdt.length !== 0) {
			// 	docdt = dateFormat.format(docdt);
			// }

			// if (docno === "") {
			// 	MessageToast.show(i18nModel.getProperty("DocnEmpt"));
			// } else if (docdt === "" || docdt === null) {
			// 	MessageToast.show(i18nModel.getProperty("DocdtEmpt"));
			// } else 

			if (result.EmpDet === undefined || result.EmpDet.length === 0) {
				MessageToast.show(i18nModel.getProperty("EmpEmpt"));
			} else if (result.AllDates === undefined || result.AllDates.length === 0) {
				MessageToast.show(i18nModel.getProperty("OtEmpt"));
			} else {
				this.getView().byId("idOTTableChng").setBusy(true);

				var me = this;

				var emp = [];
				for (var i = 0; i < result.EmpDet.length; i++) {
					emp.push({
						Docdate: result.EmpDet[i].Docdate,
						Docno: result.EmpDet[i].Docno,
						Empgrp: result.EmpDet[i].Empgrp,
						EmpgrpTxt: result.EmpDet[i].EmpgrpTxt,
						Empsubgrp: result.EmpDet[i].Empsubgrp,
						EmpsubgrpTxt: result.EmpDet[i].EmpsubgrpTxt,
						Ename: result.EmpDet[i].Ename,
						Mid: result.EmpDet[i].Mid,
						Orgtx: result.EmpDet[i].Orgtx,
						Orgunit: result.EmpDet[i].Orgunit,
						Orgtx2: result.EmpDet[i].Orgtx2,
						Orgunit2: result.EmpDet[i].Orgunit2,
						Otamt: result.EmpDet[i].Otamt,
						Pernr: result.EmpDet[i].Pernr,
						Plstx: result.EmpDet[i].Plstx,
						Posn: result.EmpDet[i].Posn
					});
				}

				for (var kkk = 0; kkk < emp.length; kkk++) {
					if (result.EmpDet[kkk].Paymode === i18nModel.getProperty("Sal")) {
						emp[kkk].Paymode = "S";
					} else {
						emp[kkk].Paymode = "C";
					}
				}

				var ot = [];
				for (i = 0; i < result.OTDet.length; i++) {
					var del_ind = "";
					if (result.OTDet[i].Del === "") {
						del_ind = " ";
					} else {
						del_ind = "X";
					}
					if (result.OTDet[i].Hrs === "") {
						ot.push({
							MilNo: result.OTDet[i].MilNo,
							Pernr: result.OTDet[i].Pernr,
							Docno: result.OTDet[i].Docno,
							Docdate: result.OTDet[i].Docdate,
							Dates: result.OTDet[i].Dates,
							Hrs: "0",
							Del: del_ind
						});
					} else {
						ot.push({
							MilNo: result.OTDet[i].MilNo,
							Pernr: result.OTDet[i].Pernr,
							Docno: result.OTDet[i].Docno,
							Docdate: result.OTDet[i].Docdate,
							Dates: result.OTDet[i].Dates,
							Hrs: result.OTDet[i].Hrs,
							Paymode: result.OTDet[i].Paymode,
							Del: del_ind
						});
					}
				}

				for (kkk = 0; kkk < ot.length; kkk++) {
					if (result.OTDet[kkk].Paymode === i18nModel.getProperty("Sal")) {
						ot[kkk].Paymode = "S";
					} else {
						ot[kkk].Paymode = "C";
					}
				}

				// var data = {
				// 	"Flag": "",
				// 	"Docno": docno,
				// 	"Docdate": docdt,
				// 	"EmpSet": emp,
				// 	"OtdetailsSet": ot
				// };

				var data = {
					"Flag": "",
					"Docno": "",
					"Docdate": null,
					"EmpSet": emp,
					"OtdetailsSet": ot
				};

				otmaxed = 0;

				oModel.create("/DocDetailsSet", data, {
					success: function(oData, oResponse) {
						result.DocDetailsSet_Chng = oResponse.data;
						result.EmpDet = result.DocDetailsSet_Chng.EmpSet.results;
						result.OTDet = result.DocDetailsSet_Chng.OtdetailsSet.results;

						me.getView().byId("idOTTableChng").setBusy(false);

						for (var kk = 0; kk < result.EmpDet.length; kk++) {
							if (result.EmpDet[kk].Paymode === "S") {
								result.EmpDet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.EmpDet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						for (kk = 0; kk < result.OTDet.length; kk++) {
							if (result.OTDet[kk].Paymode === "S") {
								result.OTDet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.OTDet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						jModel.setData(result);

						for (var ii = 0; ii < result.EmpDet.length; ii++) {
							if (result.EmpDet[ii].Otmaxed === "X") {
								otmaxed += 1;
							} else {
								otmaxed = 0;
							}
						}

						if (otmaxed !== 0) {
							MessageToast.show(i18nModel.getProperty("OTmaxed"));
						}
					},
					error: function(oError) {
						MessageToast.show(i18nModel.getProperty("Oderr"));
						me.getView().byId("idOTTableChng").setBusy(false);
					}
				});
			}
		},
		/**
		 *@memberOf OTApp.controller.CreateOT
		 */
		OnPressSubmitChng: function(oEvent) {
			//This code was generated by the layout editor.

			this.getView().byId("idSubmitChng").setEnabled(false);

			// var docno = this.getView().byId("docnoChng").getValue();
			// var docdt = this.getView().byId("docdtChng").getDateValue();
			// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 	pattern: "yyyy-MM-ddTKK:mm:ss"
			// });
			// docdt = dateFormat.format(docdt);
			// if (docno === "") {
			// 	MessageToast.show(i18nModel.getProperty("DocnEmpt"));
			// 	this.getView().byId("idSubmitChng").setEnabled(true);
			// } else if (docdt === "") {
			// 	MessageToast.show(i18nModel.getProperty("DocdtEmpt"));
			// 	this.getView().byId("idSubmitChng").setEnabled(true);
			// } else 

			if (result.EmpDet === undefined || result.EmpDet.length === 0) {
				MessageToast.show(i18nModel.getProperty("EmpEmpt"));
				this.getView().byId("idSubmitChng").setEnabled(true);
			} else if (result.AllDates === undefined || result.AllDates.length === 0) {
				MessageToast.show(i18nModel.getProperty("OtChng"));
				this.getView().byId("idSubmitChng").setEnabled(true);
			} else {
				var emp = [];
				for (var i = 0; i < result.EmpDet.length; i++) {
					emp.push({
						Docdate: result.EmpDet[i].Docdate,
						Docno: result.EmpDet[i].Docno,
						Empgrp: result.EmpDet[i].Empgrp,
						EmpgrpTxt: result.EmpDet[i].EmpgrpTxt,
						Empsubgrp: result.EmpDet[i].Empsubgrp,
						EmpsubgrpTxt: result.EmpDet[i].EmpsubgrpTxt,
						Ename: result.EmpDet[i].Ename,
						Mid: result.EmpDet[i].Mid,
						Hrs: result.EmpDet[i].Hrs,
						Orgtx: result.EmpDet[i].Orgtx,
						Orgunit: result.EmpDet[i].Orgunit,
						Orgtx2: result.EmpDet[i].Orgtx2,
						Orgunit2: result.EmpDet[i].Orgunit2,
						Otamt: result.EmpDet[i].Otamt,
						Pernr: result.EmpDet[i].Pernr,
						Plstx: result.EmpDet[i].Plstx,
						Posn: result.EmpDet[i].Posn
					});
				}

				for (var kkk = 0; kkk < emp.length; kkk++) {
					if (result.EmpDet[kkk].Paymode === i18nModel.getProperty("Sal")) {
						emp[kkk].Paymode = "S";
					} else {
						emp[kkk].Paymode = "C";
					}
				}

				var ot = [];
				for (i = 0; i < result.OTDet.length; i++) {
					var del_ind = "";
					if (result.AllDates[i].Del === "") {
						del_ind = " ";
					} else {
						del_ind = "X";
					}
					if (result.OTDet[i].Hrs === "") {
						ot.push({
							MilNo: result.OTDet[i].MilNo,
							Pernr: result.OTDet[i].Pernr,
							Docno: result.OTDet[i].Docno,
							Docdate: result.OTDet[i].Docdate,
							Dates: result.OTDet[i].Dates,
							Hrs: "0",
							Amt: result.OTDet[i].Amt,
							Paymode: result.AllDates[i].Paymode,
							Del: del_ind
						});
					} else {
						ot.push({
							MilNo: result.OTDet[i].MilNo,
							Pernr: result.OTDet[i].Pernr,
							Docno: result.OTDet[i].Docno,
							Docdate: result.OTDet[i].Docdate,
							Dates: result.OTDet[i].Dates,
							Hrs: result.OTDet[i].Hrs,
							Amt: result.OTDet[i].Amt,
							Paymode: result.AllDates[i].Paymode,
							Del: del_ind
						});
					}
				}

				for (kkk = 0; kkk < ot.length; kkk++) {
					if (result.AllDates[kkk].Paymode === i18nModel.getProperty("Sal")) {
						ot[kkk].Paymode = "S";
					} else {
						ot[kkk].Paymode = "C";
					}
				}

				// var data = {
				// 	"Flag": "C",
				// 	"Docno": docno,
				// 	"Docdate": docdt,
				// 	"EmpSet": emp,
				// 	"OtdetailsSet": ot
				// };

				var data = {
					"Flag": "C",
					"Docno": "",
					"Docdate": null,
					"EmpSet": emp,
					"OtdetailsSet": ot
				};

				var that = this;

				oModel.create("/DocDetailsSet", data, {
					success: function(oData, oResponse) {
						MessageToast.show(i18nModel.getProperty("reqSend"));
						result.DocDetailsSet = oResponse.data;
						result.EmpDet = result.DocDetailsSet.EmpSet.results;
						result.OTDet = result.DocDetailsSet.OtdetailsSet.results;

						for (var kk = 0; kk < result.EmpDet.length; kk++) {
							if (result.EmpDet[kk].Paymode === "S") {
								result.EmpDet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.EmpDet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						for (kk = 0; kk < result.OTDet.length; kk++) {
							if (result.OTDet[kk].Paymode === "S") {
								result.OTDet[kk].Paymode = i18nModel.getProperty("Sal");
							} else {
								result.OTDet[kk].Paymode = i18nModel.getProperty("Cheq");
							}
						}

						jModel.setData(result);

						result.Wids = [];

						for (i = 0; i < result.EmpDet.length; i++) {
							result.Wids.push({
								"Mid": result.EmpDet[i].Mid,
								"Wid": result.EmpDet[i].Wid
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