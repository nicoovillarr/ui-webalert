# ui-webalert
ui-webalert is a JavaScript library to  show custom confirmation popups.

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