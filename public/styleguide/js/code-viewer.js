/*!
 * Code View Support for the Viewer - v0.1
 *
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 */

var codeViewer = {
	
	// set up some defaults
	codeActive:   false,
	tabActive:    "e",
	encoded:      "",
	mustache:     "",
	css:          "",
	targetOrigin: (window.location.protocol === "file:") ? "*" : window.location.protocol+"//"+window.location.host,
	
	/**
	* add the onclick handler to the code link in the main nav
	*/
	onReady: function() {
		
		// not sure this is needed anymore...
		$('body').addClass('code-ready');
		
		// add the onclick handler
		$('#sg-t-code').click(function(e) {
			
			e.preventDefault();
			
			// make sure the annotations overlay is off before showing code view
			$('#sg-t-annotations').removeClass('active');
			annotationsViewer.commentsActive = false;
			var obj = JSON.stringify({ "commentToggle": "off" });
			document.getElementById('sg-viewport').contentWindow.postMessage(obj,codeViewer.targetOrigin);
			annotationsViewer.slideComment(999);
			
			// remove the class from the "eye" nav item
			$('#sg-t-toggle').removeClass('active');
			
			// if the code link in the main nav is active close the panel. otherwise open
			if ($(this).hasClass('active')) {
				codeViewer.closeCode();
			} else {
				codeViewer.openCode();
			}
			
		});
		
		// initialize the code viewer
		codeViewer.codeContainerInit();
		
	},
	
	/**
	* after clicking the code view link open the panel
	*/
	openCode: function() {
		var obj = JSON.stringify({ "codeToggle": "on" });
		document.getElementById('sg-viewport').contentWindow.postMessage(obj,codeViewer.targetOrigin);
		codeViewer.codeActive = true;
		$('#sg-t-code').addClass('active');
	},
	
	/**
	* after clicking the code view link close the panel
	*/
	closeCode: function() {
		var obj = JSON.stringify({ "codeToggle": "off" });
		document.getElementById('sg-viewport').contentWindow.postMessage(obj,codeViewer.targetOrigin);
		codeViewer.codeActive = false;
		codeViewer.slideCode($('#sg-code-container').outerHeight());
		$('#sg-t-code').removeClass('active');
	},
	
	/**
	* add the basic mark-up and events for the code container
	*/
	codeContainerInit: function() {
		
		// the bulk of this template is in core/templates/index.mustache
		if (document.getElementById("sg-code-container") === null) {
			$('<div id="sg-code-container" class="sg-view-container"></div>').html($("#code-template").html()).appendTo('body').css('bottom',-$(document).outerHeight());
			setTimeout(function(){ $('#sg-code-container').addClass('anim-ready'); },50); //Add animation class once container is positioned out of frame
		}
		
		// make sure the close button handles the click
		$('body').delegate('#sg-code-close-btn','click',function() {
			codeViewer.closeCode();
			return false;
		});
		
		// make sure the click events are handled on the HTML tab
		$('#sg-code-title-html').click(function() {
			$('.sg-code-title-active').removeClass('sg-code-title-active');
			$(this).toggleClass("sg-code-title-active");
			codeViewer.swapCode("e");
		});
		
		// make sure the click events are handled on the Mustache tab
		$('#sg-code-title-mustache').click(function() {
			$('.sg-code-title-active').removeClass('sg-code-title-active');
			$(this).toggleClass("sg-code-title-active");
			codeViewer.swapCode("m");
		});
		
		// make sure the click events are handled on the CSS tab
		$('#sg-code-title-css').click(function() {
			$('.sg-code-title-active').removeClass('sg-code-title-active');
			$(this).toggleClass("sg-code-title-active");
			codeViewer.swapCode("c");
		});
		
	},
	
	/**
	* depending on what tab is clicked this swaps out the code container. makes sure prism highlight is added.
	*/
	swapCode: function(type) {
		var fill      = "";
		var className = (type == "c") ? "css" : "markup";
		$("#sg-code-fill").removeClass().addClass("language-"+className);
		if (type == "m") {
			fill = codeViewer.mustache;
		} else if (type == "e") {
			fill = codeViewer.encoded;
		} else if (type == "c") {
			fill = codeViewer.css;
		}
		$("#sg-code-fill").html(fill).text();
		codeViewer.tabActive = type;
		Prism.highlightElement(document.getElementById("sg-code-fill"));
	},
	
	/**
	* slides the panel
	*/
	slideCode: function(pos) {
		$('#sg-code-container').css('bottom',-pos);
	},
	
	/**
	* once the AJAX request for the encoded mark-up is finished this runs.
	* if the encoded tab is the current active tab it adds the content to the default code container
	*/
	saveEncoded: function() {
		codeViewer.encoded = this.responseText;
		if (codeViewer.tabActive == "e") {
			codeViewer.activateDefaultTab("e",this.responseText);
		}
	},
	
	/**
	* once the AJAX request for the mustache mark-up is finished this runs.
	* if the mustache tab is the current active tab it adds the content to the default code container
	*/
	saveMustache: function() {
		codeViewer.mustache = this.responseText;
		if (codeViewer.tabActive == "m") {
			codeViewer.activateDefaultTab("m",this.responseText);
		}
	},
	
	/**
	* once the AJAX request for the css mark-up is finished this runs. if this function is running then css has been enabled
	* if the css tab is the current active tab it adds the content to the default code container
	*/
	saveCSS: function() {
		$('#sg-code-title-css').css("display","block");
		codeViewer.css = this.responseText;
		if (codeViewer.tabActive == "c") {
			codeViewer.activateDefaultTab("c",this.responseText);
		}
	},
	
	/**
	* when loading the code view make sure the active tab is highlighted and filled in appropriately
	*/
	activateDefaultTab: function(type,code) {
		var typeName  = "";
		var className = (type == "c") ? "css" : "markup";
		if (type == "m") {
			typeName = "mustache";
		} else if (type == "e") {
			typeName = "html";
		} else if (type == "c") {
			typeName = "css";
		}
		$('.sg-code-title-active').removeClass('sg-code-title-active');
		$('#sg-code-title-'+typeName).addClass('sg-code-title-active');
		$("#sg-code-fill").removeClass().addClass("language-"+className);
		$("#sg-code-fill").html(code).text();
		Prism.highlightElement(document.getElementById("sg-code-fill"));
	},
	
	/**
	* when turning on or switching between patterns with code view on make sure we get
	* the code from from the pattern via post message
	*/
	updateCode: function(lineage,lineageR,patternPartial,cssEnabled) {
		
		// draw lineage
		if (lineage.length !== 0) {
			var lineageList = "";
			$("#sg-code-lineage").css("display","block");
			for (var i = 0; i < lineage.length; i++) {
				lineageList += (i === 0) ? "" : ", ";
				lineageList += "<a href='"+lineage[i].lineagePath+"' data-patternPartial='"+lineage[i].lineagePattern+"'>"+lineage[i].lineagePattern+"</a>";
			}
			$("#sg-code-lineage-fill").html(lineageList);
		} else {
			$("#sg-code-lineage").css("display","none");
		}
		
		
		// when clicking on a lineage item change the iframe source
		$('#sg-code-lineage-fill a').on("click", function(e){
			e.preventDefault();
			var obj = JSON.stringify({ "path": urlHandler.getFileName($(this).attr("data-patternpartial")) });
			document.getElementById("sg-viewport").contentWindow.postMessage(obj,codeViewer.targetOrigin);
		});
		
		// draw reverse lineage
		if (lineageR.length !== 0) {
			var lineageRList = "";
			$("#sg-code-lineager").css("display","block");
			for (var i = 0; i < lineageR.length; i++) {
				lineageRList += (i === 0) ? "" : ", ";
				lineageRList += "<a href='"+lineageR[i].lineagePath+"' data-patternPartial='"+lineageR[i].lineagePattern+"'>"+lineageR[i].lineagePattern+"</a>";
			}
			$("#sg-code-lineager-fill").html(lineageRList);
		} else {
			$("#sg-code-lineager").css("display","none");
		}
		
		// when clicking on a reverse lineage item change the iframe source
		$('#sg-code-lineager-fill a').on("click", function(e){
			e.preventDefault();
			var obj = JSON.stringify( { "path": urlHandler.getFileName($(this).attr("data-patternpartial")) });
			document.getElementById("sg-viewport").contentWindow.postMessage(obj,codeViewer.targetOrigin);
		});
		
		// get the file name of the pattern so we can get the various editions of the code that can show in code view
		var fileName = urlHandler.getFileName(patternPartial);
		
		// request the encoded markup version of the pattern
		var e = new XMLHttpRequest();
		e.onload = this.saveEncoded;
		e.open("GET", fileName.replace(/\.html/,".escaped.html") + "?" + (new Date()).getTime(), true);
		e.send();
		
		// request the mustache markup version of the pattern
		var m = new XMLHttpRequest();
		m.onload = this.saveMustache;
		m.open("GET", fileName.replace(/\.html/,".mustache") + "?" + (new Date()).getTime(), true);
		m.send();
		
		// if css is enabled request the css for the pattern
		if (cssEnabled) {
			var c = new XMLHttpRequest();
			c.onload = this.saveCSS;
			c.open("GET", fileName.replace(/\.html/,".css") + "?" + (new Date()).getTime(), true);
			c.send();
		}
		
		// move the code into view
		codeViewer.slideCode(0);
			
	},
	
	/**
	* toggle the comment pop-up based on a user clicking on the pattern
	* based on the great MDN docs at https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage
	* @param  {Object}      event info
	*/
	receiveIframeMessage: function(event) {
		
		var data = JSON.parse(event.data);
		
		// does the origin sending the message match the current host? if not dev/null the request
		if ((window.location.protocol !== "file:") && (event.origin !== window.location.protocol+"//"+window.location.host)) {
			return;
		}
		
		// if the message contains the codeOverlay attribute act on it as appropriate
		if (data.codeOverlay !== undefined) {
			if (data.codeOverlay === "on") {
				codeViewer.updateCode(data.lineage,data.lineageR,data.codePatternPartial,data.cssEnabled);
			} else {
				codeViewer.slideCode($('#sg-code-container').outerHeight());
			}
		}
		
	}
	
};

// when the document is ready make the codeViewer ready
$(document).ready(function() { codeViewer.onReady(); });
window.addEventListener("message", codeViewer.receiveIframeMessage, false);

// make sure if a new pattern or view-all is loaded that comments are turned on as appropriate
$('#sg-viewport').load(function() {
	if (codeViewer.codeActive) {
		var obj = JSON.stringify({ "codeToggle": "on" });
		document.getElementById('sg-viewport').contentWindow.postMessage(obj,codeViewer.targetOrigin);
	}
});

// when the code panel is open hijack cmd+a so that it only selects the code view
jwerty.key('cmd+a', function (e) {
	if (codeViewer.codeActive) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(document.getElementById("sg-code-fill"));
		selection.removeAllRanges();
		selection.addRange(range);
		return false;
	}
});
