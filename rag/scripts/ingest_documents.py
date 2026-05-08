import argparse
import json
import shutil
import subprocess
from pathlib import Path


def chunk_text(text: str, chunk_size: int = 450) -> list[str]:
    words = text.split()
    chunks = []
    for index in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[index:index + chunk_size]))
    return chunks


def extract_pdf_text(path: Path) -> str:
    pdftotext = shutil.which("pdftotext")
    if pdftotext:
        result = subprocess.run(
            [pdftotext, str(path), "-"],
            check=True,
            capture_output=True,
            text=True,
        )
        return result.stdout

    raise RuntimeError("No PDF extractor found. Install pdftotext or convert PDFs to .txt first.")


def read_document(path: Path) -> str:
    if path.suffix.lower() == ".txt":
        return path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".pdf":
        return extract_pdf_text(path)
    raise ValueError(f"Unsupported file type: {path.suffix}")


def ingest(source_dir: Path, output_file: Path) -> None:
    documents: list[dict] = []
    for path in sorted(source_dir.iterdir()):
        if not path.is_file() or path.suffix.lower() not in {".txt", ".pdf"}:
            continue
        content = read_document(path)
        for offset, chunk in enumerate(chunk_text(content)):
            documents.append(
                {
                    "id": f"{path.stem}-{offset}",
                    "source": path.name,
                    "content": chunk,
                }
            )

    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(json.dumps(documents, indent=2), encoding="utf-8")
    print(f"Wrote {len(documents)} chunks to {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", default="../data/raw")
    parser.add_argument("--output-file", default="../data/processed/knowledge_chunks.json")
    args = parser.parse_args()
    ingest(Path(args.source_dir), Path(args.output_file))
