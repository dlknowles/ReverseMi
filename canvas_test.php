<?php $page_title = 'canvas tutorial'; ?>
<?php require_once 'header.php'; ?>

<div class="center_align">
    <canvas id="a" width="500" height="375">
        <p>Your browser is not supported by this application.</p>
        <p>Please try a more current browser that supports the HTML5 <code>canvas</code> element.</p>
    </canvas>
</div>

<script>
    var a_canvas        = document.getElementById('a'),
        a_context       = a_canvas.getContext('2d'),
        a_canvas_width  = a_canvas.width,
        a_canvas_height = a_canvas.height;

    var drawGrid = function() {
        for (var x = 0.5; x < a_canvas_width; x += 10) {
            a_context.moveTo(x, 0);
            a_context.lineTo(x, a_canvas_height);
        }

        for (var y = 0.5; y < a_canvas_height; y += 10) {
            a_context.moveTo(0, y);
            a_context.lineTo(a_canvas_width, y);
        }

        a_context.strokeStyle = "#eeeeee";
        a_context.stroke();

        a_context.beginPath();
        a_context.moveTo(0, 40);
        a_context.lineTo(240, 40);
        a_context.moveTo(260, 40);
        a_context.lineTo(500, 40);
        a_context.moveTo(495, 35);
        a_context.lineTo(500, 40);
        a_context.lineTo(495, 45);
        a_context.moveTo(60, 0);
        a_context.lineTo(60, 153);
        a_context.moveTo(60, 173);
        a_context.lineTo(60, 375);
        a_context.moveTo(65, 370);
        a_context.lineTo(60, 375);
        a_context.lineTo(55, 370);

        a_context.strokeStyle = "#000000";
        a_context.stroke();

        a_context.font = 'bold 12px sans-serif';
        a_context.fillText('x', 248, 43);
        a_context.fillText('y', 58, 165);

        a_context.textBaseline = 'top';
        a_context.fillText('(0, 0)', 8, 5);

        a_context.textAlign = 'right';
        a_context.textBaseline = 'bottom';
        a_context.fillText('(500, 375)', 492, 370);

        a_context.fillRect(0, 0, 3, 3);
        a_context.fillRect(497, 372, 3, 3);
    };

    drawGrid();
</script>
<?php require_once 'footer.php'; ?>