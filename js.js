var period1 = 8;
var period2 = 5;
var resolution1 = 256;
var resolution2 = 410;

/**
 * Phase for analog signal
 */
 var phase1 = Math.PI/2;
 var phase2 = Math.PI/2;

/**
 * Ratio between sampling rate to highest analog frequency
 */
var ratio = 2;

/**
 * Tension to smooth wave
 */
var tension = 1;
var amplitude1 = 1;
var amplitude2 = 0.3;
var offsetX1 = 10;
var offsetY1 = 100;
var offsetY2 = 300;
var offsetY3 = 500;
var stepX = 1;
var stepY = 80;
const RED = '#FF0000';
const GREEN = '#008000';
const DARK_GREEN = '#006400';
const DARK_BLUE = '#00008B';
const NAVY = '#000080';
const BLUE = '#0000FF';
const DARK_SLATE_GRAY = '#2F4F4F';
const MEDIUM_ORCHID = '#BA55D3';
const BROWN = '#A52A2A';

var canvas;
var unsigned = false;
var selectedsource = 'main';

var drawori = true;
var drawsampling = true;
var drawresult = true;
var drawbezierresult = true;
var drawpoint = false;
var drawcompararison = false;
var drawsignal1 = false;
var drawsignal2 = false;

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} value Value
 */
function setState(key, value)
{
    var keyStorage = 'planetwave_'+key;
    if(value)
    {
        window.localStorage.setItem(keyStorage, '1');
    }
    else
    {
        window.localStorage.setItem(keyStorage, '0');
    }
}

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} value Value
 */
function setValue(key, value)
{
    var keyStorage = 'planetwave_'+key;
    window.localStorage.setItem(keyStorage, value);
}
 
/**
 * Get data from local storage
 * @param {string} key Key
 * @param {boolean} val Value
 */
function getState(key, val)
{
    var saved = false;
    var keyStorage = 'planetwave_'+key;
    if(window.localStorage.getItem(keyStorage) != null)
    {
        var value = window.localStorage.getItem(keyStorage);
        if(value == '1')
        {
            saved = true;
        }
    }
    else
    {
        saved = val;
        document.querySelector('#'+key).checked = val;
    }
    document.querySelector('#'+key).checked = saved;
    return saved;
}

/**
 * Get data from local storage
 * @param {string} key Key
 * @param {boolean} val Value
 */
function getValue(key, val)
{
    var saved = '';
    var keyStorage = 'planetwave_'+key;
    if(window.localStorage.getItem(keyStorage) != null)
    {
        saved = window.localStorage.getItem(keyStorage);
    }
    else
    {
        saved = val;
    }
    document.querySelector('#'+key).value = saved;
    return saved;
}

/**
 * Calculate sampling rate
 */
function calcSamplingRate()
{
    var minimumFrequency = document.querySelector('#maximum-frequency').value;
    var samplingRate = minimumFrequency * ratio;
    document.querySelector('#sampling-rate').value = samplingRate;
}

/**
 * Calculate file size
 */
function calculateFile()
{
    var duration = document.querySelector('#duration').value;
    var bitDepth = document.querySelector('#bit-depth').value;
    var channel = document.querySelector('#number-of-channel').value;
    var samplingRate = document.querySelector('#sampling-rate').value;
    var fileSize = duration * bitDepth * channel * samplingRate / 8; 
    document.querySelector('#file-size').value = Math.round(fileSize);
}

/**
 * Copy signal
 * @param {object} signal Objcet to be copied
 * @returns Object
 */
function copySignal(signal)
{
    return JSON.parse(JSON.stringify(signal));
}

/**
 * Draw all curves and points
 */
function drawAll()
{
    canvas.width = document.querySelector('.page').offsetWidth;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var signal1 = createSignal(amplitude1, period1, phase1, resolution1);
    var signal2 = createSignal(amplitude2, period2, phase2, resolution2);

    var original;
    if(selectedsource == 'noise03')
    {
        original = copySignal(signal2);
    }
    else if(selectedsource == 'combination')
    {
        original = combineSignal(signal1, signal2);
    }
    else
    {
        original = copySignal(signal1);
    }
    var sampled = sampling(original, resolution1, ratio);
    var originalCopy = copySignal(original);
    if(drawsignal1)
    {
        drawSignal(signal1, canvas, offsetX1, offsetY1, stepX, stepY, BROWN);
    }
    if(drawsignal2)
    {
        drawSignal(signal2, canvas, offsetX1, offsetY1, stepX, stepY, MEDIUM_ORCHID);
    }
    if(drawori)
    {
        drawSignal(original, canvas, offsetX1, offsetY1, stepX, stepY, RED);
    }
    if(drawsampling)
    {
        sampler(sampled, canvas, offsetX1, offsetY1, stepX, stepY, DARK_BLUE, DARK_SLATE_GRAY, unsigned);
    }
    if(drawresult)
    {
        drawSignal(sampled, canvas, offsetX1, offsetY1, stepX, stepY, GREEN);
        drawSignal(sampled, canvas, offsetX1, offsetY2, stepX, stepY, GREEN, drawpoint, DARK_GREEN);
    }
    if(drawbezierresult)
    {
        drawSignalBezier(sampled, canvas, offsetX1, offsetY3, stepX, stepY, NAVY, tension, drawpoint, BLUE);
        if (drawcompararison) 
        {
            drawSignal(originalCopy, canvas, offsetX1, offsetY3, stepX, stepY, RED);
        }
    }
    window.requestAnimationFrame(drawAll);
}

/**
 * Sampling signal
 * @param {object} signal Signal to be sampled
 * @param {number} lResolution Resolution 
 * @param {number} lRatio Sampling ratio
 */
function sampling(signal, lResolution, lRatio)
{
    var result = [];
    var max = signal.length;
    var step = Math.round(lResolution/lRatio);
    for(var i = 0; i<=max; i+=step)
    {
        if(typeof signal[i] != 'undefined')
        {
            result.push(signal[i]);
        }
    }
    return result;
}
/**
 * Create signal data
 * @param {number} lAmplitude Aplitude
 * @param {number} lPeriod Period
 * @param {number} lPhase Phase
 * @param {number} lResolution Resolution
 */
function createSignal(lAmplitude, lPeriod, lPhase, lResolution)
{
    /**
     * y = sin(x + a)
     */
    var result = [];
    var max = lResolution * lPeriod;
    var value = 0;
    var a = lPhase;
    for(var i = 0; i<=max; i++)
    {
        var v = i * Math.PI * 2 / lResolution;
        var x = v + a;
        value = Math.sin(x) * lAmplitude;
        result.push({x:i, y:value});
    }
    return result;
}

/**
 * Combine signal
 * @param {object} signal1 Wave 1
 * @param {object} signal2 Wave 2
 * @returns Combination of Wave 1 and Wave 2
 */
function combineSignal(signal1, signal2)
{
    if(signal1.length > signal2.length)
    {
        return addSignal(signal1, signal2);
    }
    else
    {
        return addSignal(signal2, signal1);
    }
}

/**
 * Add signal
 * @param {object} signal1 Wave 1
 * @param {object} signal2 Wave 2
 * @returns Combination of Wave 1 and Wave 2
 */
function addSignal(signal1, signal2)
{
    var max1 = signal1.length;
    var max2 = signal2.length;
    var y = 0;
    var i;
    var result = [];
    for(i = 0; i<max1; i++)
    {
        if(i < max2)
        {
            y = signal1[i].y + signal2[i].y;
        }
        else
        {
            y = signal1[i].y;
        }
        result.push({x:signal1[i].x, y:y});
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
function drawSignal(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, drawPoint, lPointColor)
{
    if(drawPoint)
    {
        drawPoints(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor);
    }
    if(signal.length > 1)
    {
        var length = signal.length;
        var ctx = lCanvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        var x = offsetX;
        var y = offsetY - (signal[0].y * lStepY);
        ctx.moveTo(x, y);
        for(var i = 1; i<length; i++)
        {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);     
            ctx.lineTo(x, y);
        }
        ctx.stroke(); 
    }
}

/**
 * Draw signal with Bezier
 * @param {object} signal Signal
 * @param {object} lCanvas Canvas
 * @param {number} offsetX Offset X
 * @param {number} offsetY Offset Y
 * @param {number} lStepX Step X
 * @param {number} lStepY Step Y
 * @param {string} lineColor Line color
 * @param {number} lTension Bezier tension
 * @param {boolean} drawPoint Draw point
 * @param {string} lPointColor Point color
 */
function drawSignalBezier(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, lTension, drawPoint, lPointColor) 
{
    if(drawPoint)
    {
        drawPoints(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor);
    }
    if(signal.length > 1)
    {
        var length = signal.length;
        var ctx = lCanvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        var x = offsetX;
        var y = offsetY - (signal[0].y * lStepY);
        ctx.moveTo(x, y);
        var t = (lTension != null) ? lTension : 1;
        var i;
        for(i = 0; i<length; i++)
        {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY); 
            signal[i].x = x;
            signal[i].y = y;
        }
        for (i = 0; i < length - 1; i++) 
        {
            var p0 = (i > 0) ? signal[i - 1] : signal[0];
            var p1 = signal[i];
            var p2 = signal[i + 1];
            var p3 = (i != length - 2) ? signal[i + 2] : p2;

            var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
            var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

            var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
            var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        ctx.stroke();
    }
}

/**
 * Draw points
 * @param {object} signal Signal
 * @param {object} lCanvas Canvas
 * @param {number} offsetX Offset X
 * @param {number} offsetY Offset Y
 * @param {number} lStepX Step X
 * @param {number} lStepY Step Y
 * @param {string} lPointColor Point color
 */
function drawPoints(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor)
{
    if(signal.length > 1)
    {
        var length = signal.length;
        var x = offsetX;
        var y = offsetY - (signal[0].y * lStepY);
        drawCoordinates(lCanvas, x, y, lPointColor);
        for(var i = 1; i<length; i++)
        {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);     
            drawCoordinates(lCanvas, x, y, lPointColor);
        }
    }
}

/**
 * Draw point with coordinate
 * @param {object} lCanvas Canvas
 * @param {number} x Coordinate X
 * @param {number} y Coordinate Y
 * @param {string} lPointColor Point color
 */
function drawCoordinates(lCanvas, x, y, lPointColor)
{
    var pointSize = 3;
    var ctx = lCanvas.getContext('2d');
    ctx.fillStyle = lPointColor; 
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

/**
 * Draw sampler
 * @param {object} signal Signal
 * @param {object} lCanvas Canvas
 * @param {number} offsetX Offset X
 * @param {number} offsetY Offset Y
 * @param {number} lStepX Step X
 * @param {number} lStepY Step Y
 * @param {string} lLineColor1 Line color 1 to draw sample
 * @param {string} lLineColor2 Line color 2 to drav horizontal line
 * @param {boolean} unsignedData Unsigned sample value
 */
function sampler(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lLineColor1, lLineColor2, unsignedData)
{
    var length = signal.length;
    var ctx = lCanvas.getContext('2d');
    var x = offsetX;
    var y = offsetY - (signal[0].y * lStepY);
    var i;
    if(unsignedData)
    {
        ctx.beginPath();
        ctx.strokeStyle = lLineColor1;
        for(i = 0; i<length; i++)
        {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);     
            ctx.moveTo(x, offsetY+lStepY);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = lLineColor2;
        ctx.moveTo(offsetX, offsetY + lStepY);
        ctx.lineTo(x, offsetY + lStepY);
        ctx.stroke(); 
        }
    else
    {
        ctx.beginPath();
        ctx.strokeStyle = lLineColor1;
        for(i = 0; i<length; i++)
        {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);     
            ctx.moveTo(x, offsetY);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = lLineColor2;
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(x, offsetY);
        ctx.stroke(); 
    }
}

/**
 * Validate value
 * @param {object} elem Document element
 */
function validateValue(elem)
{
    var step = elem.getAttribute('step');
    var min = elem.getAttribute('min');
    var max = elem.getAttribute('max');
    var val = elem.value;
    var minVal;
    var maxVal;
    var stepVal;
    if(step != 'any' && min != null && max != null)
    {
        minVal = parseInt(min);
        maxVal = parseInt(max);
        stepVal = parseInt(step);
        if(val % step != 0)
        {
            val = val - (val % stepVal);
        }
        if(val < minVal)
        {
            val = minVal;
        }
        if(val > maxVal)
        {
            val = maxVal;
        }
    }
    if(step == 'any')
    {
        if(min != null)
        {
            minVal = parseInt(min);
            if(val < minVal)
            {
                val = minVal;
            }
        }
        if(max != null)
        {
            maxVal = parseInt(max);
            if(val > maxVal)
            {
                val = maxVal;
            }
        }
    }
    elem.value = val;
}

window.onload = function()
{
    unsigned = getState('unsigned', unsigned);
    document.querySelector('#unsigned').addEventListener('change', function(e){
        unsigned = e.target.checked;
        setState('unsigned', unsigned);
    });

    drawsignal1 = getState('drawsignal1', drawsignal1);
    document.querySelector('#drawsignal1').addEventListener('change', function(e){
        drawsignal1 = e.target.checked;
        setState('drawsignal1', drawsignal1);
    });

    drawsignal2 = getState('drawsignal2', drawsignal2);
    document.querySelector('#drawsignal2').addEventListener('change', function(e){
        drawsignal2 = e.target.checked;
        setState('drawsignal2', drawsignal2);
    });

    selectedsource = getValue('selectedsource', selectedsource);
    document.querySelector('#selectedsource').addEventListener('change', function(e){
        selectedsource = e.target.value;
        setValue('selectedsource', selectedsource);
        if(selectedsource == 'main')
        {
            amplitude1 = 1;
        }
        else
        {
            amplitude1 = 0.7;
        }
    });
    if(selectedsource == 'main')
    {
        amplitude1 = 1;
    }
    else
    {
        amplitude1 = 0.7;
    }


    drawori = getState('drawori', drawori);
    document.querySelector('#drawori').addEventListener('change', function(e){
        drawori = e.target.checked;
        setState('drawori', drawori);
    });

    drawsampling = getState('drawsampling', drawsampling);
    document.querySelector('#drawsampling').addEventListener('change', function(e){
        drawsampling = e.target.checked;
        setState('drawsampling', drawsampling);
    });

    drawresult = getState('drawresult', drawresult);
    document.querySelector('#drawresult').addEventListener('change', function(e){
        drawresult = e.target.checked;
        setState('drawresult', drawresult);
    });

    drawbezierresult = getState('drawbezierresult', drawbezierresult);
    document.querySelector('#drawbezierresult').addEventListener('change', function(e){
        drawbezierresult = e.target.checked;
        setState('drawbezierresult', drawbezierresult);
    });
    
    drawpoint = getState('drawpoint', drawpoint);
    document.querySelector('#drawpoint').addEventListener('change', function(e){
        drawpoint = e.target.checked;
        setState('drawpoint', drawpoint);
    });

    drawcompararison = getState('drawcompararison', drawcompararison);
    document.querySelector('#drawcompararison').addEventListener('change', function (e) {
        drawcompararison = e.target.checked;
        setState('drawcompararison', drawcompararison);
    });

    var value1 = 180 * phase1 / Math.PI;  
    document.querySelector('#phase').value = value1;
    document.querySelector('#phase').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value1+')';
    document.querySelector('#phase').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        phase1 = Math.PI*value/180;
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
    });
    var value2 = ratio;
    document.querySelector('#ratio').value = value2;
    document.querySelector('#ratio').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value2+')';
    document.querySelector('#ratio').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        ratio = value;
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
        calcSamplingRate();
        calculateFile();
    });

    var value3 = tension;
    document.querySelector('#tension').value = value2;
    document.querySelector('#tension').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value3+')';
    document.querySelector('#tension').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        tension = value;
        e.target.closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value+')';
    });

    document.querySelector('#maximum-frequency').addEventListener('change', function(e){
        validateValue(e.target);
        calcSamplingRate();
        calculateFile();
    });
    document.querySelector('#duration').addEventListener('change', function(e){
        calculateFile();
    });
    document.querySelector('#bit-depth').addEventListener('change', function(e){
        validateValue(e.target);
        calculateFile();
    });
    document.querySelector('#number-of-channel').addEventListener('change', function(e){
        validateValue(e.target);
        calculateFile();
    });
    document.querySelector('#sampling-rate').addEventListener('change', function(e){
        validateValue(e.target);
        calculateFile();
    });
    calcSamplingRate();
    calculateFile();
    canvas = document.querySelector('#canvas1');
    drawAll();
}