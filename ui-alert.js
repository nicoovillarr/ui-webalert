const ButtonLevel = Object.freeze({"Default":1, "Delete":2});

const confirmStack = []
const currentStack = {}
function ShowConfirm (data) {
    if (data == null) {
        console.error("Data is null.")
        return
    }

    if (!data.hasOwnProperty('title')) {
        console.error("ShowConfirm couldn't find \"title\" value.")
        return
    }

    if (!data.hasOwnProperty('message')) {
        console.error("ShowConfirm couldn't find \"message\" value.")
        return
    }

    if (currentStack.hasOwnProperty("elem") && currentStack["elem"] != null) {
        confirmStack.push(data)
        return
    }

    let confirmBackground = document.createElement("div")
    confirmBackground.style = "width: 100%;height: 100%;background-color: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0; opacity: 0; transition: opacity .15s;"
    confirmBackground.setAttribute("id", "ui-alert-container")

    let confirmContainer = document.createElement("div")
    confirmContainer.style = "background-color:white;border-radius:16px;position:relative;top:50%;transform:translateY(-50%) scale(0);width: 300px;text-align:left;margin:auto;transition:all .25s;-webkit-box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);"
    confirmBackground.appendChild(confirmContainer)

    let header = document.createElement("div")
    header.classList.add("container-header")
    header.style = "display:flex;justify-content:space-between;padding:8px 16px;"
    confirmContainer.appendChild(header)

    let title = document.createElement("h4")
    title.innerHTML = data.title
    title.style = "margin:0;line-height:32px;font-size:24px;vertical-align:middle;"
    header.appendChild(title)

    let close = document.createElement("i")
    close.classList.add("fas")
    close.classList.add("fa-times")
    close.style = "color:gray;margin:0;line-height:32px;font-size:24px;vertical-align:middle;cursor:pointer;transition:color .2s"
    close.setAttribute("onmouseleave", "CloseMouse(this, false)")
    close.setAttribute("onmouseover", "CloseMouse(this, true)")
    header.appendChild(close)
    
    let msg = document.createElement("p")
    msg.style = "padding:8px 16px;margin:0;"
    msg.innerHTML = data.message
    confirmContainer.appendChild(msg)

    let controls = document.createElement("div")
    controls.style = "display:flex;margin-top:4px;"
    confirmContainer.appendChild(controls)

    if (data.hasOwnProperty("actions")) {
        for (var a in data["actions"]) {
            let action = data["actions"][a]
            if (!action.hasOwnProperty('value')) {
                console.error("ShowConfirm couldn't find \"value\" field for action " + a + ".")
                return
            }
            
            let btn = document.createElement("button")
            btn.innerHTML = action['value']
            btn.style = "flex-basis:100%;background-color:transparent;cursor:pointer;border:none;outline:nonecursor:pointer;;padding:12px;transition: all .15s;"
            btn.setAttribute("onmouseleave", "ButtonMouse(this, false)")
            btn.setAttribute("onmouseover", "ButtonMouse(this, true, " + 1 + ")")
            controls.appendChild(btn)

            if (action.hasOwnProperty("level")) {
                let level = action["level"]
                btn.setAttribute("onmouseover", "ButtonMouse(this, true, " + level + ")")
            }

            btn.addEventListener('click', e => {
                if (action.hasOwnProperty('then')) {
                    var method = action['then']
                    if (typeof method != 'function') {
                        console.error("ShowConfirm's then is not a function.")
                    } else {
                        method(e)
                    }
                }
                CloseConfirmation();
            })
        }
    } else {
        let btn = document.createElement("button")
        btn.innerHTML = "Ok"
        btn.style = "flex-basis:100%;background-color:transparent;cursor:pointer;border:none;outline:none;padding:12px;transition: all .15s;"
        btn.setAttribute("onmouseleave", "ButtonMouse(this, false)")
        btn.setAttribute("onmouseover", "ButtonMouse(this, true, " + 1 + ")")

        controls.appendChild(btn)

        btn.setAttribute("onclick", "CloseConfirmation()");
    }

    let addedBtns = controls.getElementsByTagName("button")
    if (addedBtns.length == 1) {
        addedBtns[0].style.borderRadius = "0 0 12px 12px"
    } else if (addedBtns.length > 1) {
        addedBtns[addedBtns.length - 1].style.borderRadius = "0 0 12px 0"
        addedBtns[0].style.borderRadius = "0 0 0 12px"
    }

    document.body.appendChild(confirmBackground)
    
    setTimeout(() => {
        confirmContainer.style.transform = "translateY(-50%)"
        confirmBackground.style.opacity = 1
    }, 1);

    close.setAttribute("onclick", "CloseConfirmation()");

    currentStack.elem = confirmBackground
    currentStack.data = data
}

function CloseConfirmation() {
    currentStack["elem"].getElementsByTagName("div")[0].style.transform = "translateY(-50%) scale(0)"
    currentStack["elem"].style.opacity = "0"
    setTimeout(() => {
        currentStack["elem"].remove()
        if (confirmStack.includes(currentStack["data"])) {
            delete confirmStack[0]
        }
        delete currentStack["elem"]
        delete currentStack["data"]
        var filtered = confirmStack.filter(function (el) {
            return el != null
        })
        if (filtered.length > 0) {
            ShowConfirm(confirmStack[0])
        }
    }, 500)
}

function ButtonMouse (elem, over, level) {
    if (over) {
        switch (level) {
            case ButtonLevel.Delete:
                elem.style.color = "white"
                elem.style.backgroundColor = "red"
                break
            case ButtonLevel.Default:
            default:
                elem.style.color = "white"
                elem.style.backgroundColor = "black"
                break
        }
    } else {
        elem.style.color = "black"
        elem.style.backgroundColor = "white"
    }
}

function CloseMouse (elem, over) {
    elem.style.color = over ? "black" : "gray"
}