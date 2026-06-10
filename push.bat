@echo off
chcp 65001 >nul
if "%~1"=="" (
  echo 사용법: push.bat "커밋 메시지"
  exit /b 1
)
git add -A
git commit -m "%~1"
git push origin master


