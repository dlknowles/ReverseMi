<?php 
$page_title = 'home'; 
require_once 'header.php'; 
?>

<canvas id="game_canvas" width="320" height="320">
    <p>Your browser is not supported by this application.</p>
    <p>Please try a more current browser that supports the HTML5 <code>canvas</code> element.</p>
</canvas>
<div id="game_status">

</div>
<div id="button_box" class="btn-group">
    <button id="new_game" type="button" class="btn btn-primary">New Game</button>
</div>


<script src="js/disk.js"></script>
<script src="js/board.js"></script>
<script src="js/reverseMi.js"></script>
<script>   
    function page_load() {
        initGame(document.getElementById('game_canvas'), document.getElementById('game_status'), document.getElementById('new_game'));
    }    
</script>

<?php require_once 'footer.php'; ?>