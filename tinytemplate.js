/*
 * Tinytemplate JS
 * 
 * A very small templating solution for javascript.
 * For Examples and documentation see README.md
 * 
 * Tinytemplate JS is licensed under MIT License. Copyright (c) 2021 Ole Lange
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

function render_template(template_path, args, onfinish) {
    /* This function is basically a wrapper for render_template_string which requests the
     * template file from a given path.. for more information see README.md */
    var render_result = "";
    fetch(template_path)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.error("Tinytemplate rendering error: Couldn't load template file. Status Code: " + response.status);
                    return;
                }

                response.text().then(function(data){
                    render_template_string(data, args, onfinish);
                });
            }
        )
        .catch(function(err){
            console.error('Tinytemplate fetch error :-S', err);
            return;
        });
    return render_result;
}

function _find_template_control(control, control_end, template) {
    /* This file returns a list the positions of controls */
    var results = new Array();

    var index = template.indexOf(control);
    var end_index = -1;
    while (index > -1) {
        end_index = template.indexOf(control_end, index + 1);
        results.push({
            start: index,
            end: end_index + (control_end.length)
        });
        index = template.indexOf(control, index + 1);
    }

    return results;
}
String.prototype.toTitleCase = function() {
    /* This code is copied from stackoverflow.
    Posted 2015 by Geoffrey Booth
    (https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript)
    */
    var i, j, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  
    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
      str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
        function(txt) {
          return txt.toLowerCase();
        });
  
    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
      str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
        uppers[i].toUpperCase());
  
    return str;
}

function _apply_modifiers(text, modifiers) {
    var result = text;
    console.log(result);

    modifiers.forEach(function(modifier) {

        console.log("mr", modifier, result);
        if (modifier == "title") {
            result = result.toTitleCase();
        }
        else if (modifier == "upper") {
            result = result.toUpperCase();
        }
        else if (modifier == "lower") {
            result = result.toLowerCase();
        }

    });

    return result;
}

function _handle_placeholder_controls(placeholders, template, args) {
    /* this function handles simple placeholder controls */
    placeholders.reverse().forEach(function(placeholder) {
        var placeholder_name = template.slice(placeholder.start+1, placeholder.end-1).trim(); // name of placeholder without spaces

        // Getting Modifiers
        var modifiers;
        if (placeholder_name.includes('|')) {
            modifiers = placeholder_name.split("|");
            placeholder_name = modifiers.splice(0, 1)[0];
        }

        // Replacing with value from args object
        var placeholder_value;
        if (placeholder_name.includes('.')) {
            var path = placeholder_name.split('.');
            placeholder_value = args;
            path.forEach(function (segment) {
                placeholder_value = placeholder_value[segment];
            });
        }
        else {
            placeholder_value = args[placeholder_name];
        }
        
        console.log(modifiers);
        if (modifiers !== undefined)
            placeholder_value = _apply_modifiers(placeholder_value, modifiers);

        template = template.slice(0, placeholder.start) + placeholder_value + template.slice(placeholder.end);

    });

    return template;
}

function render_template_string(template, args, onfinish) {
    /* This function renders a template string with given args */
    /* For template syntax documentation see README.md */

    // Remove all comments -- this will not be handled in a custom function
    var comments = _find_template_control("{/\*", "\*/}", template);
    comments.reverse().forEach(function (comment) {
        template = template.slice(0, comment.start) + template.slice(comment.end);
    });

    // Placing placeholders -- this should be the last control executed
    var placeholders = _find_template_control("{", "}", template);
    template = _handle_placeholder_controls(placeholders, template, args);

    onfinish(template);
}