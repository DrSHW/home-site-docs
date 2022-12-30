# create folder named 1,2,3,4,5,6,7,8,9
# in each foler, create 1.md, 2.md and 3.md
# write these lines into the md file
# ---
# description: 计算机网络
# layout: ../../layouts/MainLayout.astro
# ---
# thanks copilot for the code

for ($i = 1; $i -le 9; $i++) {
    mkdir $i
    Set-Location $i
    for ($j = 1; $j -le 3; $j++) {
        $content = "---
description: 计算机网络
layout: ../../../layouts/MainLayout.astro
---"
        $content | Out-File "$j.md"
    }
    Set-Location ..
}