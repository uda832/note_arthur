/*searchbar functionality */


function Search() {

    var newDS = [];
    var searchInput = $('#search').val();
    for (var s = 0; s < DataStore.length; ++s) {
        if(searchInput == DataStore[s].title) {
            newDS.push(DataStore[s]);
        }
        for (var n = 0; n < DataStore[s].notes.length; ++n) {
            var str = DataStore[s].notes[n].text.toString().split(" ");
            for (var i = 0; i < str.length; ++i) {
                if (searchInput == str[i]) {
                    newDS.push(DataStore[s]);
                }
            }
        }       
    }

    var $mainContent = $("#main-content");
    var content = ""; 
    for (var s = newDS.length - 1; s >= 0; --s) {
        //Render each section 
        var curSection = 
            `<li id="section-` + s +`" class="section">
                <div class='card'>
                    <div class='card-header'>
                        <span id='section-text-` + s + `' class='section-text'>` + newDS[s].title + `</span>
                    </div>
                    <ul class="list-group list-group-flush notes-list">`;

        for (var i = 0; i < newDS[s].notes.length; ++i) {
            curSection += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ newDS[s].notes[i].text +`</a></li>`;
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










/*
function Search() {
    var searchInput = $("#UserInput").val();
    var $mainContent = $("#main-content");
    var content = "";
    var result;
    var temp = [];
    for(var s = 0; s < DataStore.length; ++s){
        //compare each section
        if(searchInput == DataStore[s].title){
            result += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ DataStore[s].notes[i].text +`</a></li>`;
        }
        for(var n = 0; i < DataStore[s].notes.length; ++i) {
            if(searchedInput == DataStore[s].title){
                result += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ DataStore[s].notes[i].text +`</a></li>`;
            }
            for(var t = 0; t < DataStore[s].notes[n].tags.length; ++i) {
                if(searchedInput == DataStore[s].notes[n].tags[t]) {
                    result += ` <li id="note-`+ s + `-` + i + `" class='list-group-item note-text-container'><a class='note-text'>`+ DataStore[s].notes[i].text +`</a></li>`;
                }
            }
        }
        curSection += `           
                    </ul>
                </div>
            </li>`;
        content += SearchedNotes;
    }
    $mainContent.html(searchedInput);
}

*/