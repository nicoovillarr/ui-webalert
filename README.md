# ui-webalert
ui-webalert is a JavaScript library to  show custom confirmation popups.

## Get Started
You can get this script by copying the following code inside the _head_ tag of your webpage:
```
<script src='https://cdn.jsdelivr.net/gh/nicoovillarr/ui-webalert/ui-alert.js'></script>

Minified version
<script src='https://cdn.jsdelivr.net/gh/nicoovillarr/ui-webalert/ui-alert.min.js'></script>
```

## Usage
You can simply show a normal confirmation popup with:
```
ShowConfirm({
    title: "Title", // Title's content for the header
    message: "Message" // Message's content for the body
})
```

Also you can add custom buttons:
```
ShowConfirm({
    title: "Title",
    message: "Message",
    actions: [
        {
            value: "Ok", // Custom button's message
            level: ButtonLevel.Default, // The button's level (for now there are only 2 values: Default and Delete)
            then: x => {
                // Action to trigger when the button is pressed
            }
        }
    ]
})
```

###### `Default` button level
This one is the default one (as its name says). Its normal behaviour is that when the mouse is over it, the background color changes to black and the text color changes to white.

###### `Delete` button level
The _Delete_ button level enables the user to see the background color as red and the text color as white.