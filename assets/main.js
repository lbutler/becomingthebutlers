// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

    function init() {
        setDaysToWedding()
        checkIfOpenRSVP()

        // Basic options for a simple Google Map
        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 15,
            disableDefaultUI: true,
            // The latitude and longitude to center the map (always required)
            center: new google.maps.LatLng(43.708567,-79.389672), // New York
            // How you would like to style the map. 
            // This is where you would paste any style found on Snazzy Maps.
            styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
        };
        // Get the HTML DOM element that will contain your map 
        // We are using a div with id="map" seen below in the <body>
        var mapElement = document.getElementById('map');
        // Create the Google Map using our element and options defined above
        var map = new google.maps.Map(mapElement, mapOptions);
        // Let's also add a marker while we're at it


        var bedMarker = {
            url: '/assets/img/bedmarker.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(34, 43),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(22, 43)
          };

        var heartMarker = {
            url: '/assets/img/heartmarker.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(34, 43),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 23)
          };



        var venue = new google.maps.Marker({
            position: new google.maps.LatLng(43.707967, -79.389672),
            map: map,
            icon: heartMarker
        });
        var hotel = new google.maps.Marker({
            position: new google.maps.LatLng(43.708917, -79.390686),
            map: map,
            icon: bedMarker
        });

    }

    function setDaysToWedding() {

        var rsvpSent = getCookie('rsvpSent');
        var days = Math.floor(Math.abs(((new Date(2018,09,20)).getTime() - (new Date).getTime() ) / (24*60*60*1000)))
        

        if (rsvpSent != 'true' && days > 27 ) {
            $("#daysToWedding").text(days)
            $("#rsvp-alert").show()
            daysToWedding
        }
    }

    function checkIfOpenRSVP() {


        var rsvpOpen = getCookie('rsvpOpen');

        if (rsvpOpen) {
            $('#myModal').modal('show');
            eraseCookie('rsvpOpen');
        }
    }

    function postToGoogle() {

        setCookie('rsvpSent',true,100);

        $('#submitToGoogle').prop('disabled', true);
        $('#spinner').show();
        $('#rsvpForm').hide();

        var field1 = $("input[type='radio'][name='optionsRadios']:checked").val();
        var field2 = $('#guestNames').val();
        var field3 = $('#dietary').val();
        var field4 = $('#songRequest').val();
     
        $.ajax({
          url: "https://docs.google.com/forms/d/e/1FAIpQLSfQLQAw7xe0NeB6histItw_5mWyLnLEssA7_LlXnflFvPOZjQ/formResponse",
          data: {
            "entry.877086558": field1,
            "entry.559352220": field2,
            "entry.1751303409": field3,
            "entry.795203302":field4
          },
          type: "POST",
          dataType: "xml",
          statusCode: {
            0: function() {
                $("#rsvp-alert").hide()
                $('#myModal').modal('hide');
            },
            200: function() {
                console.log("Return 200")
            }
          }
        });
      }


      function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function eraseCookie(name) {   
        document.cookie = name+'=; Max-Age=-99999999;';  
    }