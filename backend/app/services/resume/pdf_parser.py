import fitz

def extract_text(pdf_bytes):

    doc = fitz.open(
        stream = pdf_bytes,
        filetype = "pdf"
    )

    text = ""

    for page in doc:
        text += page.get_text()

    return text