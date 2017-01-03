#!/bin/bash

set -e

npm run build
aws s3 sync ./build s3://colorme.io
