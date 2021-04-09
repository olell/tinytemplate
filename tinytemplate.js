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
        })
        index = template.indexOf(control, index + 1);
    }

    return results
}

function _handle_placeholder_controls(placeholders, template, args) {
    /* this function handles simple placeholder controls */
    placeholders.reverse().forEach(function(placeholder) {
        var placeholder_name = template.slice(placeholder.start+1, placeholder.end-1).trim(); // name of placeholder without spaces
        console.log(placeholder_name);

        
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
    var placeholders = _find_template_control("{", "}", template)
    template = _handle_placeholder_controls(placeholders, template, args)

    onfinish(template)
}