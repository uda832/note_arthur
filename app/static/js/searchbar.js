/*searchbar functionality */

function Search() {

    var newDS = [];
    var searchInput = $('#search').val();
    var compare1 = 0;
    var compare2 = 0;
    for (var s = 0; s < DataStore.length; ++s) {
        if(DataStore[s].title.toLowerCase().includes(searchInput.toLowerCase())) {
            newDS.push(DataStore[s]);
            compare1 = 1;
        }
        for (var n = 0; n < DataStore[s].notes.length; ++n) {
            var str = DataStore[s].notes[n].text.toString().split(" ");
            for (var i = 0; i < str.length; ++i) {
                if (str[i].toLowerCase().includes(searchInput.toLowerCase())) {
                    if (compare1 == 0 && compare2 == 0)
                        newDS.push(DataStore[s]);
                        compare2 = 1;
                }
            }
        }       
        compare1 = 0;
        compare2 = 0;
    }

    renderMainContentFromDataStore(newDS);
}