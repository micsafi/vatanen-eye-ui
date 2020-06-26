// node_helper for mami-eye-ui module

var NodeHelper = require("node_helper");

const WebSocket = require('ws');

module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Starting module: " + this.name);

  },

  addBackend: function(backendURL) {
    var self=this;

    console.log("Connecting to the mami-eye backend service: " + backendURL);
    const ws = new WebSocket(backendURL);
    ws.on('open', function open() {
      console.log("WebSocket connection to backend established");
    });

    ws.on('message', function incoming(data) {

      console.log(data);
      cameraData = JSON.parse(data);
      self.sendSocketNotification("UPDATE_CAMERA_DATA", cameraData);
    });

  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    console.log("Receiving notification, type: " + notification + ", payload: " + payload);
    if (notification === "SET_BACKEND_URL") {
      this.addBackend(payload);
      return;
    }
  }
});
