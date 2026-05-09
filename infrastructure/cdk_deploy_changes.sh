#!/bin/bash

source .venv/bin/activate
cdk deploy "${@:---all}"