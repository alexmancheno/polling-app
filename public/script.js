var choice_id = 2;

function add_option() {
    var options = document.getElementById('options');
    options.innerHTML += `<div class=\"form-group\">
            <label>Choice `+ (choice_id + 1)+`:</label>
            <input type=\"text\" class=\"form-control choices\" placeholder=\"Write your choice..\" id=\"`+ choice_id +`\" name=\"choice\">
          </div>`;
    choice_id++;
}
