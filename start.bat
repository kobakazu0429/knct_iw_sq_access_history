@echo off

start /min /b "" "C:\Users\IW\Desktop\BarcodeYomirou\バーコード読み郎\barcode_yomio.exe"
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk "file:///C:/Users/IW/Desktop/iwsq/index.html"

set h=%time:~0,2%
set m=%time:~3,2%

set /a s=(((22-%h%-1)*60)+(60-%m%))*60

shutdown -s -f -t %s%
