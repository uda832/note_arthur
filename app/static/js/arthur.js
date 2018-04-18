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
function renderSideNavFromDataStore(DS) {
    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.

    //Render the side-nav
    var $sectionsContainer = $("#side-nav-sections");
    var contentSideNav = "";
    contentSideNav += `<a id="side-nav-all" class="nav-link side-nav-link">All Notes</a>`;
    for (var s = ds.length - 1; s >= 0; --s) {
        contentSideNav += `<a id="side-nav-` + s+ `" class="nav-link side-nav-link">` + ds[s].title +`</a>`;
    }
    $sectionsContainer.html(contentSideNav);    

    postRenderSideNav(ds);
}

//Renders the Main Content area from the DataStore
function renderMainContentFromDataStore(DS) {
    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.


    //Render the main content
    var $mainContent = $("#main-content");
    var content = ""; 
    for (var s = ds.length - 1; s >= 0; --s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s + `" class="section"> <div class='card'> 
                <div id="target" class="section-more-button" style="position: absolute;right: 2%;top:13px;">
                    <button id='section-` + s + `' style="border-radius: 50%;border: 0; background: rgba(0, 0, 0, 0);" onclick="showoption(id)"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 5.5c.83 0 1.5-.67 1.5-1.5S9.83 2.5 9 2.5 7.5 3.17 7.5 4 8.17 5.5 9 5.5zm0 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S9.83 7.5 9 7.5zm0 5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path></svg></button>
                    <button id="` + s + `" class="deletenote" style="display: none; left: 3px; position: relative; top: 1px; z-index: 2; border: 0px;">
                        <i id="` + s + `" class="fa fa-trash" onclick="delete_note(id)"></i></button>
                </div>
</div>
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

    postRenderMainContent(ds);
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
    $.contextMenu({
        selector: "#user-info",
        trigger: 'left',
        items: {
            logout: {name: "Logout", callback: function(key, opt){ logout(); }},
            index: {name : "About Me", callback: function(key, opt) { index(); }}
        }
    });
}

function postRenderSideNav(DS) {
    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.

    
    //Custom Scrollbar for the Side Nav
    $("#side-nav-sections").mCustomScrollbar({
        theme: "minimal-dark",
    });

    //Side Nav click handler
    $(".side-nav-link").click(function(){
        $(".side-nav-link").removeClass("active");
        $(this).addClass("active");

        if ($(this).hasClass("side-nav-all")) {
            renderMainContentFromDataStore();
        }
        else {
            var sectionIndex = parseInt(this.id.substring("side-nav-".length));
            var newDS = [];
            var selectedSection = DataStore[sectionIndex];
            newDS.push(selectedSection);

            renderMainContentFromDataStore(newDS);
        }
    });
}

function postRenderMainContent(DS) {
    var ds;
    ds = (typeof DS == "undefined") ? DataStore : DS; // inline if statement to check if DS is defined.

    //Sections -- Click to Edit listener for
    //Notes -- Click to Edit listener for
    $('.section-text').editable(function(value, settings){

        //Modify the DS
        //-------------------------------------------------------
        var idTail = this.id.substring("section-text-".length);
        var sectionIndex = parseInt(idTail);

    
        console.log("Updating DS");
        //Update the value in the DS
        ds[sectionIndex].title = value;
        ds[sectionIndex].status = 1;        //Set the status to modified

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
       
}
function delete_note(a) {
    $("#section-" + a).remove();
    DataStore[a].status = -1;
    saveDataStore();
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

function showoption(e) {
    var s = e;
    var num = s.replace(/[^0-9]/ig, "");
    var x = document.getElementById(num);
    if (x.style.display == "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}