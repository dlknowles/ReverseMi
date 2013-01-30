<?php 
$page_title = 'home'; 
require_once 'header.php'; 
?>

<div class="center_align">
    <canvas id="game_canvas" width="400" height="400">
        <p>Your browser is not supported by this application.</p>
        <p>Please try a more current browser that supports the HTML5 <code>canvas</code> element.</p>
    </canvas>
    <div id="game_status">
        
    </div>
    <div id="button_box">
        <button id="new_game">New Game</button>
    </div>
</div>

<script src="js/reverseMi.js"></script>
<script>   
    initGame(document.getElementById('game_canvas'), document.getElementById('game_status'), document.getElementById('new_game'));
</script>

<?php require_once 'footer.php'; ?>