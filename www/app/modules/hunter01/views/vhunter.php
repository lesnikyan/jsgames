<html>
    <head>
        <title>Hunter 01</title>
        <style type="text/css">
            canvas#game{
                border: 1px solid silver;
            }
            h1{
                
            }
            #tools button.tool{
                width: 100px;
                color: 880000;
            }
        </style>
        <script type="text/javascript" src="/js/jquery.js"></script>
        <script type="text/javascript" src="/js/hunter01/main.js"></script>
    </head>
    <body>
        <h1>Hunter 01</h1>
        <div>
            <canvas id="game" width="400" height="300"></canvas>
        </div>
        <div id="tools">
            <button id="start" class="tool">Start</button>
            <button id="pause" class="tool">Pause</button>
            <button id="reload" class="tool">Reload</button>
            <div id="test">load...</div>
        </div>
        
    </body>
</html>