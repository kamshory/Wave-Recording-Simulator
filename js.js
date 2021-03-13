
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
var lineColor2 = '#00EE00';
var lineColor3 = '#0000EE';
var lineColor4 = '#000000';
var lineColor5 = '#0022FF';
var canvas;

window.onload = function()
{
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
function calcSamplingRate()
{
    var minimumFrequency = document.querySelector('#maximum-frequency').value;
    var samplingRate = minimumFrequency * ratio;
    document.querySelector('#sampling-rate').value = samplingRate;
}
function calcFile(){
    var duration = document.querySelector('#duration').value;
    var bitDepth = document.querySelector('#bit-depth').value;
    var channel = document.querySelector('#number-of-channel').value;
    var samplingRate = document.querySelector('#sampling-rate').value;
    var fileSize = duration * bitDepth * channel * samplingRate / 8; 
    document.querySelector('#file-size').value = Math.round(fileSize);
}

function drawAll()
{
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var wave1 = createWave(period, phase, resolution);
    var wave2 = sampling(wave1, resolution, ratio);

    drawWave(wave1, canvas, offsetX1, offsetY1, stepX, stepY, lineColor1);
    sampler(wave2, canvas, offsetX1, offsetY1, stepX, stepY, lineColor3, lineColor4);
    drawWave(wave2, canvas, offsetX1, offsetY1, stepX, stepY, lineColor2);
    drawWave(wave2, canvas, offsetX1, offsetY2, stepX, stepY, lineColor2);
    drawWaveSmooth(wave2, canvas, offsetX1, offsetY3, stepX, stepY, lineColor5, tension);
    window.requestAnimationFrame(drawAll);
}

/**
 * Sampling wave
 * @param {object} wave 
 * @param {number} resolution 
 * @param {number} ratio 
 */
function sampling(wave, resolution, ratio)
{
    var result = [];
    var max = wave.length;
    var step = Math.round(resolution/ratio);
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
 * @param {number} period 
 * @param {number} phase 
 * @param {number} resolution 
 */
function createWave(period, phase, resolution)
{
    /**
     * y = sin(x + a)
     */
    var result = [];
    var max = resolution * period;
    var value = 0;
    var a = phase;
    for(var i = 0; i<=max; i++)
    {
        var v = i * Math.PI * 2 / resolution;
        var x = v + a;
        value = Math.sin(x);
        result.push({x:i, y:value});
    }
    return result;
}
/**
 * Draw signal
 * @param {object} wave 
 * @param {object} canvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} stepX 
 * @param {number} stepY 
 * @param {string} lineColor 
 */
function drawWave(wave, canvas, offsetX, offsetY, stepX, stepY, lineColor)
{
    var length = wave.length;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var x = offsetX;
    var y = offsetY - (wave[0].y * stepY);
    ctx.moveTo(x, y);

    for(var i = 1; i<length; i++)
    {
        x = offsetX + (wave[i].x * stepX);
        y = offsetY - (wave[i].y * stepY);     
        ctx.lineTo(x, y);
    }
    ctx.stroke(); 
}
function drawWaveSmooth(wave, canvas, offsetX, offsetY, stepX, stepY, lineColor, tension) {
    var length = wave.length;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var x = offsetX;
    var y = offsetY - (wave[0].y * stepY);
    ctx.moveTo(x, y);

    var t = (tension != null) ? tension : 1;
    var i;
    for(i = 0; i<length; i++)
    {
        x = offsetX + (wave[i].x * stepX);
        y = offsetY - (wave[i].y * stepY); 
        wave[i].x = x;
        wave[i].y = y;
    }
    for (i = 0; i < length - 1; i++) {
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
 * Draw sampler
 * @param {object} wave 
 * @param {object} canvas 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} stepX 
 * @param {number} stepY 
 * @param {string} lineColor1 
 * @param {string} lineColor2 
 */
function sampler(wave, canvas, offsetX, offsetY, stepX, stepY, lineColor, lineColor2)
{
    var length = wave.length;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var x = offsetX;
    var y = offsetY - (wave[0].y * stepY);

    for(var i = 0; i<length; i++)
    {
        x = offsetX + (wave[i].x * stepX);
        y = offsetY - (wave[i].y * stepY);     
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = lineColor2;
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(x, offsetY);
    ctx.stroke(); 
}
