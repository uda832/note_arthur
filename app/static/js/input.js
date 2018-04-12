function DoneFunction() {
    var title = $("#UserInputTitle").val();
    var $notes = $(".UserInputNote");
    var temp = {};
    temp.notes = [];
    temp.id = DataStore.length;
    temp.title = title;
    $notes.each(function () {
        var noteText = this.value;
        temp.notes.push({ text: noteText, tags: [] });

    });
    DataStore.push(temp);
    updateDOMFromDataStore();
}
//increase id
var nub = 2;
function add(e) {
    var add = " <div><input type='text' name='UserInput' class='form-control UserInputNote' id='UserInputNote-" + e +"' placeholder='Take a Note...'onkeydown='keyfunction()'/></div>";
    $(".note_container").append(add);
    e++;
    nub = e;
}
function test() {
    //    $("#EnterNote").append('<div><input type="text" name="UserInput" class="form-control" id="UserInputNote" placeholder="Take a Note..." onkeydown= "if (event.keyCode == 13) {test()}"/></div>');
    add(nub)
}

function Del(){
    $("#UserInputNote-"+(nub-1)).parent('div').remove();
    nub--;
}

$(function () {
    $("#main-content").sortable({
        revert: true
    });
    $("ul, li").disableSelection();
});

function keyfunction() {
    if (event.keyCode == 13) { test(); }
    else if (event.keyCode == 8) {
        temp = nub - 1;
        var a = $("#UserInputNote-" + (temp)).val();
        if (a.length == 0) {
            Del();
        }
    }
}