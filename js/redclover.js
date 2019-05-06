var canvas = document.getElementById('comic');
    var context = canvas.getContext('2d');

    canvas.width = $('#sketchContainer').outerWidth();
    canvas.height = (canvas.width / 800) * 400;
    $('#sketchContainer').outerHeight(String(canvas.height) + "px", true);

    var oWidth = canvas.width;
    var oHeight = canvas.height;
    var lines = [];

    var lastMouse = {
        x: 0,
        y: 0
    };

    var ongoingTouches = [];

    context.lineWidth = $(".brush-size").value;//2;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = $(".sp-preview-inner").css("background-color");//'#000';

    canvas.addEventListener('mousedown', function(e) {
        lastMouse = {
            x: e.pageX - this.offsetLeft,
            y: e.pageY - this.offsetTop
        };
        canvas.addEventListener('mousemove', move, false);
    }, false);

    canvas.addEventListener('mouseout', function() {
        canvas.removeEventListener('mousemove', move, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', move, false);
    }, false);

    canvas.addEventListener('touchstart', touchstart, false);
    canvas.addEventListener('touchend', touchend, false);
    canvas.addEventListener('touchcancel', touchcancel, false);
    canvas.addEventListener('touchleave', touchend, false);
    canvas.addEventListener('touchmove', touchmove, false);

    function setSize(size) {
        context.lineWidth = size;
    }

    function setColor(color) {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = color;
    }

    function eraser() {
        context.globalCompositeOperation = 'destination-out';
        context.strokeStyle = 'rgba(0,0,0,1)';
    }

    function clear(send) {
        var m = confirm("Do you want to clear the picture?");
        if (m) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            lines = [];
            book.draw()
            if (send && TogetherJS.running) {
                TogetherJS.send({
                    type: 'clear'
                });
            }
        }
    }

    function reDraw(lines) {
        for (var i in lines) {
            draw(lines[i][0], lines[i][1], lines[i][2], lines[i][3], lines[i][4], false);
        }
    }

    function draw(start, end, color, size, compositeOperation, save) {
        context.save();
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.scale(canvas.width / 800, canvas.height / 400);
        context.strokeStyle = color;
        context.globalCompositeOperation = compositeOperation;
        context.lineWidth = size;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
        context.restore();
        if (save) {
            lines.push([{
                x: start.x,
                y: start.y
            }, {
                x: end.x,
                y: end.y
            }, color, size, compositeOperation]);
        }
    }

    function move(e) {
        var mouse = {
            x: e.pageX - this.offsetLeft,
            y: e.pageY - this.offsetTop
        };
        sendMouse = {
            x: (800 / canvas.width) * mouse.x,
            y: (400 / canvas.height) * mouse.y
        };
        sendLastMouse = {
            x: (800 / canvas.width) * lastMouse.x,
            y: (400 / canvas.height) * lastMouse.y
        };
        draw(sendLastMouse, sendMouse, $(".sp-preview-inner").css("background-color"), $(".brush-size").value, context.globalCompositeOperation, true);
        if (TogetherJS.running) {
            TogetherJS.send({
                type: 'draw',
                start: sendLastMouse,
                end: sendMouse,
                color: context.strokeStyle,
                size: context.lineWidth,
                compositeOperation: context.globalCompositeOperation
            });
        }
        lastMouse = mouse;
    }

    function convertTouch(touch) {
        return {
            x: (800 / canvas.width) * (touch.pageX - canvas.offsetLeft),
            y: (400 / canvas.height) * (touch.pageY - canvas.offsetTop),
            identifier: touch.identifier
        };
    }

    function searchOngoingTouches(identifier) {
        for (var i = 0; i < ongoingTouches.length; i++) {
            if (ongoingTouches[i].identifier == identifier) {
                return i;
            }
        }
        return -1;
    }

    function touchstart(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var idx = searchOngoingTouches(touches[i].identifier);
            ongoingTouches.push(convertTouch(touches[i]));
        }
    }

    function touchmove(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var idx = searchOngoingTouches(touches[i].identifier);
            if (idx >= 0) {
                var lastTouch = ongoingTouches[idx];
                var touch = convertTouch(touches[i]);
                draw(lastTouch, touch, context.strokeStyle, context.lineWidth, context.globalCompositeOperation, true);
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: 'draw',
                        start: lastTouch,
                        end: touch,
                        color: context.strokeStyle,
                        size: context.lineWidth,
                        compositeOperation: context.globalCompositeOperation
                    });
                }
                ongoingTouches.splice(idx, 1, touch);
            }
        }
    }

    // Called whenever touchend or touchleave events are fired
    function touchend(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var idx = searchOngoingTouches(touches[i].identifier);
            if (idx >= 0) {
                var lastTouch = ongoingTouches[idx];
                var touch = convertTouch(touches[i]);
                draw(lastTouch, touch, context.strokeStyle, context.lineWidth, context.globalCompositeOperation, true);
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: 'draw',
                        start: lastTouch,
                        end: touch,
                        color: context.strokeStyle,
                        size: context.lineWidth,
                        compositeOperation: context.globalCompositeOperation
                    });
                }
                ongoingTouches.splice(idx, 1);
            }
        }
    }

    function touchcancel(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var idx = searchOngoingTouches(touches[i].identifier);
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1);
            }
        }
    }

    TogetherJS.hub.on('draw', function(msg) {
        if (!msg.sameUrl) {
            return;
        }
        draw(msg.start, msg.end, msg.color, msg.size, msg.compositeOperation, true);
    });

    TogetherJS.hub.on('page', function(msg) {
        if (!msg.sameUrl) {
            return;
        }

        window.location.href="#" + msg.pageNumber
    });

    TogetherJS.hub.on('clear', function(msg) {
        if (!msg.sameUrl) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        lines = [];
        book.draw()
    });

    TogetherJS.hub.on('togetherjs.hello', function() {
        TogetherJS.send({
            type: 'init',
            lines: lines,
            urlHash: window.location.hash.substring(1)
        });
    });

    TogetherJS.hub.on('init', function(msg) {
        reDraw(msg.lines);
        lines = msg.lines;
        if(msg.urlHash != window.location.hash){
        	window.location.href = "#"+msg.urlHash
        }
    });

    $(document).ready(function() {
        function changeMouse() {
            var cursorSize = context.lineWidth * (canvas.width / 800);
            if (cursorSize < 10) {
                cursorSize = 10;
            }
            var cursorColor = context.strokeStyle;
            var cursorGenerator = document.createElement('canvas');
            cursorGenerator.width = cursorSize;
            cursorGenerator.height = cursorSize;
            var ctx = cursorGenerator.getContext('2d');

            var centerX = cursorGenerator.width / 2;
            var centerY = cursorGenerator.height / 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, (cursorSize / 2) - 4, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.strokeStyle = cursorColor;
            ctx.stroke();
            $('#comic').css('cursor', 'url(' + cursorGenerator.toDataURL('image/png') + ') ' + cursorSize / 2 + ' ' + cursorSize / 2 + ',crosshair');
        }
        changeMouse();

        $(window).resize(function() {
            if ($('#sketchContainer').width() != oWidth) {
                canvas.width = $('#sketchContainer').width();
                canvas.height = (canvas.width / 800) * 400;
                $('#sketchContainer').outerHeight(String(canvas.height) + "px", true);
                var ratio = canvas.width / oWidth;
                oWidth = canvas.width;
                oHeight = canvas.height;
                reDraw(lines);
                changeMouse();
            }
        });

        $('.clear').click(function() {
            clear(true);
        });

        // TogetherJS user color:
        $('.user-color-pick').click(function() {
            setColor(TogetherJS.require('peers').Self.color);
            changeMouse();
        });

        $(".brush-size").on("input", function(){
            setSize($(this)[0].value);
            changeMouse();
        });

        $("#picker").spectrum({
            preferredFormat: "rgb",
            showPaletteOnly: true,
            togglePaletteOnly: true,
            togglePaletteMoreText: 'more',
            togglePaletteLessText: 'less',
            showButtons: false,
            showInput: true,
            color: 'black',
            palette: [
                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
            ],
            change: function(color){
                setColor(color.toHexString());
                changeMouse();
                $(".dropdown").hide()
            }
        });

        $("#picker").on("dragstop.spectrum", function(e, color){
            setColor(color.toHexString());
            changeMouse();
        });

        $(".sp-container").mouseover(function(){
            $(".dropdown").show();
        })
    });

    book.draw();

    $(window).on('resize', function(event) {
        book.draw();
    });