#!/bin/bash
set -e

cleanup() {
  rm -f whitepaper.aux whitepaper.toc whitepaper.out whitepaper.log \
        whitepaper.synctex.gz whitepaper.fls whitepaper.fdb_latexmk
  rm -f output/whitepaper.aux output/whitepaper.toc output/whitepaper.out \
        output/whitepaper.log output/whitepaper.synctex.gz \
        output/whitepaper.fls output/whitepaper.fdb_latexmk output/texput.log
}

trap cleanup EXIT

mkdir -p output
pdflatex -output-directory output whitepaper.tex
pdflatex -output-directory output whitepaper.tex
