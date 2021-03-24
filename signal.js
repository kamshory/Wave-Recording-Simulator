var data1 = [];
var data2 = [];
var sample1 = [];
var sample2 = [];
var range1 = 0;
var range2 = 0;
var minMaxSignal = 200;
function encodeData(buffer) {
    var result = [];
    for (var i in buffer) {
        result.push({ x: parseInt(i), y: buffer[i] * minMaxSignal });
    }
    return result;
}
function initMedia() {
    var constraints = { audio: true, video: false };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            var audioContext = new AudioContext();
            var scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
            var source = audioContext.createMediaStreamSource(stream);
            source.connect(scriptNode);
            scriptNode.connect(audioContext.destination);
            scriptNode.onaudioprocess = function (event) {
                data1 = encodeData(event.inputBuffer.getChannelData('0'));
                if (event.inputBuffer.numberOfChannels > 1) {
                    data2 = encodeData(event.inputBuffer.getChannelData('1'));
                }
                else {
                    data2 = JSON.parse(JSON.stringify(data1));
                }
            }
        })
        .catch(function (err) {
        });
}

function draw() {
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var offsetX = 10;
    var offsetY = minMaxSignal + 10;
    var offsetY2 = (minMaxSignal * 3) + 20;
    var lStepX = 1;
    var lStepY = 1;
    var lineColor1 = '#009900';
    var lineColor2 = '#FF0000';
    var bezierTension = 1;
    var drawPoint = true;
    sample1 = getSample(data1, range1, range2);
    sample2 = getSample(data2, range1, range2);


    drawGrid(canvas, 10, canvas.width - 10, offsetY2 - minMaxSignal, offsetY2 + minMaxSignal, 10, 10, '#999999');
    drawSignal(data1, canvas, offsetX, offsetY, lStepX, lStepY, lineColor1)
    drawSignalBezier(sample1, canvas, offsetX, offsetY2, lStepX, lStepY, lineColor2, bezierTension, drawPoint, lineColor2);
    window.requestAnimationFrame(draw);
}

function drawGrid(lCanvas, x1, x2, y1, y2, stepx, stepy, lineColor)
{
    var ctx = lCanvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    var i;
    for(i = x1; i <= x2; i += stepx)
    {
        ctx.moveTo(i, y1);
        ctx.lineTo(i, y2);
    }
    for(i = y1; i <= y2; i += stepy)
    {
        ctx.moveTo(x1, i);
        ctx.lineTo(x2, i);
    }
    ctx.stroke();
}

/**
 * Draw signal
 * @param {object} wave Wave
 * @param {object} lCanvas Canvas
 * @param {number} offsetX Offset X
 * @param {number} offsetY Offset Y
 * @param {number} lStepX Step X
 * @param {number} lStepY Step Y
 * @param {string} lineColor Line color
 */
function drawSignal(wave, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor) {
    if (wave.length > 1) {
        var length = wave.length;
        var ctx = lCanvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        var x = offsetX;
        var y = offsetY - (wave[0].y * lStepY);
        ctx.moveTo(x, y);

        for (var i = 1; i < length; i++) {
            x = offsetX + (wave[i].x * lStepX);
            y = offsetY - (wave[i].y * lStepY);
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
function drawSignalBezier(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lineColor, lTension, drawPoint, lPointColor) {
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
        var t = (lTension != null) ? lTension : 1;
        var i;
        for (i = 0; i < length; i++) {
            x = offsetX + (signal[i].x * lStepX);
            y = offsetY - (signal[i].y * lStepY);
            signal[i].x = x;
            signal[i].y = y;
        }
        for (i = 0; i < length - 1; i++) {
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
function drawPoints(signal, lCanvas, offsetX, offsetY, lStepX, lStepY, lPointColor) {
    if (signal.length > 1) {
        var length = signal.length;
        var x = offsetX;
        var y = offsetY - (signal[0].y * lStepY);
        drawCoordinates(lCanvas, x, y, lPointColor);
        for (var i = 1; i < length; i++) {
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
function drawCoordinates(lCanvas, x, y, lPointColor) {
    var pointSize = 3;
    var ctx = lCanvas.getContext('2d');
    ctx.fillStyle = lPointColor;
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

$(document).ready(function () {
    range1 = $('input[name="range1"]').val();
    range2 = $('input[name="range2"]').val();

    $('.range_min').html(range1);
    $('.range_max').html(range2);


    $('input[type="range"]').on('input', rangeInputChangeEventHandler);
    initMedia();
    draw();
})

function resample(data, range1, range2, scale) {
    var data2 = [];
    if (data.length > 0) {
        var i = 0;
        var j = 0;
        var k = 0;
        for (i = range1, j = 0; i < range2; i++, j++) {
            k = j * scale;
            data2[j] = { x: k, y: data[i].y };
        }
    }
    return data2;
}
function getSample(data, range1, range2) {
    var v1 = range1;
    var v2 = range2;
    if (v1 > v2) {
        range1 = v2;
        range2 = v1;
    }
    var r1 = data.length;
    var r2 = range2 - range1;
    var scale = Math.round(r1 / r2);
    return resample(data, range1, range2, scale);
}

function addSeparator(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

function rangeInputChangeEventHandler(e) {
    var rangeGroup = $(this).attr('name');
    var minBtn = $(this).parent().children('.min');
    var maxBtn = $(this).parent().children('.max');
    var range_min = $(this).parent().children('.range_min');
    var range_max = $(this).parent().children('.range_max');
    var minVal = parseInt($(minBtn).val());
    var maxVal = parseInt($(maxBtn).val());
    var origin = $(this).context.className;

    if (origin === 'min' && minVal > maxVal - 5) {
        $(minBtn).val(maxVal - 5);
    }
    minVal = parseInt($(minBtn).val());
    $(range_min).html(minVal);

    if (origin === 'max' && maxVal - 5 < minVal) {
        $(maxBtn).val(5 + minVal);
    }
    maxVal = parseInt($(maxBtn).val());

    range1 = minVal;
    range2 = maxVal;

    $(range_max).html(maxVal);
}