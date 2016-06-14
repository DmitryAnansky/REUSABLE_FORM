;(function(window) {
    'use strict'

    var FORM_COMPONENT = function(settings) {
        this.settings = settings;
        this.init();
    }

    FORM_COMPONENT.prototype.setSettings = function (settings) {
        var submitBtnTextSetting = (typeof settings.submitBtnText === 'undefined') ? 'Send' : settings.submitBtnText;
        var addTextSetting = (typeof settings.addText === 'undefined') ? 'Add' : settings.addText;
        var deleteBtnTextSetting = (typeof settings.deleteBtnText === 'undefined') ? 'Delete' : settings.deleteBtnText;

        this.URL = (typeof settings.URL === 'undefined') ? 'https://some_url' : settings.URL;
        this.Method = (typeof settings.Method === 'undefined') ? 'POST' : settings.Method;
        this.ListContainerClass = (typeof settings.ListContainerClass === 'undefined') ? 'form-component' : settings.ListContainerClass;
        this.uiInputPlaceHolder = (typeof settings.uiInputPlaceHolder === 'undefined') ? 'Please enter item name.' : settings.uiInputPlaceHolder;
        this.deleteItemText = (typeof settings.deleteItemText === 'undefined') ? "x" : settings.deleteItemText;

        this.submitBtnText = document.createTextNode(submitBtnTextSetting);
        this.addText = document.createTextNode(addTextSetting);
        this.deleteBtnText = document.createTextNode(deleteBtnTextSetting);
    }

    FORM_COMPONENT.prototype.createUIElements = function () {
        this.ui_Form = document.createElement("form");
        this.ui_List = document.createElement("ul");
        this.ui_Input = document.createElement("input");
        this.ui_Add_Control = document.createElement("button");
        this.ui_Submit_Control = document.createElement("button");
        this.ui_Delete_Control = document.createElement("button");
    }

    FORM_COMPONENT.prototype.create = function(listInstance) {
        var self = this;
        var listSection = document.getElementsByClassName(this.ListContainerClass);
        var form = listSection[0].appendChild(this.ui_Form);

        this.ui_Form.setAttribute("action", this.URL);
        this.ui_Form .setAttribute("method", this.Method);

        this.ui_Delete_Control.appendChild(this.deleteBtnText);
        this.ui_Delete_Control.setAttribute("class", "delete-control");
        this.ui_Delete_Control.setAttribute("type", "button");

        this.ui_Input.setAttribute("class", "input-component");
        this.ui_Input.setAttribute("placeholder", this.uiInputPlaceHolder);

        this.ui_Add_Control.appendChild(this.addText);
        this.ui_Add_Control.setAttribute("type", "button");
        this.ui_Add_Control.setAttribute("class", "add-control");

        this.ui_Submit_Control.appendChild(this.submitBtnText);
        this.ui_Submit_Control.setAttribute("type", "submit");
        this.ui_Submit_Control.setAttribute("class", "submit-control");

        form.appendChild(this.ui_Input);
        form.appendChild(this.ui_Add_Control);
        form.appendChild(this.ui_List);
        form.appendChild(this.ui_Submit_Control);
        form.appendChild(this.ui_Delete_Control);

        if (listInstance) {
            listInstance.forEach(function(e){
                self.list(e);
            });
        }

        //Binding functions
        this.ui_Form.addEventListener("click", this.focus.bind(this));
        this.ui_Input.addEventListener("keypress", this.onEnterEvent.bind(this));
        this.ui_Add_Control.addEventListener("click", this.add.bind(this));
        this.ui_Submit_Control.addEventListener("click", this.submit.bind(this));
        this.ui_Delete_Control.addEventListener("click", this.remove.bind(this));
    }

    FORM_COMPONENT.prototype.list = function(data) {
        if (data.length) {
            var text = document.createTextNode(data);
            var deleteItem = document.createTextNode(this.deleteItemText);

            var ui_List_Item = document.createElement("li");
            var ui_Item_Input = document.createElement("input");
            var ui_Item_Remove = document.createElement("button");

            ui_Item_Remove.setAttribute("type", "button");
            ui_Item_Remove.setAttribute("class", "item-remove-control");
            ui_Item_Remove.appendChild(deleteItem);

            ui_Item_Input.setAttribute("class", "show");
            ui_Item_Input.setAttribute("type", "text");
            ui_Item_Input.setAttribute("name", "item[]");
            ui_Item_Input.setAttribute("value", data);

            ui_List_Item .appendChild(ui_Item_Remove);
            ui_List_Item .appendChild(ui_Item_Input);

            this.ui_List.appendChild(ui_List_Item);

            //Binding functions
            this.ui_Input.value = "";
            ui_Item_Remove.addEventListener("click", this.remove.bind(this));
            ui_Item_Input.addEventListener("keypress", this.edit.bind(this, ui_Item_Input));
            ui_Item_Input.addEventListener("click", this.edit.bind(this, ui_Item_Input));
        } else {
            console.log('Please enter text.');
        }
    }

    FORM_COMPONENT.prototype.remove = function(e) {
        e.preventDefault();

        var remove = e.target.parentNode;
        remove.parentNode.removeChild(remove);

        localStorage.clear();
        this.save();
    }

    FORM_COMPONENT.prototype.add = function() {
        localStorage.clear();
        this.list(this.ui_Input.value);
        this.save();
    }

    FORM_COMPONENT.prototype.onEnterEvent = function(e) {
        if(e.keyCode === 13) {
            e.preventDefault();
            this.add();
        }
    }

    FORM_COMPONENT.prototype.submit = function(e) {
        e.preventDefault();
        var currentForm = e.target.parentNode;
        var currentFormElements = currentForm.children;
        for (var i = 0; i < currentFormElements.length; i++) {
            if (currentFormElements[i].nodeName.toLowerCase() === 'ul') {
                var currentFormList = currentFormElements[i].children;
                var formData = [];
                for (var j = 0; j < currentFormList.length; j++) {
                    formData.push(currentFormList[j].children[1].value);
                }
                if (currentFormList.length > 0) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(this.Method, this.URL);
                    var json = JSON.stringify({
                        items: formData
                    });
                    xhr.send(json);

                    currentForm.parentNode.removeChild(currentForm);
                    localStorage.clear();
                    this.save();
                } else {
                    console.log('Nothing to send!');
                }
            }
        }
    }

    FORM_COMPONENT.prototype.focus = function(e) {
        if (!this.ui_Form.getAttribute('class')) {
            var forms = document.getElementsByTagName('form');
            for (var i = 0; i < forms.length; i++) {
                forms[i].removeAttribute('class');
            }
            this.ui_Form.setAttribute('class', 'selected');
        }
    }

    FORM_COMPONENT.prototype.save = function () {
        var pageForms = document.getElementsByTagName('form');

        for (var i = 0; i < pageForms.length; i++) {
            var listToSave = [];

            if (pageForms[i].elements['item[]']){
                if (pageForms[i].elements['item[]'].length) {
                    for (var j = 0; j < pageForms[i].elements['item[]'].length; j++) {
                        listToSave.push(pageForms[i].elements['item[]'][j].value);
                    }
                } else {
                    listToSave.push(pageForms[i].elements['item[]'].value);
                }

                localStorage.setItem(i, listToSave);
            }
        }
    }

    FORM_COMPONENT.prototype.edit = function (input, e) {
        if(e.keyCode === 13) {
            e.preventDefault();
        }

        input.removeAttribute('class');
        input.setAttribute('class', 'edit');

        input.focus();
    }

    FORM_COMPONENT.prototype.init = function() {
        this.setSettings(this.settings);
        this.createUIElements();
    }

    window.FORM_COMPONENT = FORM_COMPONENT;
})(window);