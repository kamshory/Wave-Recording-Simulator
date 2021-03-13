var period = 5;
var resolution = 256;

/**
 * Phase for analog signal
 */
var phase = Math.PI/2;

/**
 * Ratio between sampling rate to highest analog frequency
 */
var ratio = 2;

/**
 * Tension to smooth wave
 */
var tension = 1;

var offsetX1 = 10;
var offsetY1 = 100;
var offsetY2 = 300;
var offsetY3 = 500;
var stepX = 1;
var stepY = 80;
var lineColor1 = '#EE0000';
var lineColor2 = '#22FF22';
var pointColor2 = '#00DD00';
var lineColor3 = '#0000DD';
var lineColor4 = '#222222';
var lineColor5 = '#2222FF';
var pointColor5 = '#0000EE';
var canvas;

var unsigned = false;
var drawori = true;
var drawsampling = true;
var drawresult = true;
var drawbezierresult = true;
var drawpoint = false;

/**
 * Save data to local storage
 * @param {string} key Key
 * @param {boolean} val Value
 */
function setState(key, val)
{
     var keyStorage = 'planetwave_'+key;
     if(val)
     {
         window.localStorage.setItem(keyStorage, '1');
     }
     else
     {
         window.localStorage.setItem(keyStorage, '0');
     }
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
function calcFile(){
    var duration = document.querySelector('#duration').value;
    var bitDepth = document.querySelector('#bit-depth').value;
    var channel = document.querySelector('#number-of-channel').value;
    var samplingRate = document.querySelector('#sampling-rate').value;
    var fileSize = duration * bitDepth * channel * samplingRate / 8; 
    document.querySelector('#file-size').value = Math.round(fileSize);
}

/**
 * Draw all curve
 */
function drawAll()
{
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var wave1 = createWave(period, phase, resolution);
    var wave2 = sampling(wave1, resolution, ratio);

    if(drawori)
    {
        drawWave(wave1, canvas, offsetX1, offsetY1, stepX, stepY, lineColor1);
    }
    if(drawsampling)
    {
        sampler(wave2, canvas, offsetX1, offsetY1, stepX, stepY, lineColor3, lineColor4, unsigned);
    }
    if(drawresult)
    {
        drawWave(wave2, canvas, offsetX1, offsetY1, stepX, stepY, lineColor2);
        drawWave(wave2, canvas, offsetX1, offsetY2, stepX, stepY, lineColor2, drawpoint, pointColor2);
    }
    if(drawbezierresult)
    {
        drawWaveBezier(wave2, canvas, offsetX1, offsetY3, stepX, stepY, lineColor5, tension, drawpoint, pointColor5);
    }
    window.requestAnimationFrame(drawAll);
}

/**
 * Sampling wave
 * @param {object} wave 
 * @param {number} lResolution 
 * @param {number} lRatio 
 */
function sampling(wave, lResolution, lRatio)
{
    var result = [];
    var max = wave.length;
    var step = Math.round(lResolution/lRatio);
    for(var i = 0; i<=max; i+=step)
    {
        if(typeof wave[i] != 'undefined')
        {
            result.push(wave[i]);
        }
    }
    return result;
}
/**
 * Create wave data
 * @param {number} lPeriod 
 * @param {number} lPhase 
 * @param {number} lResolution 
 */
function createWave(lPeriod, lPhase, lResolution)
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
        value = Math.sin(x);
        result.push({x:i, y:value});
    }
    return result;
}

/**
 * Draw signal
 * @param {object} wave 
 * @param {object} lCanvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} lStepX 
 * @param {number} lStepY 
 * @param {string} lineColor 
 */
function drawWave(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, drawPoint, lPointColor)
{
    if(drawPoint)
    {
        drawPoints(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor);
    }
    var length = wave.length;
    var ctx = lCanvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var x = offsetX;
    var y = offsetY - (wave[0].y * lStepY);
    ctx.moveTo(x, y);

    for(var i = 1; i<length; i++)
    {
        x = offsetX + (wave[i].x * lStepX);
        y = offsetY - (wave[i].y * lStepY);     
        ctx.lineTo(x, y);
    }
    ctx.stroke(); 
}

/**
 * Draw signal with Bezier
 * @param {object} wave 
 * @param {object} lCanvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} lStepX 
 * @param {number} lStepY 
 * @param {string} lineColor 
 * @param {number} lTension 
 * @param {boolean} drawPoint 
 * @param {string} lPointColor 
 */
function drawWaveBezier(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, lTension, drawPoint, lPointColor) 
{
    if(drawPoint)
    {
        drawPoints(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor);
    }
    var length = wave.length;
    var ctx = lCanvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var x = offsetX;
    var y = offsetY - (wave[0].y * lStepY);
    ctx.moveTo(x, y);

    var t = (lTension != null) ? lTension : 1;
    var i;
    for(i = 0; i<length; i++)
    {
        x = offsetX + (wave[i].x * lStepX);
        y = offsetY - (wave[i].y * lStepY); 
        wave[i].x = x;
        wave[i].y = y;
    }
    for (i = 0; i < length - 1; i++) 
    {
        var p0 = (i > 0) ? wave[i - 1] : wave[0];
        var p1 = wave[i];
        var p2 = wave[i + 1];
        var p3 = (i != length - 2) ? wave[i + 2] : p2;

        var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
        var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

        var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
        var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.stroke();
}

/**
 * Draw points
 * @param {object} wave 
 * @param {object} lCanvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} lStepX 
 * @param {number} lStepY 
 * @param {string} lPointColor 
 */
function drawPoints(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor)
{
    var length = wave.length;
    var x = offsetX;
    var y = offsetY - (wave[0].y * lStepY);
    drawCoordinates(lCanvas, x, y, lPointColor);

    for(var i = 1; i<length; i++)
    {
        x = offsetX + (wave[i].x * lStepX);
        y = offsetY - (wave[i].y * lStepY);     
        drawCoordinates(lCanvas, x, y, lPointColor);
    }
}

/**
 * Draw point with coordinate
 * @param {object} lCanvas 
 * @param {number} x 
 * @param {number} y 
 * @param {string} lPointColor 
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
 * @param {object} wave 
 * @param {object} lCanvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} lStepX 
 * @param {number} lStepY 
 * @param {string} lineColor1 
 * @param {string} lLineColor2 
 */
function sampler(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lLineColor, lLineColor2, unsignedData)
{
    var length = wave.length;
    var ctx = lCanvas.getContext('2d');
    var x = offsetX;
    var y = offsetY - (wave[0].y * lStepY);
    var i;

    if(unsignedData)
    {
        ctx.beginPath();
        ctx.strokeStyle = lLineColor;
        for(i = 0; i<length; i++)
        {
            x = offsetX + (wave[i].x * lStepX);
            y = offsetY - (wave[i].y * lStepY);     
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
        ctx.strokeStyle = lLineColor;
        for(i = 0; i<length; i++)
        {
            x = offsetX + (wave[i].x * lStepX);
            y = offsetY - (wave[i].y * lStepY);     
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

window.onload = function()
{
    unsigned = getState('unsigned', unsigned);
    document.querySelector('#unsigned').addEventListener('change', function(e){
        unsigned = e.target.checked;
        setState('unsigned', unsigned);
    });

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
    
    var value1 = 180 * phase / Math.PI;  
    document.querySelector('#phase').value = value1;
    document.querySelector('#phase').closest('.control-wrapper').querySelector('.value').innerHTML = ' ('+value1+')';
    document.querySelector('#phase').addEventListener('change', function(e){
        var value = parseFloat(e.target.value);
        phase = Math.PI*value/180;
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
        calcFile();
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
        calcSamplingRate();
        calcFile();
    });
    document.querySelector('#duration').addEventListener('change', function(e){
        calcFile();
    });
    document.querySelector('#bit-depth').addEventListener('change', function(e){
        calcFile();
    });
    document.querySelector('#number-of-channel').addEventListener('change', function(e){
        calcFile();
    });
    document.querySelector('#sampling-rate').addEventListener('change', function(e){
        calcFile();
    });
    calcSamplingRate();
    calcFile();
    canvas = document.querySelector('#canvas1');
    drawAll();
}