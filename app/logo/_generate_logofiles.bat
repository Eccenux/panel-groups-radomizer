@echo off

SET tempset_OUTPATH=.\logo-

echo Generating...
CALL _svg2png.bat logo.svg %tempset_OUTPATH%icon-16.png 16
CALL _svg2png.bat logo.svg %tempset_OUTPATH%icon-32.png 32
CALL _svg2png.bat logo.svg %tempset_OUTPATH%icon-128.png 128

echo Done.
pause
