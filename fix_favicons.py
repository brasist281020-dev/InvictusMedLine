import re

files = [
    r'd:\Desktop\AGInvictus\krok3-pediatrics.html',
    r'd:\Desktop\AGInvictus\krok3-pediatrics-2025.html',
    r'd:\Desktop\AGInvictus\krok3-family-med.html',
    r'd:\Desktop\AGInvictus\krok3-ophthalmology.html',
    r'd:\Desktop\AGInvictus\news.html',
]

new_tag = '    <link rel="icon" type="image/svg+xml" href="favicon.svg">'

# Pattern: matches the multi-line stethoscope emoji favicon link
pattern = re.compile(
    r'    <link rel="icon"\s*\n\s*href="data:image/svg\+xml,[^"]*🩺[^"]*">',
    re.MULTILINE
)

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content, count = pattern.subn(new_tag, content)

    if count > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'[OK] Replaced {count} favicon(s) in: {path}')
    else:
        print(f'[SKIP] No match in: {path}')
