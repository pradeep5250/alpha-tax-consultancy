from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARKER = "footer__credit"
CREDIT = (
    '<p class="footer__credit">Developed by '
    '<a href="https://www.mintxsolutions.com/" target="_blank" '
    'rel="noopener noreferrer">MintX Solutions</a></p>'
)
INDENT = "\n        "

REPLACEMENTS = [
    (
        '<div class="footer__bottom"><div class="container"><p>&copy; <span id="year"></span> Alpha Tax Consultants. All rights reserved.</p></div></div>',
        '<div class="footer__bottom"><div class="container"><p>&copy; <span id="year"></span> Alpha Tax Consultants. All rights reserved.</p>'
        + CREDIT
        + "</div></div>",
    ),
    (
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. All rights reserved.</p>',
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. All rights reserved.</p>'
        + INDENT
        + CREDIT,
    ),
    (
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. All Rights Reserved.</p>',
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. All Rights Reserved.</p>'
        + INDENT
        + CREDIT,
    ),
    (
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. <a href="../index.html">Back to Home</a></p>',
        '<p>&copy; <span id="year"></span> Alpha Tax Consultants. <a href="../index.html">Back to Home</a></p>'
        + INDENT
        + CREDIT,
    ),
]


def main() -> None:
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        if MARKER in text:
            continue
        original = text
        for old, new in REPLACEMENTS:
            if old in text:
                text = text.replace(old, new, 1)
                break
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
