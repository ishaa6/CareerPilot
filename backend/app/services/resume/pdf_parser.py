import fitz

def extract_text(pdf_bytes):

    #Open PDF from bytes stored in memory
    doc = fitz.open(
        stream = pdf_bytes,
        filetype = "pdf"
    )

    text = ""

    for page in doc:
        text += page.get_text()

    return text