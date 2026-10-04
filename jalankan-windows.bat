@echo off
cd /d "%~dp0"
echo Buka http://localhost:8080 di browser. Hentikan dengan Ctrl+C.
python -m http.server 8080 --bind 127.0.0.1
pause
