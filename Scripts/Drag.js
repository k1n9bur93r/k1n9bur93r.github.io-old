﻿//dragElement(document.getElementById("Window"));
var firstDrag = true;
var posl;
var post;
var elmnt;

function getAgent()
{
    console.log("hey im here");
    var userAgentString = navigator.userAgent; 
    var chromeAgent = userAgentString.indexOf("Chrome") > -1; 
    var safariAgent = userAgentString.indexOf("Safari") > -1;
    //if ((chromeAgent) ) return true;
    if ((chromeAgent) && (safariAgent)) return false;
    else return false;

}

function ResetElement()
{
    if (!firstDrag)
    {
        elmnt.style.left = null;
        elmnt.style.top = null;
        firstDrag = true;
    }
}

function dragElement() {
    elmnt = document.getElementById("window");
    if (firstDrag) {
        posl = elmnt.offsetLeft;
        post = elmnt.offsetTop;
        firstDrag = false;
    }
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id )) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX*8;
        pos4 = e.clientY*8;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX*8;
        pos2 = pos4 - e.clientY*8;
        pos3 = e.clientX*8;
        pos4 = e.clientY*8;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}