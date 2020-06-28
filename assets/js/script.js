// schedule starts a 9AM and ends at 5PM - 9 items?
var today = moment(9, "HH");
var schedule;

var taskStates = [ "past", "present", "future" ];

var saveSchedule = function() {
	localStorage.setItem("plannerDate", today.format("MM/DD/YYYY"));
	localStorage.setItem("plannerTasks", JSON.stringify(schedule));
}

var loadSchedule = function() {
	var scheduleBlock = $("#scheduleBlock");
	var plannerDate = moment(localStorage.getItem("plannerDate"));
	var curTime = moment(today);

	if (plannerDate.isSame(today, "day"))
		schedule = JSON.parse(localStorage.getItem("plannerTasks")) || [];
	else
		schedule = [];

	for (var i = 0; i < 9; i++) {
		var rowEl = $("<div>").addClass("row");
		var timeEl = $("<div>").addClass("col-lg-1 hour").attr("data-task-time", curTime.format("hA")).text(curTime.format("hA"));
		var descEl = $("<div>").addClass("col-11 col-lg-10").text(schedule[i]);
		var saveEl = $("<div>").addClass("col-1 saveBtn").text("TODO");

		rowEl.append(timeEl).append(descEl).append(saveEl);
		scheduleBlock.append(rowEl);

		curTime.add(1, "h");
	}

	setTimeFormatting();
}

var setTimeFormatting = function() {
	var curState = 0;
	var curTime = moment(today);
	var timeNow = moment();

	// today starts at hour 9, keep going through
	while (curTime.hour() <= 17) {
		if (curTime.isBefore(timeNow, "hour"))
			curState = 0;
		else if (curTime.isAfter(timeNow, "hour"))
			curState = 2;
		else
			curState = 1;
		
		$("div[data-task-time = '" + curTime.format("hA") + "'] + div")
			.removeClass((taskStates[curState] + 1) % taskStates.length)
			.removeClass((taskStates[curState] + 2) % taskStates.length)
			.addClass(taskStates[curState]);

		curTime.add(1, "h");
	}
}

$("#currentDay").text(today.format("dddd, MMMM Do"));
loadSchedule();
setInterval(setTimeFormatting, 300000); // Update time formatting every 5 minutes.