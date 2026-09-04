@echo off
rem Terapkan update ini ke folder project utama dengan Robocopy.
rem Default target: D:\data C\Download\springhope-project
rem Pakai: ekstrak ZIP ini ke satu folder, lalu jalankan file ini dari dalamnya,
rem        atau jalankan: APPLY_UPDATE.cmd "D:\path\ke\project\utama"

setlocal
set "SRC=%~dp0"
set "DST=%~1"
if "%DST%"=="" set "DST=D:\data C\Download\springhope-project"

echo Menyalin dari: %SRC%
echo Ke target    : %DST%
echo.
robocopy "%SRC%" "%DST%" /E /XF .env.local APPLY_UPDATE.cmd /XD .git node_modules .output .nitro dist

rem Exit code robocopy 0-7 = sukses, >=8 = gagal
if %ERRORLEVEL% GEQ 8 (
  echo GAGAL dengan exit code %ERRORLEVEL%. Periksa output di atas.
) else (
  echo SELESAI dengan exit code %ERRORLEVEL% (0-7 = sukses).
  echo Jika folder target belum punya node_modules, jalankan: npm install
)
pause
