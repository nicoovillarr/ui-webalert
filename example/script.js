const list = document.getElementById("list")
const json = []
loadJSON("descriptions.json", x => {
    for(var i in x) {
        const li = document.createElement("li")
        json.push(x[i])

        if (!x[i].hasOwnProperty("name") || !x[i].hasOwnProperty("desc") || !x[i].hasOwnProperty("reference")) {
            ShowConfirm({
                title: "Ups",
                message: "Item at line " + ((i * 5) + 2) + " is not well-formatted. Item will be skipped."
            })
            continue
        }

        li.innerHTML = x[i]["name"]

        li.setAttribute("onclick", "ShowDesc(\"" + i + "\")")
        list.appendChild(li)
    }
    console.log(json)
}, y => {
    ShowConfirm({
        title: "Ups",
        message: "There was a problem while getting the resources."
    })
})

function SeeMore () {
    ShowConfirm({
        title: "Redirect",
        message: "You will be redirected to an other web page.",
        actions: [
            {
                value: "Ok",
                then: x => {
                    window.open('https://en.wikipedia.org/wiki/Film_genre', '_blank');
                }
            },
            {
                value: "Cancel"
            }
        ]
    })
}

function ShowDesc (elem) {
    if (!json.hasOwnProperty(elem)) {
        ShowConfirm({
            title: "Ups",
            message: "We couldn't find any description for \"" + json[elem]["name"] + "\".",
            actions: [
                {
                    value: "I'm angry",
                },
                {
                    value: "Retry",
                    then: x => {
                        ShowDesc(elem);
                    }
                }
            ]
        })
        return
    }
    ShowConfirm({
        title: json[elem]["name"],
        message: json[elem]["desc"],
        actions: [
            {
                value: "See reference",
                then: x => {
                    window.open(json[elem]["reference"], '_blank');
                }
            }
        ]
    })
}

function loadJSON(path, success, error)
{
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}