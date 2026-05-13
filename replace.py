import re
import os

try:
    with open('krok3-pediatrics.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove easter egg vars & function
    content = re.sub(r'let easterEggClicks = 0;[\s\S]*?function initTheme\(\) {', 'function initTheme() {', content)

    # Remove easter egg span logic
    content = re.sub(
        r'class=\"text-\[10px\] font-black uppercase tracking-\[0\.2em\] italic \$\{q\.displayNumber === 67 \? \'cursor-pointer select-none\' : \'\'\}\" \$\{q\.displayNumber === 67 \? \'onclick=\"handleEasterEgg\(\)\"\' : \'\'\}', 
        'class=\"text-[10px] font-black uppercase tracking-[0.2em] italic\"', 
        content
    )

    # --- Family Medicine ---
    fm_content = content.replace('Педіатрія ЦТ 2026', 'ЗПСМ ЦТ 2026')
    fm_content = fm_content.replace('k3p26.js', 'k3fm26.js')
    
    with open('krok3-family-med.html', 'w', encoding='utf-8') as f:
        f.write(fm_content)

    # --- Ophthalmology ---
    oph_content = content.replace('Педіатрія ЦТ 2026', 'Офтальмологія ЦТ 2026')
    oph_content = oph_content.replace('k3p26.js', 'k3oph26.js')
    
    with open('krok3-ophthalmology.html', 'w', encoding='utf-8') as f:
        f.write(oph_content)

    print("Generated krok3-family-med.html and krok3-ophthalmology.html successfully")
except Exception as e:
    print("Error:", e)
