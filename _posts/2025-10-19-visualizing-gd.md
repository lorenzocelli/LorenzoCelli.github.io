---
layout: post
author: lorenzo
title: "Visualizing Gradient Descent with WebGL"
hidden: true
---

<div class="bg-dark-800 rounded-1">
    <canvas id="canvas" style="width: 100%; border-radius: 4px;"></canvas>
    <div class="p-2">
        X:
        <input value="-0.5" class="w-16 color-dark-100 bg-dark-700 border-x-0 border-b-1 border-t-0 focus_border-white outline-none">
        Y:
        <input value="0.9" class="w-16 color-dark-100 bg-dark-700 border-x-0 border-b-1 border-t-0 focus_border-white outline-none">
    </div>
</div>

<script src="/assets/js/plot2d.js"></script>

<div>
X: <input id="startX" type="text" value="-0.5" style="padding: 5px; background-color: transparent; color: white; border: 1px solid gray; border-radius:4px; width: 60px; outline: none;">
Y: <input id="startY" type="text" value="0.9" style="padding: 5px; background-color: transparent; color: white; border: 1px solid gray; border-radius:4px; width: 60px; outline: none;">
<div class="bg-dark-subtle" style="cursor: pointer; padding: 5px; border-radius:4px; border: 1px solid gray; display: inline-block; user-select: none;"
onclick="restartGD(document.getElementById('startX').value, document.getElementById('startY').value);"
>
    Restart
</div>
</div>
