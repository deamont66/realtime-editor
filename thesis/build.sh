#!/bin/bash

FILE="BP_Šimeček_Jiří_2018"

case "$1" in
    -w | --watch )
        nodemon -x "arara \"$FILE\"" -e tex,bib -w ./
        ;;
    -x | --xelatex )
        xelatex -shell-escape "$FILE"
        ;;
    -b | --biber )
        biber "$FILE"
        ;;
    * )
        arara "$FILE"
        ;;
esac
