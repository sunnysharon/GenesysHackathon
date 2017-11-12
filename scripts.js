options = {

    // Required. Called when a user selects an item in the Chooser.
    success: function(files) {
    	      files.forEach(function(file) {
    	      	add_link_to_list(file);
    	      	//authenticate(file);
        		console.log(file);
      });
    },

    cancel: function() {
    },
    linkType: "direct", // or "direct"
    multiselect: true, // or true
    //extensions: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
};

var button = Dropbox.createChooseButton(options);
document.getElementById("dropbox-container").appendChild(button);
const platformClient = require('platformClient');
var client;
var destURL;

function add_img_to_list(file) {
  var li  = document.createElement('li');
  var a   = document.createElement('a');
  a.href = file.link;
  var img = new Image();
  var src = file.thumbnailLink;
  src = src.replace("bounding_box=75", "bounding_box=256");
  src = src.replace("mode=fit", "mode=crop");
  img.src = src;
  img.className = "th"
  document.getElementById("img_list").appendChild(li).appendChild(a).appendChild(img);
}

function add_link_to_list(file) {
  var node = document.createElement("LI");
  var textnode = document.createTextNode(file.link); 
  node.appendChild(textnode)
  document.getElementById("img_list").appendChild(node);
}


function authenticate(file){
	client = platformClient.ApiClient.instance;
	client.loginImplicitGrant('3f3a804c-a0de-4f3d-bff7-41a4de3cecff', 'https://localhost:3000')
	  .then(function() {
		console.log('authenticated', arguments);
	    // Do authenticated things
	    do_post(file);

	  })
	  .catch(function(response) {
		console.log("ERR LEVEL 1")
	    //console.log(`${response.status} - ${response.error.message}`);
	    console.log(response.error);
	  });
}

function do_post(file){
	
	platformClient = require('platformClient');
	var apiInstance = new platformClient.ContentManagementApi();
	console.log("got to");
	var body = {
		"name": file.name,
		  "workspace": {
		    "id": "c01995ca-8db9-4ed0-8ed4-3fc41b946569"
		  },
		  "tags": [],
	}; // Object | Document
	var opts = {};
	apiInstance.postContentmanagementDocuments(body, opts)
	  .then(function(data) {
	    console.log(`postContentmanagementDocuments success! data: ${JSON.stringify(data, null, 2)}`);
		destURL = data.uploadDestinationUri
		do_post_helper(file);
	  })
	  .catch(function(error) {
		console.log("ERR LEVEL 2")
		console.log('There was a failure calling postContentmanagementDocuments');
	    console.error(error);
	  });
}


function do_post_helper(file){


	console.log(destURL)
	var token = "Bearer "+client.authentications["PureCloud Auth"].accessToken
	console.log("token")

	console.log(token)


    var body = {
	"name": "somename",
	"filename": "ExampleUpload.txt",
	"file contents": "This is an example file body with one line of text for upload.",
	"Content-Type": "text/plain"
	};




	var xhr = new XMLHttpRequest();
	xhr.open("POST", destURL, true);
	xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=A4Q9L5049cRQj9hx8FK8I7bep3YXSsN0hTNa");
	xhr.setRequestHeader("Authorization", token);
	xhr.send(body);

}

