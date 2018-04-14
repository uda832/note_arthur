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
    document.getElementById("UserInputNote-" + e).focus();
    e++;
    nub = e;
}
function test() {
    add(nub)
    var inputs = document.getElementsByTagName("input");
}

function Del() {
    var x = document.activeElement.id;
    var r = x.match(/\d+$/gi);
    $("#UserInputNote-" + (r)).parent('div').remove();
    --nub;
}

$(function () {
    $("#main-content").sortable({
        revert: true
    });
    $("ul, li").disableSelection();
});

$(document).on("keydown", ".UserInputNote", function (event) {
    if (event.keyCode == 13) {
        test();
    }
    else if (event.keyCode == 8) {
        if (nub > 2) {
            var x = document.activeElement.id;
            var r = x.match(/\d+$/gi);
            var a = $("#UserInputNote-" + (r)).val();
            if (a.length == 0) {
                Del();
                document.getElementById("UserInputNote-" + (r - 1)).focus();
                var hold = r;
                while (hold <= (nub - 1)) {
                    ++hold;
                    var currentid = "UserInputNote-" + (hold);
                    document.getElementById(currentid).id = "UserInputNote-" + (hold-1);
                }
                event.preventDefault();
            }
     
        }
    }  
});

function GetActiveID() {
    var x = document.activeElement.id;
    
}