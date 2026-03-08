@echo off
REM Set the current directory to the script's directory
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo ==========================================
echo       Starting Expense Tracker
echo       URL: http://localhost:8080
echo ==========================================
echo Working Directory: %CD%

if exist "mvnw.cmd" (
    echo [INFO] Found Maven Wrapper. using mvnw...
    call mvnw.cmd spring-boot:run
) else (
    if exist "apache-maven-3.9.6\bin\mvn.cmd" (
        echo [INFO] Found local Maven. using apache-maven-3.9.6...
        call "apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
    ) else (
        echo [ERROR] Could not find Maven or Maven Wrapper!
        echo Please ensure you extracted the project correctly.
        echo Listing directory contents for debugging:
        dir
        pause
        exit /b 1
    )
)

echo.
echo Application stopped.
pause
