/**
 * JavaScript functions file for share.html
 */

		//my app
		Parse.initialize("PKpRuqxkud8uEvHZYhsQgTG2BIh9UDPVZFuMXVur",
				"8KYuFtW20JbwH9V9RvGi2aF3cxwuGkKd7zZa4YyY");

		Parse.serverURL = 'https://parseapi.back4app.com/';
				
		//populate AED location drop down list
		getAEDLocations();
		/*
		 *Get users current location
		 **/
		function getLocation() {
			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(showPosition,
						function(error) {
							if (error.code == 1) {
								alert('Y U NO GIVE LOCATION?');
							}
						});
			} else {
				x.innerHTML = "Geolocation is not supported by this browser.";
			}
		}
		
		/*
		* Get location data for AED location selected in the locations drop down
		*/
		function getAedLocData(){
			var selectDropDown = document.getElementById("aeds");//get select dropdown
			var locationID = selectDropDown.value;
			//console.log(locationID);
			/*Parse.initialize("PKpRuqxkud8uEvHZYhsQgTG2BIh9UDPVZFuMXVur",
			"8KYuFtW20JbwH9V9RvGi2aF3cxwuGkKd7zZa4YyY");

			Parse.serverURL = 'https://parseapi.back4app.com/'*/

			var AEDInfo = Parse.Object.extend("AEDLocation");
			var query = new Parse.Query(AEDInfo);
			
			query.get(locationID, {
				  success: function(results) {						
					  populateForm(results);				   			
				  },
				  error: function(object, error) {
				    // The object was not retrieved successfully.
				    // error is a Parse.Error with an error code and message.
					  console.log(error);
				  }
				});
			
		}
		
		  /*
		  * Populate form fields
		  */
		  function populateForm(data){				 
			  //use jquery selectors
			$('#locname').val(data.get('locationName'));
			$('#locdesc').val(data.get('locationDesc'));
			$('#typeOfAed').val(data.get('typeOfAED'));
			$('#typeOfBuilding').val(data.get('typeOfBuilding'));
			$('#address').val(data.get('address'));
			$('#city').val(data.get('city'));
			$('#state').val(data.get('state'));
			$('#lat').val(data.get('location').latitude);
			$('#lng').val(data.get('location').longitude);				
			$('#show-picture').attr('src', data.get('thumbNail').url());//force user to upload a file						
		  }
		
		//get AED locatons/data from Parse DB
		function getAEDLocations() {
			//civilla app
			/*Parse.initialize("N30SBfcsxmMVTqrfPMYERJDriGCaYTueb3xpDyW7",
					"0wQNpF0tC4hKs2YyGzMx8RYCt08OsFynDInie8gK");*/

			//my app
			/*Parse.initialize("PKpRuqxkud8uEvHZYhsQgTG2BIh9UDPVZFuMXVur",
					"8KYuFtW20JbwH9V9RvGi2aF3cxwuGkKd7zZa4YyY");

			Parse.serverURL = 'https://parseapi.back4app.com/'*/

			var AEDInfo = Parse.Object.extend("AEDLocation");
			var query = new Parse.Query(AEDInfo);
			var selectDropDown = document.getElementById("aeds");//get select dropdown
			//clear select drop down
			for(o in selectDropDown.options){
				selectDropDown.options.remove(0);
			}
			
			query.find({
				success : function(results) {
					// The object was retrieved successfully.
					// Do something with the returned Parse.Object values
					for (var i = 0; i < results.length; i++) {
						var object = results[i];
						var thumbNail = object.get('thumbNail');
						var url;
						if (thumbNail) {//get url
							url = thumbNail.url();
						} else {//if undefined ignore							
							url = "";
						}
						/* console.log(object.id + ' - '
								+ object.get('locationName') + ","
								+ object.get('address') + ","
								+ object.get('city') + ","
								+ object.get('state') + ","
								+ object.get('typeOfBuilding') + "," + url
								+ "," + object.get('locationDesc') + "["
								+ object.get('location').latitude + ","
								+ object.get('location').longitude + "]");	 */					
															 
							  var option = document.createElement("option");
							  option.text = object.get('locationName');
							  option.value = object.id;//itme id
							  selectDropDown.add(option);//add to drop down						
					}
				},
				error : function(object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					console.log("data error");
				}
			});
		}		

		/*
		 * Display location results
		 **/
		function showPosition(position) {
			/* reportedData.location = position.coords.latitude + ", "
					+ position.coords.longitude; */
			$("#lat").val(position.coords.latitude);
			$("#lng").val(position.coords.longitude);			
		}
		/*
		 * Submit defib data update to DB
		 **/
		function updateData(){
			var selectDropDown = document.getElementById("aeds");//get select dropdown
			var aedsId = selectDropDown.value;			
			
			var ShareData = Parse.Object.extend("AEDLocation");
			var shareData = new ShareData();			
			
			//get field values
			var locName = $("#locname").val();
			var locdesc = $("#locdesc").val();
			var typeOfAed = $("#typeOfAed").val();
			var typeOfBuilding = $("#typeOfBuilding").val();
			var address = $("#address").val();
			var city = $("#city").val();
			var state = $("#state").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();
			//Create geopoint for parse upload
			var point = new Parse.GeoPoint({
				latitude : lat,
				longitude : lng
			});

		
			// get photo image
			var fileUploadControl = $("#take-picture")[0];
			var parseFile;
			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var name = "image.png";
		
				parseFile = new Parse.File(name, file);				
				
				parseFile.save().then(
								function() {									
									// The file has been saved to Parse.
									console.log('The image file has been saved to Parse.');
									//shareData.set("thumbNail", parseFile);//add image only if present	
									
									shareData.save({
										objectId:aedsId, 
										locationName : locName,
										locationDesc : locdesc,
										typeOfAED : typeOfAed,
										typeOfBuilding : typeOfBuilding,
										address : address,
										city : city,
										state : state,
										location : point,
										thumbNail:parseFile
										}, {
										success: function(results) {
										// The save was successful.
											console.log("The update was successful:");											
											getAEDLocations();// refresh aed list drop down list
										},
										error: function(results, error) {
											console.log("The update failed:");
										// The save failed.  Error is an instance of Parse.Error.
										}
										});			
								},
								function(error) {
									// The file either could not be read, or could not be saved to Parse.
									console.log('The file either could not be read, or could not be saved to Parse.');
								});
			} else {//save without picture
				//console.log("No PIC save case");
				
				shareData.save({
					objectId:aedsId, 
					locationName : locName,
					locationDesc : locdesc,
					typeOfAED : typeOfAed,
					typeOfBuilding : typeOfBuilding,
					address : address,
					city : city,
					state : state,
					location : point
					}, {
					success: function(results) {
					// The save was successful.
						console.log("The update was successful:");						
						getAEDLocations();// refresh aed list drop down list
					},
					error: function(results, error) {
						console.log("The update failed:");
					// The save failed.  Error is an instance of Parse.Error.
					}
					});								
			}
		}

		/*
		 * Submit data to parse DB
		 **/
		function save() {
			//(applicationId, javaScriptKey)
			//civilla app
			/* Parse.initialize("N30SBfcsxmMVTqrfPMYERJDriGCaYTueb3xpDyW7",
					"0wQNpF0tC4hKs2YyGzMx8RYCt08OsFynDInie8gK"); */

			var locName = $("#locname").val();
			var locdesc = $("#locdesc").val();
			var typeOfAed = $("#typeOfAed").val();
			var typeOfBuilding = $("#typeOfBuilding").val();
			var address = $("#address").val();
			var city = $("#city").val();
			var state = $("#state").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();
			//Create geopoint for parse upload
			var point = new Parse.GeoPoint({
				latitude : lat,
				longitude : lng
			});

			var ShareData = Parse.Object.extend("AEDLocation");
			var shareData = new ShareData();
			
			//set values			
			//get photo image
			var fileUploadControl = $("#take-picture")[0];
			var parseFile;
			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var name = "image.png";

				parseFile = new Parse.File(name, file);

				parseFile.save().then(
					function() {
						// The file has been saved to Parse.
						console.log('The image file has been saved to Parse.');
						shareData.set("thumbNail", parseFile);//add image only if present	
						
						//save complete object operation
						shareData.save({
							state : state,
							city : city,
							location : point,
							address : address,
							locationName : locName,
							locationDesc : locdesc,
							typeOfAED : typeOfAed,
							typeOfBuilding : typeOfBuilding							
							}, {
							success : function(shareData) {
								// The object was saved successfully.
								//alert('New object created with objectId: ' + shareData.id);
								console.log('New object created with objectId: ');
							},
							error : function(shareData, error) {
								// The save failed.
								// error is a Parse.Error with an error code and message.
								alert('Failed to create new object, with error code: ' + error.message + "," + shareData.get("locationName"));
							}
						});
					},
					function(error) {
						// The file either could not be read, or could not be saved to Parse.
						console.log('The file either could not be read, or could not be saved to Parse.');
					});
			}else{//save without picture
				//console.log("No PIC save case");
				//save complete object operation
				shareData.save({
					state : state,
					city : city,
					location : point,
					address : address,
					locationName : locName,
					locationDesc : locdesc,
					typeOfAED : typeOfAed,
					typeOfBuilding : typeOfBuilding							
					}, {
					success : function(shareData) {
						// The object was saved successfully.
						//alert('New object created with objectId: ' + shareData.id);
						//console.log('New object created with objectId: ' + shareData.id);
					},
					error : function(shareData, error) {
						// The save failed.
						// error is a Parse.Error with an error code and message.
						alert('Failed to create new object, with error code: '
								+ error.message + "," + shareData.get("locationName"));
					}
				});
			}				
		};