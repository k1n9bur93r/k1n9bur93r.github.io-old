//dragElement(document.getElementById("Window"));
var firstDrag = true;
var posl;
var post;
var elmnt;

function getAgent()
{
    var userAgentString = navigator.userAgent; 
    var chromeAgent = userAgentString.indexOf("Chrome") > -1; 
    var safariAgent = userAgentString.indexOf("Safari") > -1;
    ////if ((chromeAgent) ) return true;
    if ((chromeAgent) && (safariAgent)) return false;
    else if (safariAgent) return true;
    return false;

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




var engine = new Engine;
var setStatusMode;
var setStatusNotice;

(function startGame () {

    const EXECUTABLE_NAME = 'GD Paint';
    const MAIN_PACK = 'GD Paint.pck';
    const INDETERMINATE_STATUS_STEP_MS = 100;

    var canvas = document.getElementById('canvas');
    var statusProgress = document.getElementById('status-progress');
    var statusProgressInner = document.getElementById('status-progress-inner');
    var statusIndeterminate = document.getElementById('status-indeterminate');
    var statusNotice = document.getElementById('status-notice');

    var initializing = true;
    var statusMode = 'hidden';

    var animationCallbacks = [];
    function animate(time) {
        animationCallbacks.forEach(callback => callback(time));
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    function adjustCanvasDimensions() {
        var scale = window.devicePixelRatio || 1;
        var width = window.innerWidth;
        var height = window.innerHeight;
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }
    animationCallbacks.push(adjustCanvasDimensions);
    adjustCanvasDimensions();

    setStatusMode = function setStatusMode(mode) {

        if (statusMode === mode || !initializing)
            return;
        [statusProgress, statusIndeterminate, statusNotice].forEach(elem => {
            elem.style.display = 'none';
        });
        animationCallbacks = animationCallbacks.filter(function (value) {
            return (value != animateStatusIndeterminate);
        });
        switch (mode) {
            case 'progress':
                statusProgress.style.display = 'block';
                break;
            case 'indeterminate':
                statusIndeterminate.style.display = 'block';
                animationCallbacks.push(animateStatusIndeterminate);
                break;
            case 'notice':
                statusNotice.style.display = 'block';
                break;
            case 'hidden':
                break;
            default:
                throw new Error('Invalid status mode');
        }
        statusMode = mode;
    }

    function animateStatusIndeterminate(ms) {

        var i = Math.floor(ms / INDETERMINATE_STATUS_STEP_MS % 8);
        if (statusIndeterminate.children[i].style.borderTopColor == '') {
            Array.prototype.slice.call(statusIndeterminate.children).forEach(child => {
                child.style.borderTopColor = '';
            });
            statusIndeterminate.children[i].style.borderTopColor = '#dfdfdf';
        }
    }

    setStatusNotice = function setStatusNotice(text) {

        while (statusNotice.lastChild) {
            statusNotice.removeChild(statusNotice.lastChild);
        }
        var lines = text.split('\n');
        lines.forEach((line) => {
            statusNotice.appendChild(document.createTextNode(line));
            statusNotice.appendChild(document.createElement('br'));
        });
    };

    engine.setProgressFunc((current, total) => {

        if (total > 0) {
            statusProgressInner.style.width = current / total * 100 + '%';
            setStatusMode('progress');
            if (current === total) {
                // wait for progress bar animation
                setTimeout(() => {
                    setStatusMode('indeterminate');
                }, 500);
            }
        } else {
            setStatusMode('indeterminate');
        }
    });

    function displayFailureNotice(err) {
        var msg = err.message || err;
        console.error(msg);
        setStatusNotice(msg);
        setStatusMode('notice');
        initializing = false;
    };

    if (!Engine.isWebGLAvailable()) {
        displayFailureNotice('WebGL not available');
    } else {
        setStatusMode('indeterminate');
        engine.setCanvas(canvas);
        engine.startGame(EXECUTABLE_NAME, MAIN_PACK).then(() => {
            setStatusMode('hidden');
            initializing = false;
        }, displayFailureNotice);
    }
})();