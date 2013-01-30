<?php $page_title = 'halma'; ?>
<?php require_once 'header.php'; ?>

<div class="center_align">
    <canvas id="halma_canvas">
        <p>Your browser is not supported by this application.</p>
        <p>Please try a more current browser that supports the HTML5 <code>canvas</code> element.</p>
    </canvas>
    <p id="move_count"></p>
</div>

<script src="js/halma.js"></script>
<script>
    initGame(document.getElementById('halma_canvas'), document.getElementById('move_count'));
</script>
<?php require_once 'footer.php'; ?>