// schedule starts a 9AM and ends at 5PM - 9 items.
var schedule;

var timeStates = [ "past", "present", "future" ];

var saveSchedule = function() {
	localStorage.setItem("plannerDate", moment().format("MM/DD/YYYY"));
	localStorage.setItem("plannerTasks", JSON.stringify(schedule));
}

var loadSchedule = function() {
	var scheduleBlock = $("#scheduleBlock");
	var plannerDate = moment(localStorage.getItem("plannerDate"), "MM/DD/YYYY");
	var curTime = moment(9, "HH");

	// Don't keep our shedule if it's old.
	if (plannerDate.isBefore(curTime, "day")) {
		schedule = [];
		saveSchedule(); // Also force localStorage to reset.
	}
	else
		schedule = JSON.parse(localStorage.getItem("plannerTasks")) || [];
		

	for (var i = 0; i < 9; i++) {
		var rowEl = $("<div>").addClass("row");
		var timeEl = $("<div>").addClass("col-lg-1 p-3 text-right hour").attr("data-slot-time", curTime.format("hA")).text(curTime.format("hA"));
		var descEl = $("<div>").addClass("col-11 col-lg-10 p-0").attr("data-slot-id", i);
		var taskEl = $("<p>").addClass("m-3 h-50").text(schedule[i]);
		var saveEl = $("<div>").addClass("col-1 saveBtn")
					.append("<span>").addClass("oi oi-box"); // TODO - Align the icon in the middle of the button somehow!

		descEl.append(taskEl);
		rowEl.append(timeEl).append(descEl).append(saveEl);
		scheduleBlock.append(rowEl);

		curTime.add(1, "h");
	}

	setTimeFormatting();
}

var setTimeFormatting = function() {
	var curState = 0;
	var curTime = moment(9, "HH");
	var timeNow = moment();

	// today starts at hour 9, keep going through
	while (curTime.hour() <= 17) {
		if (curTime.isBefore(timeNow, "hour"))
			curState = 0;
		else if (curTime.isAfter(timeNow, "hour"))
			curState = 2;
		else
			curState = 1;
		
		$("div[data-slot-time = '" + curTime.format("hA") + "'] + div")
			.removeClass((timeStates[curState] + 1) % timeStates.length)
			.removeClass((timeStates[curState] + 2) % timeStates.length)
			.addClass(timeStates[curState]);

		curTime.add(1, "h");
	}
}

// Clicked on a time slot.
$("#scheduleBlock").on("click", "p", function() {
	var text = $(this)
    	.text()
		.trim();

	$(this).children().addClass("d-none");
  
	var textInput = $("<textarea>")
    	.addClass("w-100 h-100")
    	.val(text);
  
	$(this).replaceWith(textInput);
	textInput.trigger("focus");
});

// Stopped editing a time slot.
$("#scheduleBlock").on("blur", "textarea", function(event) {
	var dataId = parseInt($(this).parent().attr("data-slot-id"));

	// Short timer before clearing  our data, so the save button can grab it if needed.
	setTimeout(stopEditing, 100, dataId);
});

var stopEditing = function(dataId) {
	if (dataId !== NaN) {
		var curTextArea = $("div[data-slot-id='" + dataId + "'] textarea");

		if (curTextArea) {
			console.log("Clearing item " + dataId);
			var taskEl = $("<p>").addClass("m-3 h-50").text(schedule[dataId]);
			(curTextArea).replaceWith(taskEl);
		}
	}
}

// Clicked on a time slot's save button.
$("#scheduleBlock").on("click", ".saveBtn", function(event) {
	var descDiv = $(this).prev();
	var dataId = parseInt(descDiv.attr("data-slot-id"));

	if (dataId !== NaN) {
		var textArea = descDiv.children("textarea");

		if (textArea) {
			schedule[dataId] = textArea.val();
			stopEditing(dataId);
			saveSchedule();
		}
	}
});

$("#currentDay").text(moment().format("dddd, MMMM Do"));
loadSchedule();
setInterval(setTimeFormatting, 300000); // Update time formatting every 5 minutes.