# jfield - A jQuery Plugin for creating and handling dynamic stylable inputs  

I made this plugin because I was using jQuery to build dynamic filters and inputs, and ended up needing a better way to create uniform inputs which I could style how I wanted.  
In the example provided in `index.html`, I used the [Free FontAwesome](https://fontawesome.com/) to add icons to checkboxes and radio buttons.  
  
Requires:  

- Requires jQuery (Made with jQuery 3.4.1)

Comes with:  

- Basic CSS, copy certain rules to add your own styles!  
- jQuery plugin script.  

## Examples

### Initialise a field

Most inputs share a similar structure for initialisation.  

```javascript
$('.selector').jfield('text', {
    attrs: {name: '', id: '', ...},
    preset: '',
    label: '',
    value: '',
});
```

When initialising a jfield, the plugin takes two parameters.  

- A field type from `text, number, checkbox, radio, dropdown, button`  
- An options object `{}`  

Within the options object, the following values can be provided:

- `attrs` (Optional) Object of attribute name and value to add to the input within the jfield. Usually this would contain at least a `name` field, but for single inputs, an `id` could be useful for any extra functionality you might have.  
- `preset` (Optional) String or Boolean or Number, depending on the field type. String values are assigned to any input which is capable of holding a String value, in the case of radio/checkbox, the value of `preset` can be Boolean to select all (radio checks last input only), or an Number index from the values given (if Array of values).  
- `label` (Optional, but recommended) String label to attach to the input. For radio/checkbox, this is _STRONGLY_ recommended, since the input tends to not display its value. If a radio/checkbox is given an Array of values, an Array of labels is usually given, otherwise all the inputs are labelled the same. Text fields and dropdown elements can make use of the `attr` value `placeholder`, to display context within an empty input, if a label would seem awkward or out of place.  
- `value` (Conditionally required) For checkbox/radio inputs, this is a **requirement**, since otherwise there won't be a value for the input. If a single value is given for a radio/checkbox, a single box is created, but an Array of values can create a set of inputs. Dropdowns **require** a list (Array) of values otherwise they will have no options. For a button, value can act as a label, since input values on button inputs tend to display on the button element itself.  

### Get the values of fields

Getting the values of fields is made much simpler as well!  
Instead of jumping around grabbing specific elements by ids or having to monitor all the fields around, you can simply call once on a parent of _ALL_ fields, and a handy `key: value` object will be returned to you with the contents of all editable fields! (Buttons are _NOT_ included since they don't tend to update values. Note: An option may be added to change this.)

```javascript
$('.selector').jfield('getValue');
// {inputName: inputValue}

$('.parent').jfield('getValue');
// {name1: value1, name2: value2, ...}
```

## Thoughts for additions

- Fieldset element generation?  
- Label text positioning, before or after?  