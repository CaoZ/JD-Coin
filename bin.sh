#!/bin/bash

rm -rf data

python3 app/main.py
python3 app/main.py
python3 app/main.py

rm -rf data

python3 app/main.py -c config.wxj.json
python3 app/main.py -c config.wxj.json
python3 app/main.py -c config.wxj.json
