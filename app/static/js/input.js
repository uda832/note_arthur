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
function test() {
    $("#EnterNote").append('<input type="text" name="UserInput" class="form-control" id="UserInputNote" placeholder="Take a Note..." onkeydown= "if (event.keyCode == 13) {test()}"/>');
}

$(function () {
    $("#main-content").sortable({
        revert: true
    });
    $("ul, li").disableSelection();
});
