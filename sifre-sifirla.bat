@echo off
chcp 65001 >nul
title Akar Hali - Sifre Sifirlama
cd /d "%~dp0"

echo ============================================================
echo   AKAR HALI - Yonetici Sifresini Sifirla
echo ============================================================
echo.
echo  Sifrenizi unuttuysaniz buradan yeni bir sifre belirleyebilirsiniz.
echo  (En az 6 karakter olmali.)
echo.

set "YENI="
set /p "YENI=Yeni sifreyi yazip Enter'a basin: "

if "%YENI%"=="" (
  echo.
  echo  Sifre bos birakildi, islem iptal edildi.
  echo.
  pause
  exit /b 1
)

echo.
echo Sifre guncelleniyor...
echo.
call npx tsx scripts/reset-password.mjs "%YENI%"

echo.
echo  Bittiginde yukaridaki bilgilerle panele giris yapabilirsiniz:
echo    https://xxxx.trycloudflare.com/admin/login   (veya yerelde /admin/login)
echo.
pause
