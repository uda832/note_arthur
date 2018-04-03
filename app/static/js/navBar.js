/* Set the width of the side navigation to 250px */
function openNav() {
    var sideNavWidth = 0;
    if (window.innerHeight <= 450) {
        sideNavWidth = "100px";
    }
    else {
        sideNavWidth = "200px";
    }
    $("#mySidenav").outerWidth(sideNavWidth);
    $("#main-content-container").css({"margin-left": sideNavWidth});
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#mySidenav").outerWidth(0);
    $("#main-content-container").css({"margin-left": 0});
}