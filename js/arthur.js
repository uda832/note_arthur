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
    for (var s = 0; s < DataStore.length; ++s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s +`" class="section">
                <div class='card'>
                    <div class='card-header'>` + DataStore[s].title + `</div>
                    <ul class="list-group list-group-flush notes-list">`;

        for (var i = 0; i < DataStore[s].notes.length; ++i) {
            curSection += ` <li class='list-group-item'><span class='note-text'>`+ DataStore[s].notes[i].text +`</span></li>`;
        }
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
    dataStoreJSON ='[{  "id":0, "title":"Python", "notes":[  {"text": "do Python hw", "tags": ["hw", "school", "spring"]}, {"text": "install django", "tags": ["project", "school", "spring"]} ] }, {  "id":1, "title":"Software Eng", "notes":[  {"text": "complete presentation review", "tags": ["hw", "school", "spring"]}, {"text": "schedule next team arthur meeting", "tags": ["hw", "school", "spring"]} ] }]';
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
}


