;(function ( $, window, document, undefined ) {
    var plugin_name = "awesomeElevator";

    var defaults = {
        floor_height: 86,
        main_delay: 2000,
        animation: 800,
        $floor_button: null,
        $start: null,
        $elevator_button: null,
        $the_elevator: null
    };

    var elevator = {
        floor_requests: [],
        dir: false,
        dir_up_requests: [],
        dir_down_requests: [],
        current_floor: 1
    };

    function Plugin( element, options ) {
        this.options = $.extend( {}, defaults, options) ;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.floor_button_click();
            this.start_the_journey();
            this.elevator_button_click();
        },

        floor_button_click: function() {
            var instance = this;

            this.options.$floor_button.on("click", function (e) {
                e.preventDefault();

                var $this = $(this),
                    target_floor = $this.closest(".floor").attr("data-floor");

                if ( target_floor != elevator.current_floor ) {
                    $this.closest(".floor").addClass("active");
                    $this.addClass("active");
                    elevator.floor_requests = instance.make_priority_array(elevator.current_floor, target_floor);
                }
            });
        },

        elevator_button_click: function() {
            var instance = this;

            this.options.$elevator_button.on("click", function (e) {
                e.preventDefault();

                var $this = $(this),
                    target_floor = $this.text();

                if ( target_floor != elevator.current_floor ) {
                    $this.addClass("active");
                    elevator.floor_requests = instance.make_priority_array(elevator.current_floor, target_floor);
                }
            });
        },

        // start elevator on button click
        start_the_journey: function() {
            var instance = this;
            this.options.$start.on("click", function (e) {
                e.preventDefault();
                instance.elevator_move(elevator.floor_requests);
                elevator.current_floor = elevator.floor_requests[elevator.floor_requests.length - 1];

                // reset all requests after the journey is done
                elevator.floor_requests = [];
                elevator.dir_up_requests = [];
                elevator.dir_down_requests = [];
                elevator.dir = false;
            });
        },

        // moves the elevator
        elevator_move: function(floor_requests) {
            var new_bottom,
                instance = this;

            $.each(floor_requests, function( index, floor_number ) {
                (function (index) {
                    setTimeout(function () {
                        new_bottom = instance.options.floor_height * (floor_number - 1);

                        instance.options.$the_elevator.animate({ bottom: new_bottom }, {
                            duration: instance.options.animation,
                            start:function() {
                                instance.reset_elevator_status(instance.options.$the_elevator.attr("data-currentlocation"));
                            },
                            complete:function() {
                                instance.options.$the_elevator.attr("data-currentlocation", floor_number);
                                $("#floor"+floor_number+" span").addClass("active");
                                instance.reset_pushed_buttons(floor_number);
                            }
                        });

                    }, instance.options.main_delay * index);
                })(index);

                instance.reset_elevator_status(floor_number);
            });
        },

        /**
         * makes floor priority array.
         * @param current_floor
         * @param request_floor
         * @returns {*[]}
         */
        make_priority_array: function(current_floor, request_floor) {

            if ( request_floor > current_floor ) {
                elevator.dir = ( !elevator.dir ) ? "UP" : elevator.dir;
                if ( !elevator.dir_up_requests.includes(request_floor) )
                    elevator.dir_up_requests.push(request_floor);
            } else {
                elevator.dir = ( !elevator.dir ) ? "DOWN" : elevator.dir;
                if ( !elevator.dir_down_requests.includes(request_floor) )
                    elevator.dir_down_requests.push(request_floor);
            }

            elevator.dir_up_requests.sort(function(a, b) {return a - b;});
            elevator.dir_down_requests.sort(function(a, b) {return b - a;});

            return (elevator.dir == "UP") ? elevator.dir_up_requests.concat(elevator.dir_down_requests) : elevator.dir_down_requests.concat(elevator.dir_up_requests);
        },

        /**
         * reset pushed buttons - floor and elevator
         * @param floor_number
         */
        reset_pushed_buttons: function(floor_number) {
            $("#floors #floor"+floor_number).removeClass("active").find("a").removeClass("active");
            $("#elevator-buttons a.eb"+floor_number).removeClass("active");
        },

        /**
         * the green status
         * @param floor_number
         */
        reset_elevator_status: function(floor_number) {
            $("#floors #floor"+floor_number).find("span").removeClass("active");
        }
    };

    $.fn[plugin_name] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + plugin_name) ) {
                $.data(this, "plugin_" + plugin_name,
                    new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );