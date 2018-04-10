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
    renderSectionsFromDataStore();
}
function createNewNoteInput() {
    $("#EnterNote").append('<input type="text" name="UserInput" class="form-control UserInputNote" id="UserInputNote" placeholder="Take a Note..." onkeydown= "if (event.keyCode == 13) {createNewNoteInput()}"/>');
}

$(function () {
    $("#main-content").sortable({
        revert: true,
        cancel: '.note-text-container',
        delay: 300                          //On mobile, long press to start dragging
    });
    $("ul, li").disableSelection();
});
