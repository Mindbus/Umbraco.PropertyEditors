angular.module("umbraco").controller("Mindbus.GMapsPropertyEditorController",
      function ($rootScope, $scope, notificationsService, dialogService, assetsService) {

          var apiKey = null; //AIzaSyA2gkk0TPyIEcmpYRtm-WS_jpUs8YVJUYY sample key
          var marker;
          var map;
          var geocoder;

          if ($scope.model.config.googleApiKey) {
              apiKey = $scope.model.config.googleApiKey;
          }

          assetsService.loadJs('http://www.google.com/jsapi')
              .then(function () {
                  google.load("maps", "3",
                    {
                        callback: initMap,
                        other_params: "sensor=false&key=" + apiKey
                    });
              });

          function initMap() {
              //Google maps is available and all components are ready to use.
              //notificationsService.warning("GMaps", "Started initMap()");

              if ($scope.model.value === null || $scope.model.value === '') {
                  $scope.model.value = $scope.model.config.startingPoint;
              }

              var valueArray = $scope.model.value.split(',');
              var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);

              //notificationsService.warning("GMaps", "Latitude=" + valueArray[0]);
              //notificationsService.warning("GMaps", "Longitude=" + valueArray[1]);
              
              map = new google.maps.Map(
                    document.getElementById($scope.model.alias + '_map'),
                    {
                        zoom: 12,
                        minZoom: 3,
                        center: latLng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

              marker = new google.maps.Marker({
                  map: map,
                  position: latLng,
                  draggable: true
              });
              map.setCenter(latLng);
              //notificationsService.warning("GMaps", "Finished initMap()");

              geocoder = new google.maps.Geocoder();
              google.maps.event.addListener(marker, "dragend", function (e) {
                  var newLat = marker.getPosition().lat();
                  var newLng = marker.getPosition().lng();

                  if (newLat > 85 || newLat < -85) {
                      notificationsService.error("Out of bounds");
                      return;
                  }

                  //set the model value
                  $scope.model.value = newLat + "," + newLng;
              });

              $('a[data-toggle="tab"]').on('shown', function (e) {
                  google.maps.event.trigger(map, 'resize');
              });

              google.maps.event.addListener(map, 'dblclick', function (e) {
                  // if you don't do this, the map will zoom in
                  e.stop();

                  var newLat = e.latLng.lat();
                  var newLng = e.latLng.lng();

                  if (newLat > 85 || newLat < -85) {
                      notificationsService.error("Out of bounds");
                      return;
                  }

                  //set the model value
                  $scope.model.value = newLat + "," + newLng;

                  return false;
              });

          }

          function codeLatLng(latLng, geocoder) {
              geocoder.geocode({ 'latLng': latLng },
                  function (results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                          var location = results[0].formatted_address;
                          $rootScope.$apply(function () {
                              notificationsService.success("Location set to: ", location);
                          });
                      } else {
                          notificationsService.error("Location cleared");
                      }
                  });
          }

          $scope.$watch('model.value', function (newValue, oldValue) {
              if (typeof (google) == "undefined") {
                  return;
              }
              var valueArray = newValue.split(',');
              var latLng = new google.maps.LatLng(valueArray[0], valueArray[1]);
              marker.setPosition(latLng);
              map.setCenter(latLng);
              codeLatLng(latLng, geocoder);
          });

      });