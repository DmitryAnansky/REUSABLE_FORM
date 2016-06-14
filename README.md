# REUSABLE FORM COMPONENT

### Component meets the following requirements

- The initial state is an empty input box, and an ADD button.
- Clicking ADD will add the input text in the box to a list.
- Clicking on 'Delete' button gives you ability to delete a list element.
- On form submit, the list elements will be submitted as an array inside JSON 'items' object.
- Local Storage holds created, but not submitted lists with data.

### To Start using it

Add component style sheet to your page:
```
<link type="text/css" rel="stylesheet" href="../REUSABLE_FORM/styles/index.css">
```
Add component script to your page:
```
<script src="../REUSABLE_FORM/js/form.js"></script>
```
Add FORM COMPONENT container to your html page:
```
<div class="form-component"></div>
```
The container id might be changed with this.ListContainerClass param.

Create an instance on FORM_COMPONENT:
```
var form = new FORM_COMPONENT({});
form.create();
```

To load data from localStorage:
```
var form = new FORM_COMPONENT({});
form.create(localStorage[formInstance].split(','));
```

### Configuration

There is an ability to configure params.

Configuration:                 | Param                |Default Values
-------------------------------|----------------------|----------------
Setup destination URL          | URL                  |https://some_url
Choose submit method           | Method               |POST
Change container Class         | ListContainerClass   |form-component
Change submit button text      | submitBtnText        |Send
Change add button text         | addText              |Add
Change delete button text      | deleteBtnText        |Delete
Change input placeholder text  | uiInputPlaceHolder   |Please enter item name.
Change delete item button text | deleteItemText       |x


```
var form = new FORM_COMPONENT({
    URL: 'https://test',
    deleteItemText: "remove"
});
form.create();
```

### Example Usage
```
    index.html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Demo</title>
            <link type="text/css" rel="stylesheet" href="styles/index.css">
        </head>
        <body>
            <div id="list-container" class="list-container form-component">
                <button id="add-list" class="add-list">Add List</button>
            </div>

            <script src="js/form.js"></script>
            <script src="loader.js"></script>
        </body>
        </html>
```
```
    loader.js
        ;(function() {
            'use strict'

            var form = new FORM_COMPONENT({});
            form.create();

        })();
```

### Submiting FORM COMPONENT

On form submit, the list elements will be submitted as an array inside JSON 'items' object.
Payload:

        {items: ["test1", "test2", "test3"]}
### CSS

After changing default ListContainerClass please consider providing new styles for the component.
The default css style wrapper class is
```
.form-component
```