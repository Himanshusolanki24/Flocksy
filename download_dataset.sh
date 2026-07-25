#!/bin/bash
# -----------------------------------------------------------------------------
# Flocksy ML Dataset Download Script
# -----------------------------------------------------------------------------
# Since the ML dataset is around 28 GB, it is not stored directly in this Git 
# repository to keep cloning fast.
#
# Instructions for setup:
# 1. Upload your 'ml_datasets.zip' file to a cloud provider (e.g. Google Drive, S3, Kaggle).
# 2. Update the 'DATASET_URL' variable below with your actual download link.
# 3. Run this script from the project root: ./download_dataset.sh
# -----------------------------------------------------------------------------

set -e

# TODO: Replace this with the actual public URL of your uploaded zip file
DATASET_URL="https://example.com/path/to/your/ml_datasets.zip"
ZIP_FILE="ml_datasets.zip"

echo "Downloading ML datasets..."
# Example using curl (update flags based on your cloud provider)
# curl -L -o "$ZIP_FILE" "$DATASET_URL"
echo "Please update the script with the actual download link in $0"
echo "Once updated, uncomment the curl command."

# Example for extraction once download is working:
# echo "Extracting datasets..."
# unzip -q "$ZIP_FILE"
# rm "$ZIP_FILE"
# echo "Datasets successfully placed in ml/training/"
