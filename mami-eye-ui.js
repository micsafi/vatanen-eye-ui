//mami-eye-ui.js

Module.register("mami-eye-ui",{
	// Default module config.
	defaults: {
	},

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);

    // Set backendURL to Helper
    Log.info("Sending backend URL to module helper");
    this.sendSocketNotification("SET_BACKEND_URL", this.config.backendURL);

    this.dataAvailable = false;
    this.cameraData = undefined; //JSON.parse('{"badgetype": {"value": "IBM_Visitor_Badge", "confidence": "1.0"}, "watsonfaces": [{"age": {"score": 0.502411, "min": 18, "max": 24}, "face_location": {"left": 51, "top": 41, "width": 83, "height": 103}, "gender": {"score": 0.970688, "gender": "MALE"}}], "firstname": {"value": "TEEMU", "namecountinfinland": "21759", "namegender": "M", "confidence": "0.84"}, "lastname": {"value": "TARVAINEN", "namecountinfinland": "2867", "confidence": "0.52"}, "watsonclasses": [{"class": "bottle green color", "score": 0.946}, {"class": "garment", "score": 0.693}, {"class": "surgical gown", "type_hierarchy": "/garment/surgical gown", "score": 0.594}, {"class": "shirt", "score": 0.548}, {"class": "T-shirt", "score": 0.546}, {"class": "polo shirt", "type_hierarchy": "/garment/shirt/polo shirt", "score": 0.52}, {"class": "sleeve", "score": 0.5}], "presence": {"confidence": "1.0", "personinfocus": "True", "lastseentimestamp": "2017-09-13 20:20:49", "facewidth": "618", "estimateddistance": "77.67"}}');

  },

	// Override dom generator.
  // TODO: translate() function will fail if value is not found from cameradata
	getDom: function() {


    if (!this.dataAvailable) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = "Odotetaan dataa kameralta";
      wrapper.className = "dimmed light small";
      return wrapper;
    } else if (this.cameraData.presence.personinfocus === "False") {
	  var wrapper = document.createElement("div");
	  wrapper.innerHTML = this.translate("No_person_infocus");
	  wrapper.className = "dimmed light small";
	  return wrapper;
	}

    var table = document.createElement("table");
    table.className = "small";

    // Badge type
    var badgeTypeRow = document.createElement("tr");
    table.appendChild(badgeTypeRow);
    var badgeTypeLabel = document.createElement("td");
    badgeTypeLabel.className = "dimmed small";
    badgeTypeLabel.innerHTML = this.translate("badgetype");
    badgeTypeRow.appendChild(badgeTypeLabel);
    var badgeTypeValue = document.createElement("td");
    badgeTypeValue.className = "value bright small";
		Log.warn("badgetype: " + this.cameraData.badgetype);
    if (this.cameraData.badgetype) {
      badgeTypeValue.innerHTML = this.translate(this.cameraData.badgetype.value);
    } else {
      badgeTypeValue.innerHTML = this.translate("NOT_AVAILABLE");
    }
    badgeTypeRow.appendChild(badgeTypeValue);
    // Gender
    var genderRow = document.createElement("tr");
    table.appendChild(genderRow);
    var genderLabel = document.createElement("td");
    genderLabel.className = "dimmed small";
    genderLabel.innerHTML = this.translate("gender");
    genderRow.appendChild(genderLabel);
    var genderValue = document.createElement("td");
    genderValue.className = "value bright small";
    if (this.cameraData.watsonfaces.length > 0) {
      genderValue.innerHTML = this.translate(this.cameraData.watsonfaces[0].gender.gender);
    } else {
      genderValue.innerHTML = this.translate("NOT_AVAILABLE");
    }
    genderRow.appendChild(genderValue);
    // First name
    var firstnameRow = document.createElement("tr");
    table.appendChild(firstnameRow);
    var firstnameLabel = document.createElement("td");
    firstnameLabel.className = "dimmed small";
    firstnameLabel.innerHTML = this.translate("firstname");
    firstnameRow.appendChild(firstnameLabel);
    var firstnameValue = document.createElement("td");
    firstnameValue.className = "value bright small";
    if (this.cameraData.firstname) {
      firstnameValue.innerHTML = this.cameraData.firstname.value;
    } else {
      firstnameValue.innerHTML = this.translate("NOT_AVAILABLE");
    }
    firstnameRow.appendChild(firstnameValue);
    // Last name
    var lastnameRow = document.createElement("tr");
    table.appendChild(lastnameRow);
    var lastnameLabel = document.createElement("td");
    lastnameLabel.className = "dimmed small";
    lastnameLabel.innerHTML = this.translate("lastname");
    lastnameRow.appendChild(lastnameLabel);
    var lastnameValue = document.createElement("td");
    lastnameValue.className = "value bright small";
    if (this.cameraData.lastname) {
      lastnameValue.innerHTML = this.cameraData.lastname.value;
    } else {
      lastnameValue.innerHTML = this.translate("NOT_AVAILABLE");
    }
    lastnameRow.appendChild(lastnameValue);
    // Age
    var ageRow = document.createElement("tr");
    table.appendChild(ageRow);
    var ageLabel = document.createElement("td");
    ageLabel.className = "dimmed small";
    ageLabel.innerHTML = this.translate("age");
    ageRow.appendChild(ageLabel);
    var ageValue = document.createElement("td");
    ageValue.className = "value bright small";
    if (this.cameraData.watsonfaces.length > 0) {
      ageValue.innerHTML = this.cameraData.watsonfaces[0].age.min + " - " + this.cameraData.watsonfaces[0].age.max;
    } else {
      ageValue.innerHTML = this.translate("NOT_AVAILABLE");
    }
    ageRow.appendChild(ageValue);

    // Recognized classes
    var classes = this.cameraData.watsonclasses;
    for (var i = 0; i < classes.length; i++) {
      var classRow = document.createElement("tr");
      table.appendChild(classRow);
      var classLabel = document.createElement("td");
      classLabel.className = "dimmed small";
      classLabel.innerHTML = this.translate("class");
      classRow.appendChild(classLabel);
      var classValue = document.createElement("td");
      classValue.className = "value bright small";
      classValue.innerHTML = classes[i].class;
      classRow.appendChild(classValue);
    }

    return table;
	},

  socketNotificationReceived: function(notification, payload) {

     Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
     if (notification === "UPDATE_CAMERA_DATA") {

       this.cameraData = payload;
       this.dataAvailable = true;
       this.updateDom(1000);
     }
  },

  getTranslations: function() {
  	return {
  			fi: "fi.json"
  	}
  },

  getStyles: function() {
	return [
		this.file('mami-eye-ui.css'), // this file will be loaded straight from the module folder.
	]
}
});
