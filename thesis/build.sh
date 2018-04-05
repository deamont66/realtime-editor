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
        arara "$FILE"
        ;;
esac
