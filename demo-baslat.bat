@echo off
chcp 65001 >nul
title Akar Hali Demo Baslatici
cd /d "%~dp0"

echo ============================================================
echo   AKAR HALI - Musteri Demo Baslatici
echo ============================================================
echo.
echo  Iki pencere acilacak:
echo    1) SITE  - siteyi calistirir (kapatma!)
echo    2) TUNEL - internet adresini verir (kapatma!)
echo.
echo  TUNEL penceresinde kutu icinde su sekilde bir adres cikacak:
echo    https://xxxx-xxxx.trycloudflare.com
echo  O adresi kopyalayip musteriye gonderin.
echo.
echo  Demoyu bitirmek icin iki pencereyi de kapatin.
echo ============================================================
echo.
pause

start "Akar Hali - SITE (kapatma)" cmd /k "cd /d %~dp0 && npm start"

echo Site baslatiliyor, 7 saniye bekleniyor...
timeout /t 7 /nobreak >nul

start "Akar Hali - TUNEL (adres burada)" cmd /k ""C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000"

echo.
echo  Tamamdir! TUNEL penceresindeki trycloudflare.com adresini musteriye gonderin.
echo  Bu pencereyi kapatabilirsiniz (diger ikisini KAPATMAYIN).
echo.
pause
