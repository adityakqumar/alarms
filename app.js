// Check if notifications are supported
if (!("Notification" in window)) {
    alert("This browser does not support desktop notification.");
  }
  
  // Button click event
  document.getElementById("set-alarm-btn").addEventListener("click", () => {
    getUserLocation();
  });
  
  function getUserLocation() {
    // Request geolocation permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchSunriseTime, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  function fetchSunriseTime(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
  
    // Call the Sunrise-Sunset API
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const sunriseUTC = new Date(data.results.sunrise);
        const alarmTime = new Date(sunriseUTC.getTime() - 30 * 60000); // Subtract 30 minutes
  
        scheduleAlarm(alarmTime);
      })
      .catch(error => {
        console.error("Error fetching sunrise time:", error);
      });
  }
  
  function scheduleAlarm(alarmTime) {
    const currentTime = new Date();
    const timeUntilAlarm = alarmTime - currentTime;
  
    if (timeUntilAlarm > 0) {
      // Set timeout for the alarm
      document.getElementById("status").innerText =
        `Alarm set for ${alarmTime.toLocaleTimeString()}.`;
  
      setTimeout(() => {
        showNotification();
      }, timeUntilAlarm);
    } else {
      alert("The calculated alarm time has already passed for today!");
    }
  }
  
  function showNotification() {
    // Request notification permission if not already granted
    if (Notification.permission === "granted") {
      new Notification("Sunrise Alarm", {
        body: "It's 30 minutes before sunrise!",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Sunrise Alarm", {
            body: "It's 30 minutes before sunrise!",
          });
        }
      });
    }
  }
  
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }
  
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").then(
        registration => {
          console.log("Service Worker registered with scope:", registration.scope);
        },
        err => {
          console.log("Service Worker registration failed:", err);
        }
      );
    });
  }
  