#!/bin/bash

FILE="BP_Šimeček_Jiří_2018"

case "$1" in
    -w | --watch )
        nodemon -x "arara \"$FILE\"" -e tex,bib -w ./
        ;;
    -x | --xelatex )
        xelatex -shell-escape "$FILE"
        ;;
    -g | --glossaries )
        makeglossaries "$FILE"
        ;;
    -b | --biber )
        biber "$FILE"
        ;;
    -c | --clear )
        # expects all files for clean to be ignored and match patterns in command below
        git clean -e BP_* -e *.log -X -i
        ;;
    * )
        time arara "$FILE"
        if [ $? -eq 0 ]; then
            echo -e "\nBuild: SUCCESS"
            open "$FILE.pdf" # non OSX equivalent is command xdg-open
        else
            echo -e "\nBuild: FAILURE"
        fi
        ;;
esac
