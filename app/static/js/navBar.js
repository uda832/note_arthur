/* Set the width of the side navigation to 250px */
var sideNavWidth = 200;
function openNav() {
    if (window.innerHeight <= 450) {
        sideNavWidth = 100;
    }
    else {
        sideNavWidth = 200;
    }
    $("#main-side-nav").css({"margin-left": 0});
    $(".main-top-nav").css({"margin-left": sideNavWidth});
    $("#main-content-container").css({"margin-left": sideNavWidth});
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $("#main-side-nav").css({"margin-left": -1 * sideNavWidth});
    $(".main-top-nav").css({"margin-left": 0});
    $("#main-content-container").css({"margin-left": 0});
}