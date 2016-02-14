/* Global App JS */

jQuery(document).ready(function ($) {

  /**
   * Set a cookie for the user's timezone
   * @param timezone
   */
  function setTimezoneCookie(timezone) {
    var date = new Date(2099, 1, 1);
    document.cookie = 'timezone=' + timezone + '; path=/; expires=' + date.toUTCString();
  }

  setTimezoneCookie(jstz.determine().name());

  /**
   * Scroll page to top on refresh
   */
  $(window).on('beforeunload', function () {
    $(this).scrollTop(0);
  });

  /**
   * On load animations
   */
  $(window).load(function () {
    $('header').css({height: 'auto'}).delay(100).velocity({
      top: 0
    }, 1000, 'easeInOutQuint');
    $('footer').css({bottom: '-100px'}).delay(400).velocity({
        bottom: 0
      }, 1000, 'easeInOutQuint',
      function () {
        $(this).css({bottom: 'auto'});
        $('body').css({overflowY: 'auto'});
      });
    $('nav').delay(1000).velocity({
      left: 0
    }, 1500, 'easeInOutQuint');
  });

  /**
   * Set up the text rotator
   */
  $('.rotate').textillate({
    minDisplayTime: 3000,
    in: {effect: 'fadeInUp', shuffle: true},
    out: {effect: 'fadeOutUp', shuffle: true},
    loop: true
  });

  /**
   * Set up the hover actions for the nav menu
   */
  $('nav').hover(navOver, navOut);

  /**
   * The action when the nav is hovered over
   */
  function navOver() {
    if ($(window).outerWidth() >= 767) {
      $('header > .container, footer').velocity({left: '100px'}, 150);
      $('nav').addClass('active').velocity({width: '150px'}, 150);
    }
  }

  /**
   * The action when the nav loses hover
   */
  function navOut() {
    $('header > .container, footer').velocity({left: '0px'}, 150);
    $('nav').removeClass('active').velocity({width: '50px'}, 150);
  }

  /**
   * Binds to clicks on nav menu items to change slides
   */
  $('nav a').on('click', function (event) {
    event.preventDefault();
    var changer = $('.lj-changer');
    var slide = $(this).attr('href');
    var activeSlide = $('.lj-changer > .active');
    if (!changer.hasClass('animating') && !$(slide).is($(activeSlide))) {
      $(changer).addClass('animating');
      $(this).addClass('active').siblings().removeClass('active');
      $(activeSlide).velocity({
        opacity: 0,
        left: '30px'
      }, 350, 'easeInQuint', function () {
        var selSlide = $(slide);
        selSlide.css({opacity: '0', left: '-30px'}).addClass('active').siblings().removeClass('active');
        onDisplaySlide(slide, selSlide);
        $(slide).velocity({opacity: 1, left: '0px'}, 350, 'easeOutQuint', function () {
          $(changer).removeClass('animating');
        });
      });
    }
  });

  /**
   * Called when a slide is selected for display
   *
   * @param selector the href value
   * @param root the root element of the slide
   */
  function onDisplaySlide(selector, root) {
    if (selector == "#pledge") {
      setupPledgeSlide(root);
    }
    if (selector == "#map") {
      setupMapSlide(root)
    }
  }

  var pledgeRootElement;

  /**
   * Sets up bindings on the pledge slide
   * @param root the root element of the pledge slide
   */
  function setupPledgeSlide(root) {
    if (pledgeRootElement) return;
    pledgeRootElement = root;

    setupPledgeAddressAutocomplete(root);
    setupPledgeValidation(root);

    return true;
  }

  var pledgeAddressAutocomplete = null;
  var pledgeAddressData = {};
  var pledgeAddressElement = null;

  /**
   * Sets up the address autocompletion on the pledge slide
   * @param root the root element of the pledge slide
   */
  function setupPledgeAddressAutocomplete(root) {
    pledgeAddressElement = root.find('input[name="address"]');

    pledgeAddressAutocomplete = new google.maps.places.Autocomplete(pledgeAddressElement[0], {types: ['geocode']});
    pledgeAddressAutocomplete.addListener('place_changed', updatePlaceDataFromAddress);

    // try to determine user's location to bound results
    pledgeAddressElement.bind('focus', function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          pledgeAddressAutocomplete.setBounds(circle.getBounds());
        });
      }
    });
  }

  /**
   * Update the selected place data with info from the autocomplete box
   */
  function updatePlaceDataFromAddress() {
    var place = pledgeAddressAutocomplete.getPlace();
    if (place && place.geometry) {
      // the place doesn't change until a new address is selected
      // this makes sure the input is invalid if it doesn't match the old input
      // for the selected place unless the place is changed all together
      var previousId = pledgeAddressData.id;
      var previousValue = pledgeAddressData.value;
      var currentId = place.id;
      var currentValue = pledgeAddressElement.val();
      if (!previousId || !previousValue) {
        pledgeAddressData.id = currentId;
        pledgeAddressData.value = currentValue;
      }
      if (currentValue != previousValue && previousId == currentId) {
        delete pledgeAddressData.latitude;
        delete pledgeAddressData.longitude;
        delete pledgeAddressData.address_components;
      } else {
        pledgeAddressData.id = currentId;
        pledgeAddressData.value = currentValue;
        pledgeAddressData.latitude = place.geometry.location.lat();
        pledgeAddressData.longitude = place.geometry.location.lng();
        pledgeAddressData.address_components = place.address_components;
      }
    }
    validatePledgeAddressField(pledgeAddressElement)
  }

  /**
   * Post the pledge data
   * @param root the root of the pledge element
   */
  function postPledge(root) {
    var data = {
      _token: window.csrfToken,
      name: root.find('input[name="name"]').val(),
      latitude: pledgeAddressData.latitude,
      longitude: pledgeAddressData.longitude,
      comment: root.find('textarea[name="comment"]').val()
    };

    var map = {
      street_number: {key: 'addr_street_number', name_type: 'short_name'},
      route: {key: 'addr_route', name_type: 'long_name'},
      locality: {key: 'addr_locality', name_type: 'long_name'},
      administrative_area_level_2: {key: 'addr_admin_2', name_type: 'short_name'},
      administrative_area_level_1: {key: 'addr_admin_1', name_type: 'short_name'},
      country: {key: 'addr_country', name_type: 'short_name'},
      postal_code: {key: 'addr_postal', name_type: 'long_name'}
    };

    // Get each component of the address from the place details
    // and fill the corresponding data.
    var components = pledgeAddressData.address_components;
    for (var i = 0; i < components.length; i++) {
      var component = components[i];
      var type = component.types[0];
      if (map[type]) {
        var mapper = map[type];
        data[mapper.key] = component[mapper.name_type];
      }
    }

    // send the request
    $.ajax({
      type: "POST",
      url: window.apiBase + '/pledge',
      data: data,
      success: onPostPledgeSuccess,
      error: onPostPledgeError
    });
  }

  /**
   * Called when the pledge request has been successful
   * @param data
   * @param textStatus
   * @param jqXHR
   */
  function onPostPledgeSuccess(data, textStatus, jqXHR) {
    toastr.success('Thanks for your pledge!');
    clearPledgeForm();
    $('nav a[href="#map"]').trigger('click');
  }


  /**
   * Called when the pledge request has resulted in an error
   * @param jqXHR
   * @param textStatus
   * @param errorThrown
   */
  function onPostPledgeError(jqXHR, textStatus, errorThrown) {
    toastr.error('Failed to submit pledge. Please try again later. ' + textStatus);
  }

  /**
   * Clears the pledge form
   */
  function clearPledgeForm() {
    pledgeAddressData = {};
    $.each(pledgeRootElement.find('input, textarea'), function(index, value) {
      setPledgeFieldValidity($(value), null);
      $(value).val('');
    });
    $.each(pledgeRootElement.find('label'), function(index, value) {
      $(value).removeClass('active');
    })
  }


  /**
   * Sets up the input validation on the pledge slide page
   * @param root the root element of the pledge slide
   */
  function setupPledgeValidation(root) {
    // find all of the form fields
    allFields = root.find('input, textarea');
    allLabels = root.find('label');

    // prevent form submissions
    root.find('form').bind('submit', function (e) {
      e.preventDefault();
      allLabels.trigger('click');
      allFields.trigger('click');

      if ($(this).find('.valid').length == 3) {
        postPledge(root);
      }
    });

    // make labels listen for clicks
    allLabels.on('click', function () {
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).next().focus();
      }
    });

    // make all the fields as active
    allFields.on('focus', function () {
      $(this).prev('label').addClass('active');
    });

    // remove validity label if empty
    allFields.on('blur', function () {
      if (!$(this).val()) {
        setPledgeFieldValidity($(this), null);
      }
    });

    // validate the name field
    root.find('input[name="name"]').on('change keyup paste click', function () {
      if (!$(this).val()) {
        setPledgeFieldValidity($(this), false, "Required");
      } else {
        setPledgeFieldValidity($(this), true, "Thanks " + $(this).val() + '!');
      }
    });

    // validate the address field
    root.find('input[name="address"]').on('change keyup paste click', function () {
      updatePlaceDataFromAddress();
    });

    // validate the comment field
    root.find('textarea[name="comment"]').on('change keyup paste click', function () {
      if (!$(this).val()) {
        setPledgeFieldValidity($(this), false, "Required");
      } else {
        setPledgeFieldValidity($(this), true);
      }
    });
  }

  /**
   * Validates the address field
   * @param elem
   */
  function validatePledgeAddressField(elem) {
    if (!elem.val()) {
      setPledgeFieldValidity(elem, false, "Required");
    } else {
      if (pledgeAddressData.latitude && pledgeAddressData.longitude) {
        var display = round(pledgeAddressData.latitude, 3) + '° ' + round(pledgeAddressData.longitude, 3) + '°';
        setPledgeFieldValidity(elem, true, display);
      } else {
        setPledgeFieldValidity(elem, false, "Invalid address");
      }
    }
  }

  /**
   * Round a number
   * @param number
   * @param places number of decimal places
   * @returns {number}
   */
  function round(number, places) {
    return +(Math.round(number + 'e+' + places) + 'e-' + places)
  }

  /**
   * Set the status label on a pledge field
   * @param field
   * @param validity
   * @param message
   */
  function setPledgeFieldValidity(field, validity, message) {
    if (validity == null) {
      field.removeClass('valid').prev('label').children('span').html('');
    } else if (validity) {
      field.addClass('valid').prev('label').children('span').html('<i class="fa fa-check"></i>' + (message ? ' ' + message : ''));
    } else {
      field.removeClass('valid').prev('label').children('span').html('<i class="fa fa-close"></i>' + (message ? ' ' + message : ''));
    }
  }

  var mapSlideElement = false;

  /**
   * Sets up bindings on the map slide
   * @param root the root element of the map slide
   * @returns {boolean}
   */
  function setupMapSlide(root) {
    if (mapSlideElement) return;
    mapSlideElement = root;

    var center = new google.maps.LatLng(46.8541765, -96.8985526);
    var options = {
      'zoom': 13,
      'center': center,
      'mapTypeId': google.maps.MapTypeId.HYBRID
    };

    var map = new google.maps.Map(mapSlideElement.find('#map-container')[0], options);

    var markers = [];
    //for (var i = 0; i < 100; i++) {
    //  var latLng = new google.maps.LatLng(data.photos[i].latitude,
    //    data.photos[i].longitude);
    //  var marker = new google.maps.Marker({'position': latLng});
    //  markers.push(marker);
    //}
    var markerCluster = new MarkerClusterer(map, markers);

    // send the request
    //$.ajax({
    //  type: "POST",
    //  url: window.apiBase + '/pledge',
    //  data: data,
    //  success: onPostPledgeSuccess,
    //  error: onPostPledgeError
    //});

    return true;
  }
});
//# sourceMappingURL=app.js.ee33e8ac.map
