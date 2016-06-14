;(function() {
    'use strict'

    var addControl = document.getElementById("add-list");
    addControl.addEventListener("click", function(e) {
        createNewForm();
    })

    if(localStorage.length > 0) {
        for(var formInstance in localStorage) {
            var form = new FORM_COMPONENT({});
            //Load saved forms
            form.create(localStorage[formInstance].split(','));
        }
    } else {
        createNewForm();
    }

    function createNewForm() {
        var form = new FORM_COMPONENT({
            URL: 'https://test',
            deleteItemText: "remove"
        });
        //Create a new form
        form.create();
    }
})();


