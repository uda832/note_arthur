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
var DataStoreStash = [];
    
function renderSideNavFromDataStore() {
    //Render the side-nav
    var $sectionsContainer = $("#side-nav-sections");
    var contentSideNav = `<a id="side-nav-all" class="nav-link side-nav-link side-nav-link-special side-nav-link-all">All Notes</a><hr>`;
    for (var s = DataStore.length - 1; s >= 0; --s) {
        contentSideNav += `<a id="side-nav-` + DataStore[s].id + `" class="nav-link side-nav-link">` + DataStore[s].title +`</a>`;
    }
    $sectionsContainer.html(contentSideNav);
    //Reset the scrollbar
    $("#side-nav-sections").mCustomScrollbar({ theme: "minimal-dark", });
}

//Restores the DataStore object from the stash
function restoreDataStore() {
    DataStore= jQuery.extend(true, {}, DataStoreStash ); //Deep-copy
}

//Reads from the DataStore to update the DOM
function renderSectionsFromDataStore() {

    //Render the main content
    var $mainContent = $("#main-content");
    var content = ""; 
    for (var s = DataStore.length - 1; s >= 0; --s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s +`" class="section">
                <div class='card'>
                    <div class='card-header'>
                        <span id='section-text-` + s + `' class='section-text'>` + DataStore[s].title + `</span>
                    </div>
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
    renderSideNavFromDataStore();
    renderSectionsFromDataStore();

    //Post Processing
    //-----------------
    postProcessing();
}

function postProcessing() {

    //Sections -- Click to Edit listener for
    //Notes -- Click to Edit listener for
    $('.section-text').editable(function(value, settings){
        // console.log("DEBUG: editing")
        // console.log(this);
        // console.log(value);
        // console.log(settings);

        //Modify the DataStore
        //-------------------------------------------------------
        var idTail = this.id.substring("section-text-".length);
        var sectionId = parseInt(idTail);

    
        console.log("Updating DataStore");
        //Update the value in the DataStore
        DataStore[sectionId].title = value;

        return(value);
    }, {
        event       : 'click',
        cssclass    : 'section-text-editing',
        type        : 'text',
        placeholder : "Edit...",
        tooltip     : 'Click to Edit...',
        width       : "100%",
        
    });
    //Notes -- Click to Edit listener for
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
    

    //Side Nav click handler
    //----------------------------------------------------------------------------------
    $(".side-nav-link").click(function(){
        //Set the active class
        $(".side-nav-link").removeClass("active");
        $(this).addClass("active");

        //Special buttons
        if ($(this).hasClass("side-nav-link-special")) {

            //All Notes
            if ($(this).hasClass("side-nav-link-all")) {
            }
        }
        else {
            //Show the selected section
            //----------------------------------------------------------------
            var index = parseInt(this.id.substring("side-nav-".length));
            var selected = jQuery.extend(true, {}, DataStore[index]);       //Deepcopy
            DataStoreStash = jQuery.extend(true, {}, DataStore);         //Temporarily save the object
            DataStore = [];
            DataStore.push(selected);
            renderSectionsFromDataStore();
        }

    });
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
            if(r  == "success") {
                console.log("save successful");
            }
            else {
                console.log("save failed");
            }
        }
    });
}

