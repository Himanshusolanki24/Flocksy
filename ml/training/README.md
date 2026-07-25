# ML Training - Poultry Disease Detection

This directory contains the training code and trained model artifacts for the Flocksy poultry disease CNN classifier.

## Trained Models

The `artifacts-*/` directories contain pre-trained `.pt` model files (tracked via Git LFS):

| Directory | Description |
|-----------|-------------|
| `artifacts-baseline/` | Baseline training run |
| `artifacts-cpu-real/` | CPU-trained full run |
| `artifacts-smoke/` | Quick smoke test run |
| `artifacts-smoke-balanced/` | Balanced smoke test run |

## Dataset Setup

The training dataset is **not included** in this repository due to its large size (~28 GB, 524K+ images).

### Download the Dataset

1. Download the poultry disease dataset and place it in this directory with the following structure:

```
ml/training/
├── poultry_diseases/      # Original images by disease class
│   ├── cocci/
│   ├── healthy/
│   ├── ncd/
│   └── salmo/
├── dataset/               # Processed train/test/val splits
│   ├── train/
│   ├── test/
│   └── val/
└── data/                  # Raw training data
```

2. Alternatively, run the dataset preparation script:

```bash
python prepare_dataset.py
```

## Training

To train the disease detection CNN:

```bash
python train_disease_cnn.py
```

Trained model weights will be saved to `artifacts-*/best_poultry_disease_cnn.pt`.
