/**!
 * UIAlert 1.1.0-rc.3
 * @author	Nicolás Villar   <nicolasvillar00@gmail.com>
 */

const ButtonLevel = Object.freeze({"Default":1, "Delete":2});
const alertStack = []

class UIAlert {
    constructor(data) {
        if (data == null) {
            console.error("Data is null.")
            return
        }
    
        if (!data.hasOwnProperty('title')) {
            console.error("UIAlert couldn't find \"title\" value.")
            return
        }
    
        if (!data.hasOwnProperty('message')) {
            console.error("UIAlert couldn't find \"message\" value.")
            return
        }

        const buttonHandler = (e, isOver, btnLevel) => {
            if (isOver) {
                switch (btnLevel) {
                    case ButtonLevel.Delete:
                        e.style.color = "white"
                        e.style.backgroundColor = "red"
                        break
                    case ButtonLevel.Default:
                    default:
                        e.style.color = "white"
                        e.style.backgroundColor = "black"
                        break
                }
            } else {
                e.style.color = "black"
                e.style.backgroundColor = "white"
            }
        }

        const closeHandler = (e, isOver) => {
            e.style.opacity = isOver ? "1" : "0.5"
        }
    
        let confirmBackground = document.createElement("div")
        confirmBackground.style = "width: 100%;height: 100%;background-color: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0; opacity: 0; transition: opacity .15s;"
        confirmBackground.setAttribute("id", "ui-alert-container")
    
        let confirmContainer = document.createElement("div")
        confirmContainer.style = "background-color:white;border-radius:16px;position:relative;top:50%;transform:translateY(-50%) scale(0);width: 300px;text-align:left;margin:auto;transition:all .25s;-webkit-box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.75);"
        confirmBackground.appendChild(confirmContainer)
    
        let header = document.createElement("div")
        header.classList.add("container-header")
        header.style = "position:relative;display:flex;justify-content:space-between;padding:8px 16px;"
        confirmContainer.appendChild(header)
    
        let title = document.createElement("h4")
        title.innerHTML = data.title
        title.style = "margin:0;line-height:32px;font-size:24px;vertical-align:middle;"
        header.appendChild(title)
    
        let closeContainer = document.createElement("div")
        closeContainer.style = "width: 24px;height:24px;position:absolute;right:8px;top:50%;transform: translateY(-50%);cursor:pointer;opacity:0.5;transition: opacity .25s"
        header.appendChild(closeContainer)

        closeContainer.addEventListener('mouseover', x => { closeHandler(closeContainer, true) })
        closeContainer.addEventListener('mouseleave', x => { closeHandler(closeContainer, false) })

        let close = document.createElement("div")
        close.classList.add("uialert-close")
        close.style = "position:absolute;width: 24px;height: 4px;background-color:black;top:50%;transform: translateY(-50%);border-radius:4px;transition: all .5s"
        closeContainer.appendChild(close)

        this.closeStyle = document.createElement("style")
        this.closeStyle.innerHTML = ".uialert-close::after { content: '';width: 24px;height: 4px;background-color: black;position: absolute;border-radius: 4px;transform: rotateZ(90deg); }"
        
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
                    console.error("UIAlert couldn't find \"value\" field for action " + a + ".")
                    return
                }
                
                let btn = document.createElement("button")
                btn.innerHTML = action['value']
                btn.style = "flex-basis:100%;background-color:transparent;cursor:pointer;border:none;outline:nonecursor:pointer;;padding:12px;transition: all .15s;"
                btn.addEventListener('mouseleave', x => { buttonHandler(btn, false) })
                btn.addEventListener('mouseover', x => { buttonHandler(btn, true, 1) })
                controls.appendChild(btn)
    
                if (action.hasOwnProperty("level")) {
                    let level = action["level"]
                    btn.removeEventListener('mouseover', buttonHandler)
                    btn.addEventListener('mouseover', x => { buttonHandler(btn, true, level) })
                }

                if (action.hasOwnProperty('then') && typeof action['then'] != 'function') {
                    console.error("UIAlert's then is not a function.")
                    return;
                }
    
                btn.addEventListener('click', e => {
                    if (action.hasOwnProperty('then')) {
                        var method = action['then']
                        method(e)
                    }
                    this.Close()
                })
            }
        } else {
            let btn = document.createElement("button")
            btn.innerHTML = "Ok"
            btn.style = "flex-basis:100%;background-color:transparent;cursor:pointer;border:none;outline:none;padding:12px;transition: all .15s;"
            btn.addEventListener('mouseleave', x => { buttonHandler(btn, false) })
            btn.addEventListener('mouseover', x => { buttonHandler(btn, true, 1) })
    
            controls.appendChild(btn)
            btn.addEventListener('click', x => { this.Close() })
        }
    
        let addedBtns = controls.getElementsByTagName("button")
        if (addedBtns.length == 1) {
            addedBtns[0].style.borderRadius = "0 0 12px 12px"
        } else if (addedBtns.length > 1) {
            addedBtns[addedBtns.length - 1].style.borderRadius = "0 0 12px 0"
            addedBtns[0].style.borderRadius = "0 0 0 12px"
        }

        closeContainer.addEventListener('click', x => {
            this.Close()
        })

        this.element = confirmBackground
        this.close = close
        return
    }

    Show() {
        if (this.element == null) {
            return
        }

        if (document.getElementById("ui-alert-container") != null) {
            alertStack.push(this)
            return
        }

        document.body.appendChild(this.element)
        document.head.appendChild(this.closeStyle)
        
        setTimeout(() => {
            this.element.style.opacity = 1
            this.element.getElementsByTagName("div")[0].style.transform = "translateY(-50%)"
            this.close.style.transform = "rotateZ(-45deg) translateY(-50%)"
        }, 1);
    }

    Close() {
        this.element.style.opacity = "0"
        this.element.getElementsByTagName("div")[0].style.transform = "translateY(-50%) scale(0)"

        setTimeout(() => {
            this.element.remove()
            this.closeStyle.remove()

            if (alertStack.length > 0) {
                alertStack[0].Show()
                alertStack.splice(0, 1)
            }
        }, 500)
    }
}