$(document).ready(
  function () {
    // Load the Tasmota devices and populate the device select dropdown
    function loadDevices() {
      $.getJSON("devices.json", function (data) {
        $.each(data, function (i, device) {
          var option = $("<option>");
          option.val(device.id);
          option.text(device.name);
          $("#deviceSelect").append(option);
        });

        // Load the timers for the first device in the list
        loadTimers();
      });
    }

    // Load the timers from the JSON file for the selected device
    function loadTimers() {
      // Get the selected Tasmota device
      var selectedDevice = $("#deviceSelect").val();

      // Load the timers for the selected device
      $.getJSON(selectedDevice + ".json", function (data) {
        // Clear the existing timers
        $("#timers").empty();

        // Loop through the timers
        $.each(data, function (i, timer) {
          // Replace the device name with the selected device
          timer.name = timer.name.replace("Name", selectedDevice);

          // Create the timer element
          var timerElement = $("<div>", { class: "timer" });

          // Add the timer name
          var timerName = $("<div>", { class: "timerName" });
          timerName.text(timer.name);
          timerElement.append(timerName);

          // Add the timer time
          var timerTime = $("<div>", { class: "timerTime" });
          timerTime.text(timer.time);
          timerElement.append(timerTime);

          // Add the timer days
          var timerDays = $("<div>", { class: "timerDays" });

          var days = JSON.parse($("#days").val());
          $.each(days, function (j, day) {
            var dayButton = $("<button>", { class: "dayButton" });
            dayButton.text(day);
            if (timer.days.includes(day)) {
              dayButton.addClass("active");
            }
            dayButton.data("day", day);
            timerDays.append(dayButton);
          });
          timerElement.append(timerDays);

          // Add the timer command
          var timerCommand = $("<div>", { class: "timerCommand" });
          timerCommand.text(timer.command);
          timerElement.append(timerCommand);

          // Add the delete button
          var deleteButton = $("<button>", { class: "deleteTimerButton" });
          deleteButton.text("Delete");
          deleteButton.data("id", timer.id);
          timerElement.append(deleteButton);

          // Add the timer element to the page
          $("#timers").append(timerElement);
        });
      });
    }

    // Add a new timer to the selected device
    function addTimer() {
      // Get the selected Tasmota device
      var selectedDevice = $("#deviceSelect").val();
    }

    // Get the timer data from the input fields
    var timerName = $("#timerName").val();
    var timerTime = $("#timerTime").val();
    var timerDays = [];
    $(".dayButton.active").each(function () {
      timerDays.push($(this).data("day"));
    });
    var timerCommand = $("#timerCommand").val();

    // Generate a unique ID for the new timer
    var id = new Date().getTime();

    // Create the new timer object
    var newTimer = {
      id: id,
      name: timerName,
      time: timerTime,
      days: timerDays,
      command: timerCommand,
    };

    // Load the existing timers for the selected device
    $.getJSON(selectedDevice + ".json", function (data) {
      // Add the new timer to the list
      data.push(newTimer);

      // Save the updated timers to the JSON file
      $.ajax({
        url: selectedDevice + ".json",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
          // Clear the input fields
          $("#timerName").val("");
          $("#timerTime").val("");
          $(".dayButton.active").removeClass("active");
          $("#timerCommand").val("");

          // Reload the timers for the selected device
          loadTimers();
        },
      });
    });
  },

  // Delete a timer from the selected device
  function deleteTimer(id) {
    // Get the selected Tasmota device
    var selectedDevice = $("#deviceSelect").val();

    // Load the existing timers for the selected device
    $.getJSON(selectedDevice + ".json"),
      function (data) {
        // Find the timer with the specified ID
        var index = -1;
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == id) {
            index = i;
            break;
          }
        }

        // If the timer was found, remove it from the list
        if (index > -1) {
          data.splice(index, 1);

          // Save the updated timers to the JSON file
          $.ajax({
            url: selectedDevice + ".json",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
              // Reload the timers for the selected device
              loadTimers();
            },

            error: function (xhr, status, error) {
              console.log("Error removing timer: " + error);
            },
          });
        } else {
          console.log("Timer with ID " + id + " not found.");
        }
      };

    // Attach event listener for the delete button
    $(document).on("click", ".deleteTimerButton", function () {
      var id = $(this).data("id");
      removeTimer(id);
    });

    // Attach event listener for the save button
    $(document).on("click", "#saveTimerButton", function () {
      var timer = {
        id: Date.now(),
        name: $("#timerName").val(),
        time: $("#timerTime").val(),
        days: JSON.parse($("#days").val()),
        command: $("#timerCommand").val(),
      };
      addTimer(timer);
    });

    // Attach event listener for the device select dropdown
    $(document).on("change", "#deviceSelect", function () {
      loadTimers();
    });

    // Load the Tasmota devices and populate the device select dropdown
    loadDevices();
  }
);

$.getJSON("timers.json", function(data) {
  // Loop through the timers
  $.each(data, function(i, timer) {
    // Set the interval to check if the timer should run
    setInterval(function() {
      // Check if the timer is enabled and the current day is one of the active days
      if (timer.enabled && JSON.parse($("#days").val()).includes(getCurrentDay())) {
        // Check if the current time matches the timer time
        if (getCurrentTime() === timer.time) {
          // Execute the command
          executeCommand(timer.command);
      }
      }
      }, 1000);
      });
      });
      
      // Get the current day of the week (e.g. "Monday")
      function getCurrentDay() {
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var date = new Date();
      var dayIndex = date.getDay();
      return days[dayIndex];
      }
      
      // Get the current time in HH:mm format
      function getCurrentTime() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      return padZero(hours) + ":" + padZero(minutes);
      }
      
      // Pad a number with a leading zero if it's less than 10
      function padZero(number) {
      if (number < 10) {
      return "0" + number;
      } else {
      return number;
      }
      }
      
      // Execute a command (replace with your own code)
      function executeCommand(command) {
      console.log("Executing command: " + command);
      }


$.getJSON("timers.json", function(data) {
// Loop through the timers
$.each(data, function(i, timer) {
  // Set the interval to check if the timer should run
  setInterval(function() {
    // Check if the timer is enabled and the current day is one of the active days
    if (timer.enabled && timer.days.includes(getCurrentDay())) {
      // Check if the current time matches the timer time
      if (getCurrentTime() === timer.time) {
        // Execute the command
        executeCommand(timer.command);
      }
    }
  }, 1000);
});
});

// Get the current day of the week (e.g. "Monday")
function getCurrentDay() {
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var date = new Date();
return days[date.getDay()];
}

// Get the current time in HH:MM format (e.g. "12:30")
function getCurrentTime() {
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
if (hours < 10) {
hours = "0" + hours;
}
if (minutes < 10) {
minutes = "0" + minutes;
}
return hours + ":" + minutes;
}

// Execute the Tasmota command
function executeCommand(command) {
// Use the Tasmota API to send the command
$.get("http://192.168.1.245/cm?cmnd=" + command);
}
