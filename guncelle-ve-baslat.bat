@echo off
chcp 65001 >nul
title Akar Hali - Guncelle ve Baslat
cd /d "%~dp0"

echo ============================================================
echo   AKAR HALI - Guncelle ve Baslat
echo ============================================================
echo.
echo  Bu dosya once son degisiklikleri DERLER (build), sonra
echo  siteyi ve tuneli baslatir. Kod her degistiginde BUNU kullanin.
echo ============================================================
echo.

echo [1/3] Calisan eski site kapatiliyor (port 3000)...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000" ^| findstr LISTENING') do taskkill /PID %%p /F >nul 2>&1
echo.

echo [2/3] Degisiklikler derleniyor... (1-2 dakika surebilir, bekleyin)
echo.
call npm run build
if errorlevel 1 (
  echo.
  echo  HATA: Build basarisiz oldu. Yukaridaki hata mesajini kontrol edin.
  echo.
  pause
  exit /b 1
)

echo.
echo [3/3] Build tamam! Site ve tunel baslatiliyor...
echo.

start "Akar Hali - SITE (kapatma)" cmd /k "cd /d %~dp0 && npm start"

echo Site baslatiliyor, 7 saniye bekleniyor...
timeout /t 7 /nobreak >nul

start "Akar Hali - TUNEL (adres burada)" cmd /k ""C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000"

echo.
echo  Tamamdir! TUNEL penceresindeki trycloudflare.com adresini musteriye gonderin.
echo  Bu pencereyi kapatabilirsiniz (diger ikisini KAPATMAYIN).
echo.
pause
