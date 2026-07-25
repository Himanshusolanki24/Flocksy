import kagglehub
import sys

# ---------------------------------------------------------
# UPDATE THESE VARIABLES BEFORE RUNNING
# ---------------------------------------------------------
# Your Kaggle username and the name you want for the dataset
# Example: 'himanshusolanki24/flocksy-poultry-diseases'
HANDLE = 'hemusolanki/flocksy-data'

# The directory you want to upload
# You can change this to upload the other folders if needed.
# Options: 'ml/training/dataset', 'ml/training/data', 'ml/training/poultry_diseases'
LOCAL_DATASET_DIR = 'ml/training/data.nosync' 
# ---------------------------------------------------------

if HANDLE == '<KAGGLE_USERNAME>/<DATASET_SLUG>':
    print("Error: Please update the HANDLE variable in this script with your Kaggle username and dataset slug.")
    sys.exit(1)

print(f"Starting upload of {LOCAL_DATASET_DIR} to {HANDLE}...")

try:
    # Upload the dataset using kagglehub
    kagglehub.dataset_upload(
        handle=HANDLE,
        local_dataset_dir=LOCAL_DATASET_DIR,
        version_notes="Initial dataset upload"
    )
    print("Upload complete!")
except Exception as e:
    print(f"An error occurred during upload: {e}")
    print("\nNote: Make sure you have authenticated with Kaggle.")
    print("You may need to place your kaggle.json API token in ~/.kaggle/kaggle.json")
