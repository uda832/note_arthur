function DoneFunction() {
    var title = $("#UserInputTitle").val();
    if (title == "") {
        alert("Please provide a Title for this Section."); 
    }
    else {
        var $notes = $(".UserInputNote");
        var temp = {};
        temp.notes = [];
        temp.title = title;
        temp.status = 2;    //Set the status to indicate it's a new section
        temp.id = DataStore.length;
        temp.title = title;
        $notes.each(function () {
            var noteText = this.value;
            temp.notes.push({ text: noteText, tags: [], status: 2 });
        });
        DataStore.push(temp);
        renderMainContentFromDataStore();
        renderSideNavFromDataStore();
        postRenderProcessing();
        $(".UserInputNote").each(function () {
            $("#UserInputTitle").val("");
            $(this).val("");
            $(this).parent('div').remove();
        })
        add(1);
        nub = 2;
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
    }
}
//increase id
var nub = 2;
function add(e) {
    var add = " <div><input type='text' name='UserInput' class='form-control UserInputNote' id='UserInputNote-" + e +"' placeholder='Take a Note...'/></div>";
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
        revert: true,
        cancel: '.note-text-container .note-text-addl-container section-text',
        delay: 300                          //On mobile, long press to start dragging
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
function clearinput() {

}