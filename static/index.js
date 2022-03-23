//Load layout
const speedSlider = document.getElementById("speedSlider");
const speedLabel = document.getElementById("speedLabel");
const startYearSlider = document.getElementById("startYearSlider");
const startYearLabel = document.getElementById("startYearLabel");
const endYearSlider = document.getElementById("endYearSlider");
const endYearLabel = document.getElementById("endYearLabel");


startYearLabel.innerHTML = startYearSlider.value;
startYearSlider.oninput = function () {
    startYearLabel.innerHTML = this.value;
}

endYearLabel.innerHTML = endYearSlider.value;
endYearSlider.oninput = function () {
endYearLabel.innerHTML = this.value;
}



const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");

disableButtons();


enablePlayButton()

function setDefaultValues(yearStart, yearEnd) {
    startYearSlider.value = yearStart;
    startYearLabel.innerHTML = yearStart;
    endYearSlider.value = yearEnd;
    endYearLabel.innerHTML = yearEnd;
}


function disableButtons() {
    playButton.disabled = true;
    stopButton.disabled = true;
}

function enablePlayButton() {
    playButton.disabled = false;
}
function enableStopButton() {
    stopButton.disabled = false;
}

$("#dropbut").click(function () {
    $("#dropparams").slideToggle('slow');
    if ($(this).hasClass('glyphicon-plus')) {
        $(this).removeClass('glyphicon-plus');
        $(this).addClass('glyphicon-minus');
    } else if ($(this).hasClass('glyphicon-minus')) {
        $(this).removeClass('glyphicon-minus');
        $(this).addClass('glyphicon-plus');
    }
})

