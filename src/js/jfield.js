/**
 * Using jQuery to do some field stuff.
 */
var jFieldDefaults = {
    text: {
        attr: {
            class: 'jtext',
            placeholder: '',
        },
    },
    number: {
        attr: {
            class: 'jnumber',
            min: -1000,
            max: 1000,
            step: 1,
        },
    },
    checkbox: {
        attr: {
            class: 'jcheckbox',
        },
    },
    radio: {
        attr: {
            wrapper: {
                class: 'jradio',
            }, 
            input: {
                checked: false,
            }
        },
        content: '',
    },
    dropdown: {
        initial: '',
        attr: {
            class: 'jdropdown',
        },
        menu: {
            attr: {
                class: 'jdropdown-menu',
            }
        }
    },
    button: {
        attr: {
            class: 'jbutton',
        },
    },
};

(function($) {
    // function holder
    var fn = {
        // Base container
        _container: function() {  // Basic parent
            return $("<div class=\"jfield\"></div>");
        },
        // Main container
        createText: function() {  // Text element
            var $container = fn._container(),
            $text = $("<input type=\"text\">");
    
            $text.css(jFieldDefaults.text.attr);
            return $container.append($text);
        },
        createNumber: function () {  // Number element
            var $container = fn._container(),
            $num = $("<input type=\"number\">");
    
            $num.css(jFieldDefaults.number.attr);
            return $container.append($num);
        },
        createCheckbox: function() {  // Checkbox element
            var $container = fn._container(),
            $check = $("<label><input type=\"checkbox\"><span></span></label>");
            def = jFieldDefaults.checkbox;
    
            // checkbox attr
            $check.attr(def.attr);
    
            return $container.append($check);
        },
        createRadio: function() {  // Radio element
            var $container = fn._container(),
            $radio = $("<label><input type=\"radio\"><span></span></label>");
    
            $radio.attr(jFieldDefaults.radio.attr.wrapper);
            $radio.find("input").attr(jFieldDefaults.radio.attr.input);
            return $container.append($radio);
        },
        createDropdown: function() {  // Dropdown element
            var $container = fn._container(),
            $drop = $("<input type=\"text\" readonly>");
    
            $drop.css(jFieldDefaults.dropdown.attr);
            return $container.append($drop);
        },
        createButton: function() {  // Button element
            var $container = fn._container(),
            $button = $("<input type=\"button\">");
    
            $button.css(jFieldDefaults.button.attr);
            return $container.append($button);
        },
        // Events
        openDrop: function($input, values) {
            if (typeof values === "function") values = values();
            if (!Array.isArray(values)) return;

            var cls = jFieldDefaults.dropdown.menu.attr.class;
            var hasmenu = ($input.parent().find('.'+cls).length > 0);

            if (hasmenu)
                $menu = $input.parent().find('.'+cls);
            else
                $menu = $("<div></div>");

            if (!hasmenu) {
                $menu.attr(jFieldDefaults.dropdown.menu.attr)
                    .css({
                        'position': 'absolute', 
                        'top': $input.outerHeight() + 2,
                        'width': $input.innerWidth(),
                        'z-index': 100,
                    }).append("<ul></ul>");

                // Add values
                for (var i=0; i<values.length; i++) {
                    var value = String(values[i]);
                    $menu.find("ul").append("<li>" + value + "</li>");
                }

                // events
                $menu.find("li").on("click", function() {
                    var value = $(this).text();
                    $input.val(value);
                    $input.trigger("change");
                });

                $input.parent().append($menu);
            } else {
                $menu.show();
            }

            // body once to close
            var bodyClick = function(evt) {
                var cls = jFieldDefaults.dropdown.attr.class;
                if (!$(evt.target).hasClass(cls))
                    $menu.hide();
            };
            $("body").off("click", bodyClick);
            $("body").on("click", bodyClick);
        },
    },
    setup = {
        // Elements
        text: function($parent, options) {
            var $field = fn.createText();
            // attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass(jFieldDefaults.text.attr.class);
    
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.prepend($label);
            }
            // preset
            if (options.preset) {
                // enforces String on option
                // WARNING: this will cast objects/arrays to string without care
                if (typeof options.preset === "function") 
                    options.preset(0, $field);
                else 
                    $field.find("input").val(String(options.preset));
            }

            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
        number: function($parent, options) {
            var $field = fn.createNumber();
            // attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass(jFieldDefaults.number.attr.class);
    
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.prepend($label);
            }
            // preset
            if (options.preset) {
                // enforces Number, ignoring NaN values for preset
                if (typeof options.preset === "function")
                    options.preset(0, $field);
                else if (!isNaN(Number(options.preset)))
                    $field.find("input").val(Number(options.preset));
            }

            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
        checkbox: function($parent, options) {
            var values = options.value;
            if (typeof values === "function") values = values();
            var labels = options.label;

            function builder(val, lbl) {
                var $field = fn.createCheckbox();
                // Set our value for this check
                $field.find("input").val(val)
                .addClass(jFieldDefaults.checkbox.attr.class);
        
                // custom attr
                setattr($field.find('input'), options.attrs);
                // label
                if (lbl) {
                    $field.find("label").append(String(lbl));
                } else {
                    $field.find("label").append(String(val));
                }
    
                // preset value
                if (options.preset) {
                    if (typeof options.preset == "number" && options.preset == i) {
                        $field.find('input').prop('checked', true);
                    } else if (options.preset === true) {
                        $field.find('input').prop('checked', true);
                    } else if (typeof options.preset === "function") {
                        options.preset(i, $field);
                    }
                }
        
                // events
                $field.find("input").on("change", function() {
                    $field.trigger("field-updated");
                });
        
                // Add to element
                $parent.append($field);
            }

            if (Array.isArray(values)) {
                for (var i=0; i<values.length; i++) {
                    if (Array.isArray(labels)) {
                        builder(values[i], labels[i]);
                    } else {
                        builder(values[i], labels);
                    }
                }
            } else {
                builder(values, labels);
            }
        },
        radio: function($parent, options) {
            var values = options.value;
            if (typeof values === "function") values = values();
            var labels = options.label;

            function builder(val, lbl, i) {
                var $field = fn.createRadio();
                // Set our value for this check
                $field.find("input").val(val)
                .addClass(jFieldDefaults.radio.attr.class);
        
                // custom attr
                setattr($field.find('input'), options.attrs);
                // label
                if (lbl) {
                    $field.find("label").append(String(lbl));
                } else {
                    $field.find("label").append(String(val));
                }
    
                // preset value
                if ("preset" in options) {
                    if (typeof options.preset == "number" && options.preset == i) {
                        $field.find('input').prop('checked', true);
                    } else if (options.preset === true) {
                        $field.find('input').prop('checked', true);
                    } else if (typeof options.preset === "function") {
                        options.preset(i, $field);
                    }
                }
        
                // events
                $field.find("input").on("change", function() {
                    $field.trigger("field-updated");
                });
        
                // Add to element
                $parent.append($field);
            }

            if (Array.isArray(values)) {
                for (var i=0; i<values.length; i++) {
                    if (Array.isArray(labels)) {
                        builder(values[i], labels[i], i);
                    } else {
                        builder(values[i], labels, i);
                    }
                }
            } else {
                builder(values, labels, 0);
            }
        },
        dropdown: function($parent, options) {  // TODO: Tweak position
            var $field = fn.createDropdown();
            // custom attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass(jFieldDefaults.dropdown.attr.class);

            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.prepend($label);
            }
            // preset value
            // WARNING: this will cast objects/arrays to string without care
            if (options.preset) {
                if (typeof options.preset === "function")
                    options.preset(0, $field);
                else 
                    $field.find("input").val(options.preset.toString());
            }

            // Custom clicks and menu
            $field.find("input").on("click", function() {
                fn.openDrop($(this), options.value);
            });

            // events
            $field.find("input").on("change", function() {
                $field.trigger("field-updated");
            });
    
            // Add to element
            $parent.append($field);
        },
        button: function($parent, options) {
            var $field = fn.createButton();
            // Set our value for this check
            var value = options.value;
            if (typeof options.value === "function") value = value();
            $field.find("input").val(value);

            // Custom attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass(jFieldDefaults.button.attr.class);

            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.prepend($label);
            }

            // events
            $field.find("input").on("click", function() {
                $field.trigger("field-updated");
            });

            // Add to element
            $parent.append($field);
        },
    };
    // attr
    function setattr($el, attrs) {
        /**
         * Set the given `attrs` to `$el`, but
         * don't override any `value` or `type`.
         */
        if (!attrs) return;

        if (attrs.type) delete attrs.type;
        if (attrs.value) delete attrs.value;

        $el.attr(attrs);
    };
    // set / get
    function setValue($elem, value) {
        // Setting values
        $elem.find(".jfield").each(function() {
            var ftype = $(this).find("input").attr("type");
            
            if (ftype === "checkbox" || ftype === "radio") {
                // Set on radio/check means select it.
                var checked = $(this).find("input").is(":checked");
                if ((!!value && !checked) || (!value && checked))
                    $(this).find("input").trigger("click");
            } else if (ftype === "text" || ftype === "number") {
                // Set on text/number means insert value. (Dropdown gets hard set)
                if (ftype === "number" && isNaN(Number(value))) return;
                $(this).find("input").val(value);
            } else if (ftype === "button") {
                // Set on button triggers a click.
                $(this).find("input").trigger("click");
            }
        });
    };
    function getValue($elem, options) {
        /**
         * Return an object of values for all the
         * jfields in the selector.
         */
        if (!options) options = {overwrite: true};
        var j = {};
        $elem.find(".jfield").each(function(i, el) {
            var $input = $(this).find("input");
            var inputtype = $input.attr("type");
            var inputname = $input.attr("name");

            if (inputtype == "button") {
                // Buttons are requested
                if (!!options.getButtons) {
                    if (!!options.overwrite) {
                        j[inputname] = $input.val();
                    } else {
                        if (!Array.isArray(j[inputname])) 
                            j[inputname] = [];
                        j[inputname].push($input.val());
                    }
                }
            } else if (inputtype == "radio") {  
                if ($input.is(":checked")) {
                    j[inputname] = $input.val();
                }
            } else if (inputtype == "checkbox") {
                if (!Array.isArray(j[inputname])) 
                    j[inputname] = [];
                if ($input.is(":checked"))
                    j[inputname].push($input.val());
            } else {
                if (!!options.overwrite) {
                    j[inputname] = $input.val();
                } else {
                    if (!Array.isArray(j[inputname])) 
                        j[inputname] = [];
                    j[inputname].push($input.val());
                }
            }
        });
        return j;
    };
    // destroy
    function destroy($parent) {
        // Clear it out. Unset field-updated event.
        if ($parent.find("> .jfield").length > 0) {
            $parent.empty();
            $parent.off('field-updated');
        }
    };
    // plugin
    $.fn.jfield = function(action, options) {
        switch (action) {
            case "setValue":  // Set a value
                setValue($(this), options);
                break;
            case "getValue":  // Get the value (json style)
                return getValue($(this), options);
            default:
                return this.each(function(i, el) {
                    switch (action) {
                        case "text":  // Create text field
                            setup.text($(this), options);
                            break;
                        case "number":  // Create number field
                            setup.number($(this), options);
                            break;
                        case "checkbox":  // Create checkbox field
                            setup.checkbox($(this), options);
                            break;
                        case "radio":  // Create radio field
                            setup.radio($(this), options);
                            break;
                        case "dropdown":  // Create dropdown/select field
                            setup.dropdown($(this), options);
                            break;
                        case "button":  // Create button
                            setup.button($(this), options);
                            break;
                        case "destroy":
                            destroy($(this));
                            break;
                        default: 
                            console.warn("Unrecognised action: " + action);
                    }
                });
        }
    };
})(jQuery);