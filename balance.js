var period1 = 8;
var period2 = 22;
var period3 = 15;
var resolution1 = 256;
var resolution2 = 93;
var resolution3 = 137;
var level = 1;
var noiselevel = 0.5;

/**
 * Phase for analog signal
 */
var phase1 = 0;
var phase2 = Math.PI * 0.3;
var phase3 = Math.PI * 1.8;

var amplitude1 = 1;
var amplitude2 = 0.3;
var amplitude3 = 0.7;
var offsetX1 = 10;
var offsetY1 = 50;
var offsetY2 = 150;
var offsetY3 = 250;
var offsetY4 = 370;
var offsetY5 = 490;
var offsetY6 = 610;
var offsetY7 = 730;

var stepX = 1;
var stepY = 40;
const RED = '#FF0000';
const GREEN = '#008000';
const DARK_GREEN = '#006400';
const DARK_BLUE = '#00008B';
const NAVY = '#000080';
const BLUE = '#0000FF';
const DARK_SLATE_GRAY = '#2F4F4F';
const MEDIUM_ORCHID = '#BA55D3';
const BROWN = '#A52A2A';
const BLACK = '#000000'

var canvas;
var unsigned = false;
var selectedsource = 'main';

var drawori = true;
var draworiinverted = true;
var drawnoise = true;
var drawtransmittedori = true;
var drawtransmittedinverted = true;
var drawtransmittednormal = true;
var drawresult = true;

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} value Value
 */
function setState(key, value) {
    var keyStorage = 'planetwave4_' + key;
    if (value) {
        window.localStorage.setItem(keyStorage, '1');
    }
    else {
        window.localStorage.setItem(keyStorage, '0');
    }
}

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} value Value
 */
function setValue(key, value) {
    var keyStorage = 'planetwave4_' + key;
    window.localStorage.setItem(keyStorage, value);
}

/**
 * Get data from local storage
 * @param {string} key Key
 * @param {boolean} val Value
 */
function getState(key, val) {
    var saved = false;
    var keyStorage = 'planetwave4_' + key;
    if (window.localStorage.getItem(keyStorage) != null) {
        var value = window.localStorage.getItem(keyStorage);
        if (value == '1') {
            saved = true;
        }
    }
    else {
        saved = val;
        document.querySelector('#' + key).checked = val;
    }
    document.querySelector('#' + key).checked = saved;
    return saved;
}

/**
 * Get data from local storage
 * @param {string} key Key
 * @param {boolean} val Value
 */
function getValue(key, val) {
    var saved = '';
    var keyStorage = 'planetwave4_' + key;
    if (window.localStorage.getItem(keyStorage) != null) {
        saved = window.localStorage.getItem(keyStorage);
    }
    else {
        saved = val;
    }
    document.querySelector('#' + key).value = saved;
    return saved;
}

/**
 * Copy signal
 * @param {object} signal Objcet to be copied
 * @returns Object
 */
function copySignal(signal) {
    return JSON.parse(JSON.stringify(signal));
}

/**
 * Copy signal
 * @param {object} signal Objcet to be inverted
 * @param {number} offset Offset to invert signal
 * @returns Object
 */
function invertSignal(signal, offset)
{
    var signal2 = JSON.parse(JSON.stringify(signal));
    var i;
    var max = signal2.length;
    for(i = 0; i<max; i++)
    {
        signal2[i].y = invertValue(signal2[i].y, offset);
    }
    return signal2;
}
function invertValue(value, offset)
{
    return (offset * 2) - value;
}

/**
 * Draw all curves and points
 */
function drawAll() {
    canvas.width = document.querySelector('.page').offsetWidth;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /**
     * Original signal
     */
    var original = createSignal(amplitude1 * level, period1, phase1, resolution1);
    var noise1 = createSignal(amplitude2 * noiselevel, period2, phase2, resolution2);
    var noise2 = createSignal(amplitude3 * noiselevel, period3, phase3, resolution3);
    /**
     * Noise
     */
    var noise = combineSignal(noise1, noise2);

    /**
     * We need to invert original signal and transmit it together with original signal
     */
    var originalInverted = invertSignal(original, 0);

    /**
     * Transmitted signal from original
     */
    var noised1 = combineSignal(original, noise);
    /**
     * Transmitted signal from inverted signal
     */
    var noised2 = combineSignal(originalInverted, noise);

    /**
     * We need no invert again the inverted signal and we call it as transmittedNormal
     */
    var transmittedNormal = invertSignal(noised2, 0);

    /**
     * We need to combine the transmitted signal with transmittedNormal
     */
    var result = combineSignal(noised1, transmittedNormal);

    if (drawori) {
        drawSignal(original, canvas, offsetX1, offsetY1, stepX, stepY, BLUE);
    }
    if (draworiinverted) {
        drawSignal(originalInverted, canvas, offsetX1, offsetY2, stepX, stepY, GREEN);
    }
    if (drawnoise) {
        drawSignal(noise, canvas, offsetX1, offsetY3, stepX, stepY, RED);
    }
    if(drawtransmittedori)
    {
        drawSignal(noised1, canvas, offsetX1, offsetY4, stepX, stepY, BLUE);
    }
    if(drawtransmittedinverted)
    {
        drawSignal(noised2, canvas, offsetX1, offsetY5, stepX, stepY, GREEN);
    }
    if(drawtransmittednormal)
    {
        drawSignal(transmittedNormal, canvas, offsetX1, offsetY6, stepX, stepY, BLACK);
    }
    if (drawresult) {
        drawSignal(result, canvas, offsetX1, offsetY7, stepX, stepY, BROWN);
    }

    window.requestAnimationFrame(drawAll);
}

/**
 * Create signal data
 * @param {number} lAmplitude Aplitude
 * @param {number} lPeriod Period
 * @param {number} lPhase Phase
 * @param {number} lResolution Resolution
 */
function createSignal(lAmplitude, lPeriod, lPhase, lResolution) {
    /**
     * y = sin(x + a)
     */
    var result = [];
    var max = lResolution * lPeriod;
    var value = 0;
    var a = lPhase;
    for (var i = 0; i <= max; i++) {
        var v = i * Math.PI * 2 / lResolution;
        var x = v + a;
        value = Math.sin(x) * lAmplitude;
        result.push({ x: i, y: value });
    }
    return result;
}

/**
 * Combine signal
 * @param {object} signal1 Wave 1
 * @param {object} signal2 Wave 2
 * @returns Combination of Wave 1 and Wave 2
 */
function combineSignal(signal1, signal2) {
    if (signal1.length > signal2.length) {
        return addSignal(signal1, signal2);
    }
    else {
        return addSignal(signal2, signal1);
    }
}

/**
 * Add signal
 * @param {object} signal1 Wave 1
 * @param {object} signal2 Wave 2
 * @returns Combination of Wave 1 and Wave 2
 */
function addSignal(signal1, signal2) {
    var max1 = signal1.length;
    var max2 = signal2.length;
    var y = 0;
    var i;
    var result = [];
    for (i = 0; i < max1; i++) {
        if (i < max2) {
            y = signal1[i].y + signal2[i].y;
        }
        else {
            y = signal1[i].y;
        }
        result.push({ x: signal1[i].x, y: y });
    }
    return result;
}

/**
 * Draw signal
 * @param {object} signal Signal
 * @param {object} lCanvas Canvas
 * @param {number} offsetX Offset X
 * @param {number} offsetY Offset Y
 * @param {number} lStepX Step X
 * @param {number} lStepY Step Y
 * @param {string} lineColor Line color
 */
function drawSignal(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, drawPoint, lPointColor) {
    if (drawPoint) {
        drawPoints(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor);
    }
    if (signal.length > 1) {
        var length = signal.length;
        var ctx = lCanvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        var x = offsetX;
        var y = offsetY - (signal[0].y * lStepY);
        ctx.moveTo(x, y);
        for (var i = 1; i < length; i++) {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

window.onload = function () {
    drawori = getState('drawori', drawori);
    document.querySelector('#drawori').addEventListener('change', function (e) {
        drawori = e.target.checked;
        setState('drawori', drawori);
    });

    draworiinverted = getState('draworiinverted', draworiinverted);
    document.querySelector('#draworiinverted').addEventListener('change', function (e) {
        draworiinverted = e.target.checked;
        setState('draworiinverted', draworiinverted);
    });

    drawnoise = getState('drawnoise', drawnoise);
    document.querySelector('#drawnoise').addEventListener('change', function (e) {
        drawnoise = e.target.checked;
        setState('drawnoise', drawnoise);
    });


    drawtransmittedori = getState('drawtransmittedori', drawtransmittedori);
    document.querySelector('#drawtransmittedori').addEventListener('change', function (e) {
        drawtransmittedori = e.target.checked;
        setState('drawtransmittedori', drawtransmittedori);
    });

    drawtransmittedinverted = getState('drawtransmittedinverted', drawtransmittedinverted);
    document.querySelector('#drawtransmittedinverted').addEventListener('change', function (e) {
        drawtransmittedinverted = e.target.checked;
        setState('drawtransmittedinverted', drawtransmittedinverted);
    });

    drawtransmittednormal = getState('drawtransmittednormal', drawtransmittednormal);
    document.querySelector('#drawtransmittednormal').addEventListener('change', function (e) {
        drawtransmittednormal = e.target.checked;
        setState('drawtransmittednormal', drawtransmittednormal);
    });

    drawresult = getState('drawresult', drawresult);
    document.querySelector('#drawresult').addEventListener('change', function (e) {
        drawresult = e.target.checked;
        setState('drawresult', drawresult);
    });

    phase1 = getValue('phase', phase1);

    var value1 = getValue('phase', phase1);
    document.querySelector('#phase').value = value1;
    document.querySelector('#phase').closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value1 + ')';
    document.querySelector('#phase').addEventListener('change', function (e) {
        var value = parseFloat(e.target.value);
        setValue('phase', value);
        phase1 = Math.PI * value / 180;
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value + ')';
    });
    phase1 = Math.PI * value1 / 180;

    level = getValue('level', level);
    var value2 = level;
    document.querySelector('#level').value = level;
    document.querySelector('#level').closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value2 + ')';
    document.querySelector('#level').addEventListener('change', function (e) {
        var value = parseFloat(e.target.value);
        level = value;
        setValue('level', level);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value + ')';
    });

    noiselevel = getValue('noiselevel', noiselevel);
    var value3 = noiselevel;
    document.querySelector('#noiselevel').value = noiselevel;
    document.querySelector('#noiselevel').closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value3 + ')';
    document.querySelector('#noiselevel').addEventListener('change', function (e) {
        var value = parseFloat(e.target.value);
        noiselevel = value;
        setValue('noiselevel', noiselevel);
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' (' + value + ')';
    });

    
    
    canvas = document.querySelector('#canvas1');
    drawAll();
}