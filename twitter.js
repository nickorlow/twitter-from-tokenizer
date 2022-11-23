// This code only works when the first thing you type is a from: (or whatever you have the fromToken set to) this limit is explained better on the comment on lines 41-43
// To run, paste into your browser's console when on twitter.com

var fromToken = 'from:'; // feel free to change this to other things

// if code is run before page load
window.addEventListener("load", (e) => {
    setup();
});
  
// if code is run after page load
if(document.readyState === 'complete') {
    setup();
}


function setup() {
    let elem = document.querySelectorAll('[data-testid="SearchBox_Search_Input"]')[0];
    elem.addEventListener("input", handleInputForFromToken, false);
    elem.addEventListener("keydown", handleBackspaceForFromToken, false);
}

function handleBackspaceForFromToken(e) {
    // this code removes the token if the user tries to clear it
    let key = e. keyCode || e. charCode;
    if(key == 8 && e.target.value.length == 0){
        document.getElementById("from-token-container").remove()
    }
}

function handleInputForFromToken(e) {
    if(document.getElementById("from-token-container") != null) {
        // if we already have the token, we don't need it again
        return;
    }
    
   
    let searchText = e.target.value;
    let fromIdx = searchText.indexOf(fromToken);

    // this code leaves the possibility to have it tokenized in the middle of the text
    // however, this is hard to do as you'd have to change how the textbox works. You
    // likely could probably do it in this code although it would break search
    if(fromIdx == 0) {
        let containerDiv = document.createElement("div");
        containerDiv.id = "from-token-container"
        containerDiv.style = "display: flex; height: max-content; overflow: hidden; height: 100%; width: 60px;"
        
        
        let fromTokenizedDiv = document.createElement("div");
        fromTokenizedDiv.innerHTML = fromToken;
        fromTokenizedDiv.style = "align-self: center; background-color: #1DA1F2; border-radius: 10px; padding: 3px; height: 20px; display: flex;"

        containerDiv.appendChild(fromTokenizedDiv)
        e.target.parentElement.prepend(containerDiv);
        e.target.value = searchText.replace(fromToken, "")

        // the below hack is needed as some js on twitter modifies the input after
        // we clear it. This just clears it a bunch on a set time to stop that.
        // with access to source, could configure it so that it doesn't do this
        // when we're tokenizing something.
        var intervalCount = 0;
        var fixInterval = setInterval(() => {
            if(intervalCount > 10 || document.getElementById("from-token-container") == null) {
                clearInterval(fixInterval);
            }

            let inputElem = document.querySelectorAll('[data-testid="SearchBox_Search_Input"]')[0];
            inputElem.value = inputElem.value.replace(fromToken.replace(":", ""), "")
            intervalCount++;
        }, 50);
    }
}

// code originally by Nicholas Orlowsky (https://github.com/nickorlow)
// code authored on Wed Nov 23 @ 13:55 EST
