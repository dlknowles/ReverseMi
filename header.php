<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link href="styles/main.css" rel="stylesheet"/>
        <script src="js/disk.js"></script>
        <script src="js/board.js"></script>
        <!-- [if lt IE 9]><script src="js/html5shiv.js"></script><![endif]-->
        <title><?= (isset($page_title) ? $page_title : '') ?></title>
    </head>
    <body>
        <div id="site_wrapper">
            <div id="site_header">
                <h1>demo</h1>
            </div>
            <?php require_once 'navigation.php'; ?>
            <div id="site_content">
                <h2><?= (isset($page_title) ? $page_title : '') ?></h2>