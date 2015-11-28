;(function($, utils) {

    'use strict';

    /**
     * Sticky DOM Element
     *
     * ver 0.1.0
     *
     * (c) Vitalii Omelkin, 2015
     * Licensed under the MIT License
     *
     * @ngInject
     */
    sticky.directive('stickyNavigation', function ($window, $document, $timeout) {
        var $win = $(window);

        /**
         * Check if element is visible within a viewPort
         *
         * @param el
         * @returns {boolean}
         */
        function isElementInViewport(el) {
            var rect = el[0] ? el[0].getBoundingClientRect() : el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= $win.height() &&
                rect.right <= $win.width()
            );
        }

        /**
         * Main directive link function
         *
         * Position of the element is dependent on the other ('parent') element,
         * which disappearing (not entirely, even partly) from a viewport will
         * trigger 'sticking'. In most cases it is a wrapper, but you could provide
         * any element to depend on.
         *
         * @param  {object} scope   Angular scope object
         * @param  {HTMLElement} elem    DOM element
         * @param  {object} attrs   Elem attributes
         * @param  {object} ngModel ngModelController
         * @return {undefined}
         */
        function linkFn(scope, elem, attrs, ngModel) {
            var lastApply = 'old';
            var parentQuery = attrs.stickyNavigation || '';
            var $elem = $(elem);
            var $parent = parentQuery && $(parentQuery).length ? $(parentQuery) : $($elem.parents()[0]);

            // Save original element styles
            var originalStyles = {
                'position': $elem.css('position'),
                'z-index': $elem.css('z-index'),
                'top': $elem.css('top'),
                'bottom': $elem.css('bottom'),
                'width': $elem.css('width')
            };

            // Calculate new position of the element
            var rePosition = function () {
                var rect = $parent[0].getBoundingClientRect();
                var bottomCoordinate = rect.bottom - $window.innerHeight - 1;

                if (!isElementInViewport($parent)) {
                    // apply new positioning
                    $elem.css({
                        'position': 'absolute',
                        'z-index': '1',
                        'top': 'auto',
                        'bottom': (bottomCoordinate < 0 ? 0 : bottomCoordinate),
                        'width': '100%'
                    });
                    lastApply = 'new';
                } else if (lastApply === 'new') {
                    // restore old styles
                    $elem.css(originalStyles);
                    lastApply = 'old';
                }
            };

            // Initial position check/refresh (for the first show up)
            $timeout(rePosition);

            // Custom check/refresh (i.e. for async transactions)
            scope.$watch('refresher', utils.debounce(rePosition));

            // Basic DOM events reaction for check/refresh
            $($window).on('scroll', utils.debounce(rePosition, 20));

            $($window).on('resize', utils.debounce(rePosition, 20));
        }

        return {
            scope: {
                // This prop triggers positioning refreshing on its change
                refresher: '='
            },
            restrict: 'AE',
            link: linkFn
        };
    });
})(jQuery, _);