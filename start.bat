@echo off

set h=%time:~0,2%
set m=%time:~3,2%

set /a s=(((22-%h%-1)*60)+(60-%m%))*60

shutdown -s -f -t %s%

start /min /b "" "C:\Users\IW\Desktop\BarcodeYomirou\barcode_yomio.exe"

@REM "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk "file:///C:/Users/IW/Desktop/iwsq/index.html"
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk "https://kobakazu0429.github.io/knct_iw_sq_access_history/"
