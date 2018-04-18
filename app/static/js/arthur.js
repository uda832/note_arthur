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





var DataStore = [];         //global object used to pass data back/forth between the client and server
    
//Renders the Left Navigation Drawer from the DataStore
function renderSideNavFromDataStore() {
    //Render the side-nav
    var $sectionsContainer = $("#side-nav-sections");
    var contentSideNav = "";
    for (var s = DataStore.length - 1; s >= 0; --s) {
        contentSideNav += `<a id="side-nav-` + DataStore[s].id + `" class="nav-link side-nav-link">` + DataStore[s].title +`</a>`;
    }
    $sectionsContainer.html(contentSideNav);    
}

//Renders the Main Content area from the DataStore
function renderMainContentFromDataStore(DS) {
    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.

    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.
    //Render the main content
    var $mainContent = $("#main-content");
    var content = ""; 
    for (var s = ds.length - 1; s >= 0; --s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s +`" class="section">
                <div class='card'>
                    <div class='card-header'>
                        <span id='section-text-` + s + `' class='section-text'>` + ds[s].title + `</span>
                    </div>
                    <ul class="list-group list-group-flush notes-list">`;

        for (var i = 0; i < ds[s].notes.length; ++i) {
            curSection += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ ds[s].notes[i].text +`</a></li>`;
        }
        curSection += ` <li id="note-`+ s + `-add" class='list-group-item note-text-addl-container'></li>`;
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

    DataStore = [];         //global object used to pass data back/forth between server
    try {
        DataStore = JSON.parse(dataStoreJSON); //Note: this gets populated by the server side during load
    }
    catch(e){
        console.error("initPage: failed to load DataStore");
    }

    //Render the HTML
    //----------------------------------------
    renderSideNavFromDataStore()
    renderMainContentFromDataStore();
    postRenderProcessing();
}

function postRenderProcessing() {

    //Sections -- Click to Edit listener for
    //Notes -- Click to Edit listener for
    $('.section-text').editable(function(value, settings){

        //Modify the DataStore
        //-------------------------------------------------------
        var idTail = this.id.substring("section-text-".length);
        var sectionIndex = parseInt(idTail);

    
        console.log("Updating DataStore");
        //Update the value in the DataStore
        DataStore[sectionIndex].title = value;
        DataStore[sectionIndex].status = 1;        //Set the status to modified

        return(value);
    }, {
        event       : 'click',
        cssclass    : 'section-text-editing',
        type        : 'text',
        placeholder : ' ',
        tooltip     : 'Click to Edit...',
        width       : "100%",
        
    });
    //Notes -- Click to Edit listener 
    $('.note-text-container').editable(noteEditableHandler, {
        event       : 'click',
        cssclass    : 'note-text-editing',
        type        : 'text',
        placeholder : ' ',
        tooltip     : 'Click to Edit...',
        width       : "100%",
    });
  
    //Notes -- Click to Edit listener 
    $('.note-text-addl-container').editable(noteEditableHandler, {
        event       : 'click',
        cssclass    : 'note-text-editing',
        type        : 'text',
        placeholder : '+',
        tooltip     : 'Click to Edit...',
        width       : "100%",
    });
       
    
    //Custom Scrollbar for the Side Nav
    $("#side-nav-sections").mCustomScrollbar({
        theme: "minimal-dark",
    });

    //Side Nav click handler
    $(".side-nav-link").click(function(){
        $(".side-nav-link").removeClass("active");
        $(this).addClass("active");

    });

    $.contextMenu({
        selector: "#user-info",
        trigger: 'left',
        items: {
            logout: {name: "Logout", callback: function(key, opt){ logout(); }},
            index: {name : "About Me", callback: function(key, opt) { index(); }}
        }
        // there's more, have a look at the demos and docs...
    });
}
function index() {
    var docUrl = document.URL.replace('%20', ' ');
    var head = docUrl.substring(0, docUrl.indexOf('/'));
    var url = head + "/index";
    window.location.replace(url);
}


function logout() {
    var docUrl = document.URL.replace('%20', ' ');
    var head = docUrl.substring(0, docUrl.indexOf('/'));
    var url = head + "/logout";
    window.location.replace(url);
}
function noteEditableHandler(value, settings){
    // console.log("DEBUG: editing")
    // console.log(this);
    // console.log(value);
    // console.log(settings);

    //Modify the DataStore
    //-------------------------------------------------------
    var noteIndex = this.id;
    var idTail = noteIndex.substring("note-".length);
    var sectionIndex = parseInt(idTail.split("-")[0]);

    //Special case: "Add new note" button
    if( $(this).hasClass("note-text-addl-container")) {

        var newNote = {};
        newNote.id = -1;
        newNote.text = value;
        newNote.status = 2;     //Set status to Newly Created
        DataStore[sectionIndex].notes.push(newNote);
        DataStore[sectionIndex].status = 1;                //Set the section's status to modified

        //Morph the element to a regular note
        var newNoteIndex = DataStore[sectionIndex].notes.length - 1;
        this.id = "note-" + sectionIndex + "-" + newNoteIndex;
        this.className = "list-group-item note-text-container"

        //Append a new "addl" below this
        $(this).parent().append(` <li id="note-`+ sectionIndex + `-add" class='list-group-item note-text-container note-text-addl-container'></li>`);
        $("#note-"+ sectionIndex + "-add").editable(noteEditableHandler, {
            event       : 'click',
            cssclass    : 'note-text-editing',
            type        : 'text',
            placeholder : '+',
            tooltip     : 'Click to Edit...',
            width       : "100%",
        });
     
    }
    else {
        console.log("Updating DataStore");
        //Update the value in the DataStore
        var noteIndex = parseInt(idTail.split("-")[1]);
        DataStore[sectionIndex].notes[noteIndex].text = value;
        DataStore[sectionIndex].notes[noteIndex].status = 1;  //Set the status to modified
        DataStore[sectionIndex].status = 1;                //Set the section's status to modified
    }
    return('<a class="note-text">' + value + '</a>');
}

//This function sends an ajax request to the server to save the data
function saveDataStore() {
    console.log("DEBUG: invoking saveDataStore");

	var docUrl = document.URL.replace('%20', ' ');
    var head = docUrl.substring(0, docUrl.indexOf('/'));
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
            if(r  == "failure") {
                console.log("save failed");
            }
            else {
                console.log("save successful");
                postSave(r);
            }
        }
    });
}

//This function updates the DataStore elements' status flags once the save request successfully returns 
function postSave(resultDS) {
    try {
        DataStore = JSON.parse(resultDS);
        renderSideNavFromDataStore();
        renderMainContentFromDataStore();
        postRenderProcessing();
    }
    catch(e){
        console.error("postSave: failed to load DataStore");
    }
}//end-postSave

//DELETE Before prod
//DEVTEST Tool -- This function sends an ajax request to the server to delete all notes and sections
function queryAll() {
    console.log("DEBUG: invoking queryAll");

	var docUrl = document.URL.replace('%20', ' ');
    var head = docUrl.substring(0, docUrl.indexOf('/'));
    var tail = '/queryall';
    var url = head + tail;
    var res = "-1";

    $.ajax({
        url: url,
        type: 'post',
        success: function(r) {
            if(r  != "") {
                console.log("successful. results=" + r);
            }
            else {
                console.log(" failed");
            }
        }
    });
}

