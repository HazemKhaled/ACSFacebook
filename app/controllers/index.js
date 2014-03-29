var fb = require("facebook"), Cloud = require("ti.cloud");

fb.appid = Ti.App.Properties.getString("ti.facebook.appid");

// set fb permissions
fb.permissions = ["publish_stream"];

function doClick(e) {
	if (!fb.getLoggedIn()) {
		fb.authorize();
	}
}

fb.addEventListener("login", function(efb) {
	if (efb.success) {

		Cloud.SocialIntegrations.externalAccountLogin({
			type : "facebook",
			token : fb.getAccessToken()
		}, function(e) {
			if (e.success) {
				var user = e.users[0];
				Ti.API.info("User = " + JSON.stringify(user));
				Ti.API.info("FbInfo = " + JSON.stringify(efb.data));
				Ti.App.Properties.setString("currentUserId", user.id);
				alert("Success: " + "id: " + user.id + "\\n" + "first name: " + user.first_name + "\\n" + "last name: " + user.last_name);

				Cloud.Users.update({
					email : efb.data.email,
					username : efb.data.username,
					//photo : "http://graph.facebook.com/" + efb.data.id + "/picture",
					custom_fields : efb.data
				}, function(eu) {
					Ti.API.info("update = " + JSON.stringify(eu));
				});
			} else {
				alert("Error: " + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	} else if (efb.error) {
		alert("Error = " + efb.error);
	} else if (efb.cancelled) {
		alert("Canceld");
	}
});

$.index.open();
