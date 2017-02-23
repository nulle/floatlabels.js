/**
 * FloatLabels
 * URL: http://clubdesign.github.io/floatlabels.js/
 * Author: Marcus Pohorely ( http://www.clubdesign.at )
 * Copyright: Copyright 2013 / 2014 http://www.clubdesign.at
 *
 * Adapted for bootstrap projects by Michael Levin 2/20/14
 *
 * Customization by Nejc Rodošek 31.8.2015
 * - added support for select2 element placeholder
 */

;(function ( $, window, document, undefined ) {
        var pluginName = "floatlabel",
            defaults = {
                slideInput                      : true,
                labelStartTop                   : '0px',
                labelEndTop                     : '0px',
                transitionDuration              : 0.05,
                transitionEasing                : 'ease-in-out',
                labelClass                      : '',
                focusColor                      : 'rgba(0, 0, 0, 0.35)',
                blurColor                       : 'rgba(0, 0, 0, 0.35)'
            };
        function Plugin ( element, options ) {
            this.$element       = $(element);
            this.settings       = $.extend( {}, defaults, options );
            this.init();
        }
        Plugin.prototype = {
            init: function () {
                var self          = this,
                    settings      = this.settings,
                    transDuration = settings.transitionDuration,
                    transEasing   = settings.transitionEasing,
                    thisElement   = this.$element;
                var animationCss = {
                    '-webkit-transition'            : 'all ' + transDuration + 's ' + transEasing,
                    '-moz-transition'               : 'all ' + transDuration + 's ' + transEasing,
                    '-o-transition'                 : 'all ' + transDuration + 's ' + transEasing,
                    '-ms-transition'                : 'all ' + transDuration + 's ' + transEasing,
                    'transition'                    : 'all ' + transDuration + 's ' + transEasing
                };

               var elementID = thisElement.attr('id');
                if( !elementID ) {
                    elementID = Math.floor( Math.random() * 100 ) + 1;
                    thisElement.attr('id', elementID);
                }

                var placeholderText     = thisElement.attr('placeholder');
                var floatingText        = thisElement.data('label');
                var extraClasses        = thisElement.data('class');
                var tagName             = thisElement.get(0).tagName;

                if( !extraClasses ) { extraClasses = ''; }
                if( !floatingText || floatingText === '' ) { floatingText = placeholderText; }

                if( floatingText ) {
                    thisElement.wrap('<div class="floatlabel-wrapper floatlabel-for-' + tagName.toLowerCase() + '" style="position:relative"></div>');
                    thisElement.before('<label for="' + elementID + '" class="label-floatlabel ' + settings.labelClass + ' ' + extraClasses + '">' + floatingText + '</label>');
                    this.$label = thisElement.prev('label');
                    this.$label.css({
                        'position'                      : 'absolute',
                        'top'                           : settings.labelStartTop,
                        'left'                          : '12px', //thisElement.css('padding-left'),
                        'display'                       : 'none',
                        '-moz-opacity'                  : '0',
                        '-khtml-opacity'                : '0',
                        '-webkit-opacity'               : '0',
                        'opacity'                       : '0',
                        'font-size'                     : '8.5px',
                        'font-weight'                   : 'bold',
                        'z-index'                       :  '9',
                        'color'                         : self.settings.blurColor
                    });

                    thisElement.on('keyup blur change', function( e ) {
                        self.checkValue( e );
                    });
                    thisElement.on('blur', function() { thisElement.prev('label').css({ 'color' : self.settings.blurColor }); });
                    thisElement.on('focus', function() { thisElement.prev('label').css({ 'color' : self.settings.focusColor }); });

                    window.setTimeout( function() {
                        self.$label.css( animationCss );
                        self.$element.css( animationCss );
                    }, 100);
                    this.checkValue();
                }
            },
            checkValue: function( e ) {
                if( e ) {
                    var keyCode = e.keyCode || e.which;
                    if( keyCode === 9 ) { return; }
                }

                var thisElement = this.$element;

                if (!thisElement.val() || !thisElement.val().toString()) {
                    thisElement.data('flout', '0');
                    this.hideLabel();
                } else {
                    thisElement.data('flout', '1');
                    this.showLabel();
                }
            },
            showLabel: function() {
                var self = this;
                self.$label.css({ 'display' : 'block' });
                window.setTimeout(function() {
                    self.$label.css({
                        'top'                           : self.settings.labelEndTop,
                        '-moz-opacity'                  : '1',
                        '-khtml-opacity'                : '1',
                        '-webkit-opacity'               : '1',
                        'opacity'                       : '1'
                    });

                    self.$element.addClass('active-floatlabel');
                    self.$element.parent().parent().find('.select2-selection__rendered').addClass('active-floatlabel');
                }, 50);
            },
            hideLabel: function() {
                var self = this;
                self.$label.css({
                    'top'                           : self.settings.labelStartTop,
                    '-moz-opacity'                  : '0',
                    '-khtml-opacity'                : '0',
                    '-webkit-opacity'               : '0',
                    'opacity'                       : '0'
                });

                self.$element.removeClass('active-floatlabel');
                self.$element.parent().parent().find('.select2-selection__rendered').removeClass('active-floatlabel');
                window.setTimeout(function() {
                    // since transition duration can be relatively long, only hide if still has same setting
                    if (self.$element.data('flout') === '0') {
                        self.$label.css({ 'display' : 'none' });
                    }
                }, self.settings.transitionDuration * 1000);
            }
        };
        $.fn[ pluginName ] = function ( options ) {
            return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
            });
        };
})( jQuery, window, document );
