function greet() {
    console.log("Hello World");
    alert("Hello Word");
}

/*
[{  
    "id":0,
    "title":"Python",
    "notes":[  
        {"text": "do Python hw", "tags": ["hw", "school", "spring"]},
        {"text": "install django", "tags": ["project", "school", "spring"]}
    ]
},
{  
    "id":1,
    "title":"Software Eng",
    "notes":[  
        {"text": "complete presentation review", "tags": ["hw", "school", "spring"]},
        {"text": "schedule next team arthur meeting", "tags": ["hw", "school", "spring"]}
    ]
}]


*/






var dataStoreJSON = '';
var DataStore = [];         //global object used to pass data back/forth between the client and server
    

//Reads from the DataStore to update the DOM
function updateDOMFromDataStore() {
    var $mainContent = $("#main-content");
    var content = ""; 
    for (var s = DataStore.length - 1; s >= 0; --s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s +`" class="section">
                <div class='card'>
                    <div class='card-header'>` + DataStore[s].title + `</div>
                    <ul class="list-group list-group-flush notes-list">`;

        for (var i = 0; i < DataStore[s].notes.length; ++i) {
            curSection += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ DataStore[s].notes[i].text +`</a></li>`;
        }
        curSection += ` <li id="note-`+ s + `-add" class='list-group-item note-text-container note-text-addl-container'><a class='note-text note-text-addl'>+</a></li>`;
        curSection += `           
                    </ul>
                </div>
            </li>`;
        content += curSection;
    }
    $mainContent.html(content);
}

function initPage() {
    //Populate the DataStore
    //----------------------------------
    dataStoreJSON = '[{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]},{"id":0,"title":"Python","notes":[{"text":"do Python hw","tags":["hw","school","spring"]},{"text":"install django","tags":["project","school","spring"]}]},{"id":1,"title":"Software Eng","notes":[{"text":"complete presentation review","tags":["hw","school","spring"]},{"text":"schedule next team arthur meeting","tags":["hw","school","spring"]}]}]';
    DataStore = [];         //global object used to pass data back/forth between server
    try {
        DataStore = JSON.parse(dataStoreJSON);
    }
    catch(e){
        console.error("initPage: failed to load DataStore");
    }

    //Render the HTML
    //----------------------------------------
    updateDOMFromDataStore();

    createListeners();
}

function createListeners() {

    //Click to Edit listener
    $('.note-text-container').editable(function(value, settings){
        // console.log("DEBUG: editing")
        // console.log(this);
        // console.log(value);
        // console.log(settings);

        //Modify the DataStore
        //-------------------------------------------------------
        var noteId = this.id;
        var idTail = noteId.substring("note-".length);
        var sectionId = parseInt(idTail.split("-")[0]);

        //Special case: "Add new" button
        if( $(this).hasClass("note-text-addl")) {
            //Create a new item in the DataStore[sectionId]
            //IMPLEMENT_ME
            console.log("Missing Feature: note-text-addl clicked");
        }
        else {
            console.log("Updating DataStore");
            //Update the value in the DataStore
            var noteId = parseInt(idTail.split("-")[1]);
            DataStore[sectionId].notes[noteId].text = value;

        }
        return(value);
    }, {
        event       : 'click',
        cssclass    : 'note-text-editing',
        type        : 'text',
        placeholder : "Edit...",
        tooltip     : 'Click to Edit...',
        width       : "100%",
        
    });
   
}

//This function sends an ajax request to the server to save the data
function saveDataStore() {
    console.log("DEBUG: invoking saveDataStore");

	var docUrl = document.URL.replace('%20', ' ');
    var head = docUrl.substring(0, docUrl.indexOf('/esi/'));
    var tail = '/save';
    var url = head + tail;
    var dsJSON = encodeURIComponent(JSON.stringify(DataStore));
    var res = "-1";

    $.ajax({
        url: url,
        type: 'post',
        data: {
            json: dsJSON,
        },
        success: function(r) {
            if(r  == "success") {
                console.log("save successful");
            }
            else {
                console.log("save failed");
            }
        }
    });
}

