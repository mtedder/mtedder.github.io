/**
 * JavaScript functions file for defib.html
 */
		// Note: This example requires that you consent to location sharing when
		// prompted by your browser. If you see the error "The Geolocation service
		// failed.", it means you probably did not give permission for the browser to
		// locate you.
		var displayMap;
		function initMap() {
			displayMap = new google.maps.Map(document
					.getElementById('map-canvas'), {
				center : {
					lat : -34.397,
					lng : 150.644
				},
				zoom : 11
			});

			var infoWindow = new google.maps.InfoWindow({
				map : displayMap
			});

			// Try HTML5 geolocation.
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = {
						lat : position.coords.latitude,
						lng : position.coords.longitude
					};

					infoWindow.setPosition(pos);
					console.log('Location found.');
					infoWindow.setContent('Location found.');
					
					//current location marker
					var marker = new google.maps.Marker({
						position : pos,
						icon : {
							path : google.maps.SymbolPath.CIRCLE,
							scale : 10
						},
						zIndex : 0,
						map : displayMap
					});
					
					displayMap.setCenter(pos);
					getAEDLocations();
				}, function(error) {
					alert('ERROR(' + error.code + '): ' + error.message);
					handleLocationError(true, infoWindow, displayMap
							.getCenter());
				});
			} else {
				// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, displayMap.getCenter());
			}
		}

		function handleLocationError(browserHasGeolocation, infoWindow, pos) {
			infoWindow.setPosition(pos);
			infoWindow
					.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.'
							: 'Error: Your browser doesn\'t support geolocation.');
		}

		// Adds a marker to the map.
		function addMarker(labelTxt, location, map) {
			// Add the marker at the clicked location, and add the next-available label
			// from the array of alphabetical characters.
			var marker = new google.maps.Marker({
				position : location,
				label : labelTxt,
				map : map
			});
		}

		//get AED locatons/data from Parse DB
		function getAEDLocations() {
			//civilla app
			/*Parse.initialize("N30SBfcsxmMVTqrfPMYERJDriGCaYTueb3xpDyW7",
					"0wQNpF0tC4hKs2YyGzMx8RYCt08OsFynDInie8gK");*/

			//my app
			Parse.initialize("PKpRuqxkud8uEvHZYhsQgTG2BIh9UDPVZFuMXVur",
					"8KYuFtW20JbwH9V9RvGi2aF3cxwuGkKd7zZa4YyY");

			Parse.serverURL = 'https://parseapi.back4app.com/'

			var AEDInfo = Parse.Object.extend("AEDLocation");
			var query = new Parse.Query(AEDInfo);
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
								+ object.get('location').longitude + "]");
 */
						/* $('#list').html($('#list').html() + "<p>" + object.get('locationName') + ","
								+ object.get('address') + ","
								+ object.get('city') + ","
								+ object.get('state') + ", ["
								+ object.get('location').latitude + ","
								+ object.get('location').longitude + "]</p>"); */

						/* var myLatLng = {
							lat : object.get('location').latitude,
							lng : object.get('location').longitude
						}; */
						//addMarker(object.get('locationName'), myLatLng, mapX);
						displayCard(object);
					}
				},
				error : function(object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					console.log("data error");
				}
			});
		}

		function displayCard(message) {
			
			var thumbNail = message.get('thumbNail');
			var url;
			if (thumbNail) {//get url
				url = thumbNail.url();
			} else {//if undefined ignore							
				url = "images/notfound.jpg";
			}
			
			var content = "<img src='" + url + "' style='width:100px;height:100px;'>" + '<h5>' + message.get('locationName') + '</h5>'
			+ '<p>' + message.get('address') + '<br>' + message.get('locationDesc') + '</p>';

			var $newCard = $('<section/>');
			$newCard.html(content + "<div class='action'>Action</div>");
			$newCard.addClass('card');
			$newCard.prependTo($('.cards'));

			//var splitString = message.location.split(",");

			var latlng = new google.maps.LatLng({
				lat : message.get('location').latitude,
				lng : message.get('location').longitude
			});

			var infowindow = new google.maps.InfoWindow({
				content : content
			});

			var marker = new google.maps.Marker({
				position : latlng,
				map : displayMap,
				title : message.get('locationName')
			});

			marker.addListener('click', function() {
				infowindow.open(displayMap, marker);
			});

			$('.cards')[0].scrollTop = $('.cards')[0].scrollHeight;
		}