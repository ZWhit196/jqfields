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
    password: {
        attr: {
            class: 'jpassword',
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
            },
            offset: 5,
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
        createPassword: function() {  // Password element
            var $container = fn._container(),
            $pass = $("<input type=\"password\">");
    
            $pass.css(jFieldDefaults.password.attr);
            return $container.append($pass);
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
            $drop = $("<select></select>");
    
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
        openDrop: function($field, options) {
            // Moved select item addition here to allow 
            // for dynamic select updating through functions
            if (typeof options.label === 'function') {
                labels = options.label();
            } else {
                labels = options.label;
            }
            if (typeof options.value === "function") {
                var values = options.value();
                var currentVal = $field.find("select").val() || values[0];

                function addVals($field, values, labels) {
                    if (Array.isArray(values)) {
                        $field.find("select").empty();
    
                        for (var i=0; i<values.length; i++) {
                            var $option = $("<option></option>");
                            var val = values[i].toString();
                            var lbl;
        
                            if (Array.isArray(labels)) {
                                lbl = labels[i];
                                $option.val(val).text(lbl);
                            } else {
                                $option.val(val).text(val);
                            }
        
                            $field.find("select").append($option);
                        }

                        $field.find("select").val(currentVal);
                    }
                }
                addVals($field, values, labels);
            } else {
                var values = options.value;
            }

            if (!Array.isArray(values)) return;  // Must be Array here

            var cls = jFieldDefaults.dropdown.menu.attr.class;
            var hasmenu = ($field.find('.'+cls).length > 0);

            if (hasmenu) {
                $menu = $field.find('.'+cls);
            } else {
                $menu = $("<div></div>");
            }

            // Build select items
            function setItems($menu, values, labels) {
                // Add values
                for (var i=0; i<values.length; i++) {
                    var value = String(values[i]);
                    var $li;
                    var lbl;
                    var $option = $field.find("option[value=\""+value+"\"]");
                    var disabled = $option.prop("data-disabled");
                    var message = $option.prop("data-message");
                    // array of labels will substitute values
                    if (Array.isArray(labels)) {
                        $li = $("<li></li>");
                        lbl = (!!labels[i]) ? labels[i] : value;
                        $li.data('value', value).text(lbl);
                        if(disabled){
                            $li.addClass("disabled");
                        }
                        if(message){
                            $li.prop("title",message);
                        }
                        $menu.find("ul").append($li);
                    } else {
                        $li = $("<li></li>");
                        $li.text(value).data('value', value);
                        if(disabled){
                            $li.addClass("disabled");
                        }
                        if(message){
                            $li.prop("title",message);
                        }
                        $menu.find("ul").append($li);
                    }
                }
                // events
                $menu.find("li").on("click", function() {
                    if(!$(this).hasClass("disabled")){
                        var data = $(this).data('value');
                        $field.find("select").val(data);
                        $field.find("select").trigger("change");
                        $menu.hide();
                    }
                });
            }

            if (!hasmenu) {
                $menu.attr(jFieldDefaults.dropdown.menu.attr)
                .append("<ul></ul>");

                setItems($menu, values, labels);

                $field.append($menu);
            } else {
                $menu.find("ul").empty();
                setItems($menu, values, labels);
                $menu.show();
            }

            // Check positioning
            var selectHeight = $field.find("select").outerHeight();
            var menuHeight = $menu.outerHeight();
            var menuOffset = jFieldDefaults.dropdown.menu.offset;
            var selectBottom = $field.find("select").offset().top + selectHeight;
            var styles = {
                'position': 'absolute', 
                'top': selectHeight + menuOffset,
                'left': $field.find("select").position().left,
                'width': $field.find("select").outerWidth(),
                'z-index': 100,
            };
            $menu.css(styles);
            // Flip if offscreen
            var _viewBottom = $(window).scrollTop() + $(window).height();
            var _bottom = selectBottom + menuHeight + menuOffset;
            if (_bottom > _viewBottom) {  // off screen, flip
                var _top = $menu.position().top - (menuHeight + selectHeight + (menuOffset * 2));
                $menu.css({"top": _top});
            }
        },
        closeDrop: function($field) {
            var menucls = jFieldDefaults.dropdown.menu.attr.class;
            var $menu = $field.find('select').next('.'+menucls);
            $menu.hide();
        }
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
            if ("preset" in options) {
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
        password: function($parent, options) {
            var $field = fn.createPassword();
            // attr
            setattr($field.find("input"), options.attrs);
            $field.find("input").addClass(jFieldDefaults.password.attr.class);
    
            // label
            if (options.label) {
                $label = $("<label>" + options.label + "</label>");
                // label linking to input
                if ($field.find("input").attr('id'))
                    $label.attr({for: $field.find("input").attr('id')});
                $field.prepend($label);
            }
            // preset
            if ("preset" in options) {
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
            if ("preset" in options) {
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
                $field.find("input").val(val);
        
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
                $field.find("input").val(val);
        
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
        dropdown: function($parent, options) {
            var $field = fn.createDropdown();
            // custom attr
            setattr($field.find("select"), options.attrs);
            $field.find("select").addClass(jFieldDefaults.dropdown.attr.class);

            // label
            if (typeof options.label === 'function') {
                labels = options.label();
            } else {
                labels = options.label;
            }
            
            function addVals($field, values, labels) {
                if (typeof values === "function") values = values();
                if (Array.isArray(values)) {
                    for (var i=0; i<values.length; i++) {
                        var $option = $("<option></option>");
                        var val = values[i].toString();
                        var lbl;
    
                        if (Array.isArray(labels)) {
                            lbl = labels[i] || val;  // Fallback if falsey
                            $option.val(val).text(lbl);
                        } else {
                            $option.val(val).text(val);
                        }
    
                        $field.find("select").append($option);
                    }
                }
            }
            addVals($field, options.value, labels);

            // preset value
            // WARNING: this will cast objects/arrays to string without care
            if ("preset" in options) {
                if (typeof options.preset === "function")
                    options.preset(0, $field);
                else {
                    var v = options.preset.toString();
                    $field.find("select").val(v);
                }
            }

            // Custom clicks and menu
            $field.find("select").on("mousedown", function(evt) {
                evt.preventDefault();
                // force all others to close
                fn.closeDrop($(document).find(".jfield"));
                if (evt.which === 1) fn.openDrop($field, options);
            });
            $(document).on('mouseup', function(evt) {
                var cls = jFieldDefaults.dropdown.attr.class;
                
                var is_ul = $(evt.target).prop("tagName") == "UL";
                var $ulParentSelect = $(evt.target).parent().prev();

                var is_li = $(evt.target).prop("tagName") == "LI";
                var $liParentSelect = $(evt.target).parent().parent().prev();

                if (
                    ($(evt.target).hasClass(cls) && !is_li && !is_ul) || 
                    (is_li && $liParentSelect.hasClass(cls) && !is_ul) || 
                    (!is_li && is_ul && $ulParentSelect.hasClass(cls) )  
                ) return false;  // We want it open on these conditions
                fn.closeDrop($field);
            });

            // events
            $field.find("select").on("change", function() {
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
            var isdrop = $(this).find("select").length > 0;
            
            if (ftype === "checkbox" || ftype === "radio") {
                // Set on radio/check means select it.
                var checked = $(this).find("input").is(":checked");
                if ((!!value && !checked) || (!value && checked))
                    $(this).find("input").trigger("click");
            } else if (ftype === "text" || ftype === "number" || ftype === "password") {
                // Set on text/number means insert value.
                if (ftype === "number" && isNaN(Number(value))) return;
                $(this).find("input").val(value);
            } else if (ftype === "button") {
                // Set on button does nothing.
            } else if (isdrop) {
                // select type just has `.val()` used.
                $(this).find("select").val(value);
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
            var $input = $(this).find("input, select");
            var inputtype = $input.attr("type");
            var inputname = $input.attr("name");
            var isdrop = $(this).find("select").hasClass(jFieldDefaults.dropdown.attr.class);

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
            } else if (isdrop) {
                if (!!options.overwrite) {
                    j[inputname] = $input.val();
                } else {
                    if (!Array.isArray(j[inputname])) 
                        j[inputname] = [];
                    j[inputname].push($input.val());
                }
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
    // disable drop down item 
    function disable($elem,options){
        if(typeof(options) == "string"){
            var value = options;
            var message = null;
        }else{
            var value = options.value;
            var message = options.message;

        }
        var $select = $elem.find("select");
        var $list = $elem.find("ul");
        if($select.length == 0){
            throw "Disabling can only be performed on dropdown jfield types";
        }
        var $v = $select.find("option[value=\""+value+"\"]");
        if($v.length == 0){
            throw "Cannot find a item with the value '"+value+"'";
        }
        $v.prop("data-disabled",true);
        if(message != null){
            $v.prop("data-message",message);

        }
        return true
    }
    // enable drop down item 
    function enable($elem,value){
        var $select = $elem.find("select");
        var $list = $elem.find("ul");
        if($select.length == 0){
            throw "Disabling can only be performed on dropdown jfield types";
        }
        var $v = $select.find("option[value=\""+value+"\"]");
        if($v.length == 0){
            throw "Cannot find a item with the value '"+value+"'";
        }
        $v.removeProp("data-disabled");
        $v.removeProp("data-message");
        return true;
    }
    // plugin
    $.fn.jfield = function(action, options) {
        switch (action) {
            case "setValue":  // Set a value
                setValue($(this), options);
                break;
            case "getValue":  // Get the value (json style)
                return getValue($(this), options);
            case "disable":
                return disable($(this),options);
            case "enable":
                return enable($(this),options);

            default:
                return this.each(function(i, el) {
                    switch (action) {
                        case "text":  // Create text field
                            setup.text($(this), options);
                            break;
                        case "password":  // Create text field
                            setup.password($(this), options);
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