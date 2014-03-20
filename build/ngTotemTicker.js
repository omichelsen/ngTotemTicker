(function () {

    'use strict';

    var ngTotemTicker = angular.module('totemticker', []);

    ngTotemTicker.directive('ngTotemTicker', ['$window', '$rootScope', '$timeout',
        function ($window, $rootScope, $timeout) {

            var defaultOptions = {
                /* ID of next button or link */
                next: null,
                /* ID of previous button or link */
                previous: null,
                /* ID of stop button or link */
                stop: null,
                /* ID of start button or link */
                start: null,
                /* Height of each ticker row in PX. Should be uniform. */
                rowHeight: '100px',
                /* Speed of transition animation in milliseconds */
                speed: 800,
                /* Time between change in milliseconds */
                interval: 4000,
                /* Integer for how many items to display at once. Resizes height accordingly (OPTIONAL) */
                maxItems: null,
                /* If set to true, the ticker will stop on mouseover */
                mousestop: false,
                /* Direction that list will scroll */
                direction: 'down',
            };

            var directiveObj = {
                replace: true,
                restrict: 'E',
                link: function (scope, element, attrs) {

                    //Define the DOM elements
                    var el = element;
                    var $el = $(element);

                    var options = $.extend({}, defaultOptions, attrs.options),
                        ticker = null;

                    var init = function () {

                        //Adjust the height of ticker if specified
                        format();

                        //Start the ticker
                        start();
                    };

                    var start = function () {

                        //Clear out any existing interval
                        $timeout(ticker);

                        if (options.direction == 'up') {
                            //If the direction has been set to up
                            (function loop() {
                                ticker = $timeout(function () {

                                    $el.find('li:last').detach().prependTo($el).css('marginTop', '-' + options.rowHeight);

                                    // base.$el.find('li:first').css({
                                    //     marginTop: '0px',
                                    // });

                                    loop();

                                }, options.interval);
                            })();
                        } else {
                            //Otherwise, run the default of down
                            (function loop() {
                                ticker = setTimeout(function () {

                                    var elmItem = $el.find('li:first');

                                    var elmClone = elmItem.clone();
                                    elmClone.css('marginTop', '0');
                                    elmClone.appendTo(base.$el);

                                    elmItem.css({
                                        marginTop: '-' + options.rowHeight,
                                    });

                                    elmItem.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                                        elmItem.remove();
                                        loop();
                                    });

                                }, options.interval);
                            })();
                        }
                    };

                    var reset = function () {
                        stop();
                        start();
                    };

                    var stop = function () {
                        $timeout.cancel(ticker);
                    };

                    var format = function () {

                        if (typeof (options.maxItems) != 'undefined' && options.maxItems != null) {

                            //Remove units of measurement (Should expand to cover EM and % later)
                            var strippedHeight = options.rowHeight.replace(/px/i, '');
                            var tickerHeight = strippedHeight * options.maxItems;

                            $el.css({
                                height: tickerHeight + 'px',
                                overflow: 'hidden',
                            });

                        } else {
                            //No heights were specified, so just doublecheck overflow = hidden
                            $el.css({
                                overflow: 'hidden',
                            });
                        }

                    };

                    // Start/stop semaphore
                    scope.$watch('stop', function (newValue) {
                        newValue ? stop() : start();
                    });

                    //Previous Button
                    if (typeof (options.previous) != 'undefined' && options.previous != null) {
                        $(options.previous).click(function () {
                            $el.find('li:last').detach().prependTo($el).css('marginTop', '-' + options.rowHeight);
                            $el.find('li:first').animate({
                                marginTop: '0px',
                            }, options.speed, function () {
                                reset();
                            });
                            return false;
                        });
                    }

                    //Next Button
                    if (typeof (options.next) != 'undefined' && options.next != null) {
                        $(options.next).click(function () {
                            $el.find('li:first').animate({
                                marginTop: '-' + options.rowHeight,
                            }, options.speed, function () {
                                $(this).detach().css('marginTop', '0px').appendTo($el);
                                reset();
                            });
                            return false;
                        });
                    }

                    //Stop on mouse hover
                    if (options.mousestop) {
                        $el.mouseenter(function () {
                            stop();
                        }).mouseleave(function () {
                            start();
                        });
                    }

                    scope.$on('$destroy', function () {
                        stop();
                    });
                },
                template: '<div class="ngTotemTicker"></div>'
            };
            return directiveObj;
        }
    ]);

})();