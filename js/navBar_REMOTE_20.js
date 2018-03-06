/* Set the width of the side navigation to 250px */
function openNav() 
{
        if(window.innerHeight <= 450)
        {
            
            document.getElementById("mySidenav").style.width = "100px";
        }
        else
        {
            document.getElementById("mySidenav").style.width = "200px"; 
        }
 
 
    
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

/*Select note to display*/
function noteSelection(id) {

    var temp = id.split("-");
    var myId = "#section-" + temp[1];

    /*function grabNote(){
        var curSection = 
            `<li id="section-` + temp[1] +`" class="section">
                <div class='card'>
                    <div class='card-header'>` + DataStore[temp[1]].title + `</div>
                    <ul class="list-group list-group-flush notes-list">`;

        for (var i = 0; i < DataStore[temp[1]].notes.length; ++i) {
            curSection += ` <li class='list-group-item'><a class='note-text'>`+ DataStore[temp[1]].notes[i].text +`</a></li>`;
        }
        curSection += `           
                    </ul>
                </div>
            </li>`;
    }      */

    $(".section").css("display", "none");

    $(myId).css("display", "block");
}