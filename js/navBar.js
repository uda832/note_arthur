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

    var myId = "section-" + id.substring(("section-").length);

    $(".section").each(function() {
        if(this.id != myId)
            this.style.display="none";
        else 
            this.style.display="block";
    });
}