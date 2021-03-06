/*
 * Drishti Visual Testing Library in javascript.
 *
 * In Yoga, 'Drishti' means directed focus of gaze, during meditation.
 *
 * This testing library is capable of doing visual testing, with focus on using browser as a standalone tool to execute tests.

 * Author : Rupesh More
 * Email  : rupesh.more@gmail.com
 * Github : https://github.com/rupeshmore
 * LinkedIn : https://nz.linkedin.com/in/morerupesh
 */
var drishti = {
	mainObj: '',
	parentObj: '',
	childObj:'',
	conditionValue: '',
	refObj: '',
	domElement: '',
	domReferenceElement: '',
	specSelectorName: '',
	cssSelector : '',
	isElmNull: false,
	setChildParentFlag : false,
	actualValue: '',
	expectedValue: '',
	expectedValueofRef: '',
	errorTable: [],
	notExecutedTable: [],
	init: function () {
		drishti.passes = 0;
		drishti.failures = 0;
		drishti.notExecuted = 0;
		drishti.duration = 0;
		drishti.assertsDone = 0;
		for (var i in drishti.errorTable) {
			var elm = drishti.errorTable[i].CssSelector;
			document.querySelector(elm).style.outline = '';
			drishti.errorTable.splice(i, 1);
		}
	},
	assert: function(value1,value2) {
		drishti.assertsDone += 1;
		if (value1 !== value2) {
			return drishti.error();
		} else {
			return drishti.pass();
		}
	},
	iterate: function(obj) {
		if (typeof drishti.mainObj != 'object') drishti.mainObj = obj;
		if (typeof drishti.parentObj != 'string') drishti.parentObj = '';
		if (typeof drishti.conditionValue != 'string') drishti.conditionValue = '';

		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == 'object') {
					if ('selector' in obj[property]) {
						drishti.cssSelector = obj[property]['selector'];
						drishti.domElement = document.querySelector(''+drishti.cssSelector+'');
						drishti.specSelectorName = property;
					}
					drishti.isElmNull = drishti.isAbsent(drishti.domElement); // handle null elements
					console.groupCollapsed(property); // console reporting
					drishti.conditionValue +=  property + ' : ';
					drishti.refObj = Object.keys(obj[property])[0];
					drishti.parentObj = property;
					if (drishti.refObj in drishti.mainObj) {
						// To Do: elm referenced with itself please provide valid reference. //if (true) {};
						drishti.domReferenceElement = document.querySelector(''+drishti.mainObj[drishti.refObj]['selector']+'');
					}

					drishti.childObjectHandler(obj,property);

					if (!drishti.isElmNull && drishti.parentObj !== 'child') {
						drishti.callMethods(property);
					}

					drishti.iterate(obj[property]);
				} else if (property !== 'selector') {
						drishti.expectedValue = obj[property];
						var printValue = drishti.expectedValue; // Safari showing undefined character in the object
						drishti.conditionValue += property +' : '+ drishti.expectedValue;

						var isExpValueString = drishti.isString(drishti.expectedValue, drishti.expectedValueofRef);
						if(isExpValueString){
							drishti.expectedValue = isExpValueString;
							printValue = JSON.stringify(printValue);
						}

						drishti.isElmNull = drishti.isAbsent(drishti.domElement);
			    	//if element is null call only absent method to check
			    	if (drishti.isElmNull && property !== 'absent') {
							drishti.actualValue = null;
							console.log('%c '+property+' : '+printValue+'			Element defined in visualSpec not present, no test executed','color:orange');
							drishti.notExec();
						} else {
							drishti.callMethods(property);
						}

						if (drishti.actualValue !== null) {
							//Handling response from aligned method and cssContains method
							if ((drishti.parentObj === 'aligned' || drishti.parentObj === 'cssContains') && drishti.actualValue.indexOf(drishti.expectedValue)!== -1) {
								drishti.actualValue = drishti.expectedValue;
							}
							var assertStatus = drishti.assert(drishti.actualValue,drishti.expectedValue);
							//Console line Reporting
							if (assertStatus) {
								console.log('%c '+property+' : '+printValue+'','color:green;');
							} else {
								console.log('%c '+property+' : '+printValue+'			{Expected: '+drishti.expectedValue+ ', Actual: '+drishti.actualValue+'}','color:red;','');
							}
						}
				}
				drishti.conditionValue = '';
			}
		}
		console.groupEnd(); // console reporting
	},
	showError: function() {
		console.table(drishti.errorTable);
	},
	showNotExecuted: function() {
		console.table(drishti.notExecutedTable);
	},
	pass: function() {
		drishti.passes += 1;
		return true;
	},
	error: function() {
		drishti.failures += 1;
		if (!drishti.isElmNull) {
			drishti.domElement.style.outline = '#f00 solid 5px';
		}
		if (Array.isArray(drishti.actualValue)) {
			drishti.actualValue = JSON.stringify(drishti.actualValue);
		}
		drishti.errorTable.push({
			CssSelector:drishti.cssSelector,
			//"ElementName In SpecFile":this.specSelectorName,
			"Test Condition":drishti.conditionValue,
			Actual:drishti.actualValue,
			Expected:drishti.expectedValue
		});
		return false;
	},
	notExec: function() {
		drishti.notExecuted += 1;
		drishti.notExecutedTable.push({
			CssSelector:drishti.cssSelector,
			//"ElementName In SpecFile":this.specSelectorName,
			"Test Condition":drishti.conditionValue,
			Actual:drishti.actualValue,
			Expected:drishti.expectedValue
		});
		return null;
	},
	isString: function(value,refValue) {
		var returnValue;
		if (/(\d+)%$/.test(value)) {
			var percentageDivisor = 100 / parseInt(RegExp.$1);
			returnValue = refValue/percentageDivisor;
		} else if (/^([\+\-])(\d+)/.test(value)) {
				returnValue = refValue + parseInt(RegExp.$_);
		}

		if (returnValue) {
				return returnValue;
		} else {
			return null;
		}
	},
	childObjectHandler: function(o,p) {
		if (drishti.parentObj === 'child') {
			drishti.childObj = Object.keys(o[p]);
			drishti.setChildParentFlag = false;
		};

		if (typeof drishti.childObj === 'object') {
			var childIndex = drishti.childObj.indexOf(p);
			if (childIndex > -1) {
				drishti.refObj = drishti.childObj[childIndex];
				if (!drishti.isElmNull) {
					(drishti.methods.child)(); // call child function with refObj updated
				}
			}
		}
	},
	callMethods: function(property) {
		var myMethods = drishti.methods[property];
		if (myMethods !== undefined) {
			drishti.actualValue = myMethods();
		}
	},
	getComputedStyle: function(element, style) {
		var computedStyle = {};
		if (typeof element.currentStyle != "undefined") {
			computedStyle = element.currentStyle[style];
		} else {
			computedStyle = document.defaultView.getComputedStyle(element, null)[style];
		}
		return computedStyle;
	},
	isVisible: function(element) {
		if (element.offsetHeight > 0) {
			return true;
		} else {
			return false;
		}
	},
	isAbsent: function(element) {
		if (element === null) {
			return true;
		} else {
			return false;
		}
	},
	run:function() {
		if (typeof drishtiSpec === 'undefined') {
			console.error('drishtiSpec is not defined. Make sure you have visualSpec folder and visualSpec file');
			return null;
		}
		var startTime = new Date();

		console.clear();
		drishti.init();
		console.log('%cDrishti%c Visual Testing' ,'color:blue;font-size : 25px',''); // Reporting
		console.groupCollapsed('Drishti testing suite result');
		drishti.iterate(drishtiSpec);
		console.groupEnd();

		var endTime = new Date();
		duration = (endTime - startTime);

		drishti.result();

		drishti.eventDispatch("drishti-finished");
	},
	eventDispatch:function(eventName){
		//var drishtiEvent = new CustomEvent("drishti-finished"); // Create the event
		// document.dispatchEvent(drishtiEvent); // Dispatch/Trigger/Fire the event
		// Dispatch/Trigger/Fire the event
		var drishtiEvent = document.dispatchEvent(new CustomEvent(eventName));
		document.removeEventListener(drishtiEvent, false);
	},
	result:function () {
		if (drishti.notExecuted < 1) {
			console.log('%cpasses: %c'+drishti.passes+' , %cfailures: %c'+drishti.failures+' %c, duration: %c'+duration+'ms',
			  'color:green;font-size:16px','color:green;font-style:italic;font-size:18px',
				'color:red;font-size:16px','color:red;font-style:italic;font-size:18px',
				'font-size:16px', 'font-style:italic;font-size:18px');
		} else {
			console.log('%cpasses: %c'+drishti.passes+' , %cfailures: %c'+drishti.failures+' , %cnot executed: %c'+drishti.notExecuted+' %c, duration: %c'+duration+'ms',
			  'color:green; font-size : 16px','color:green; font-style:italic; font-size : 18px',
				'color:red; font-size : 16px','color: red; font-style: italic;font-size : 18px',
				'color:orange; font-size : 16px','color: orange; font-style: italic;font-size : 18px','font-size : 16px',
				'font-style: italic;font-size : 18px');
		};
		if (drishti.failures > 0) {
			console.groupCollapsed('%cdrishti: Error Table','color:grey; font-size:10;');
			drishti.showError();
			console.groupEnd();
		}
		if (drishti.notExecuted > 0) {
			console.groupCollapsed('%cdrishti: Not Executed Table','color:grey; font-size:10;');
			drishti.showNotExecuted();
			console.groupEnd();
		}
	},
	methods: {
		above: function() {
			return drishti.domReferenceElement.offsetTop - (drishti.domElement.offsetTop + drishti.domElement.offsetHeight);
		},
		below: function() {
			return drishti.domElement.offsetTop - (drishti.domReferenceElement.offsetTop + drishti.domReferenceElement.offsetHeight);
		},
		leftOf: function() {
			return  drishti.domReferenceElement.offsetLeft - (drishti.domElement.offsetLeft + drishti.domElement.offsetWidth);
		},
		rightOf: function() {
			return drishti.domElement.offsetLeft - (drishti.domReferenceElement.offsetLeft + drishti.domReferenceElement.offsetWidth);
		},
		widthAs: function() {
	    	drishti.expectedValueofRef = drishti.domReferenceElement.offsetWidth;
			return drishti.domElement.offsetWidth;
		},
		heightAs: function() {
	    	drishti.expectedValueofRef = drishti.domReferenceElement.offsetHeight;
			return drishti.domElement.offsetHeight;
		},
		width: function() {
			return drishti.domElement.offsetWidth;
		},
		height: function() {
			return drishti.domElement.offsetHeight;
		},
		top: function() {
			return drishti.domElement.offsetTop - drishti.domReferenceElement.offsetTop;
		},
		right: function() {
			return (drishti.domReferenceElement.offsetLeft + drishti.domReferenceElement.offsetWidth) - (drishti.domElement.offsetLeft + drishti.domElement.offsetWidth);
		},
		bottom: function() {
			return (drishti.domReferenceElement.offsetTop + drishti.domReferenceElement.offsetHeight) - (drishti.domElement.offsetTop + drishti.domElement.offsetHeight);
		},
		left: function() {
			return drishti.domElement.offsetLeft - drishti.domReferenceElement.offsetLeft;
		},
		absent: function() {
			return drishti.isAbsent(drishti.domElement);
		},
		visible: function() {
			return drishti.isVisible(drishti.domElement);
		},
		childItems: function() {
			return drishti.domElement.querySelectorAll(''+drishti.refObj+'').length;
		},
		childList: function() {
			return drishti.domElement.querySelectorAll('li').length;
		},
		textIs: function() {
			return drishti.domElement.textContent;
		},
		textContains: function() {
			var textValue = drishti.domElement.textContent;
			if (textValue.indexOf(drishti.expectedValue) > -1) {
				return drishti.expectedValue;
			} else {
				return textValue;
			}
		},
		aligned: function() {
			var alignedValue = [];
			var elmRefTop = drishti.domReferenceElement.offsetTop;
			var elmTop = drishti.domElement.offsetTop;
			var elmRefLeft = drishti.domReferenceElement.offsetLeft;
			var elmLeft = drishti.domElement.offsetLeft;
			if (elmRefTop === elmTop) alignedValue.push('Top');
			if (elmRefLeft === elmLeft) alignedValue.push('Left');
			if ((elmRefTop+drishti.domReferenceElement.offsetHeight) === (elmTop+drishti.domElement.offsetHeight)) alignedValue.push('Bottom');
			if ((elmRefLeft+drishti.domReferenceElement.offsetWidth) === (elmLeft+drishti.domElement.offsetWidth)) alignedValue.push('Right');
			return alignedValue;
		},
		attribute: function() {
			var elmAttr = drishti.domElement.attributes[drishti.refObj];
			if (elmAttr !== undefined) {
				return elmAttr.value;
			} else {
				return null;
			}
		},
		cssContains: function() {
			return drishti.getComputedStyle(drishti.domElement,drishti.refObj);
		},
		click: function () {
			if (drishti.expectedValue) {
				drishti.domElement.click();
			}
			return null;
		},
		enterText: function () {
			//to do
			drishti.domElement.value = '';
			return null;
		},
		child: function () {
			if (!drishti.setChildParentFlag) {
				parentElm = drishti.domElement;
				drishti.setChildParentFlag = true;
			};
			drishti.domElement = parentElm.querySelector(''+drishti.refObj+'');
			return null;
		},
		showInViewport: function() {
			if (drishti.expectedValue) {
				drishti.domElement.scrollIntoView();
			}
			return null;
		},
		inViewport: function () {
			var elementTop = drishti.domElement.getBoundingClientRect().top;
			var elementBottom = drishti.domElement.getBoundingClientRect().bottom;
			return elementTop >= 0 && elementBottom <= window.innerHeight;
		  // Partly visible is what you need? Go with this:
		  //return elementTop < window.innerHeight && elementBottom >= 0;
		},
		scroll: function() {
			return null;
		},
		pageDown: function() {
			window.scrollBy(0, window.innerHeight * drishti.expectedValue);
			return null;
		},
		pageUp: function() {
			window.scrollBy(0, -(window.innerHeight * drishti.expectedValue));
			return null;
		}
	}
};
