$content = Get-Content -Path "krok3-pediatrics.html" -Raw -Encoding UTF8

# Remove easter egg logic
$content = $content -replace 'let easterEggClicks = 0;[\s\S]*?function initTheme\(\) \{', "function initTheme() {"
$content = $content -replace 'class="text-\[10px\] font-black uppercase tracking-\[0\.2em\] italic \$\{q\.displayNumber === 67 \? ''cursor-pointer select-none'' : ''''\}" \$\{q\.displayNumber === 67 \? ''onclick="handleEasterEgg\(\)"'' : ''''\}', 'class="text-[10px] font-black uppercase tracking-[0.2em] italic"'

# Generate Family Medicine
$fm_content = $content.Replace("Педіатрія ЦТ 2026", "ЗПСМ ЦТ 2026").Replace("k3p26.js", "k3fm26.js")
Set-Content -Path "krok3-family-med.html" -Value $fm_content -Encoding UTF8

# Generate Ophthalmology
$oph_content = $content.Replace("Педіатрія ЦТ 2026", "Офтальмологія ЦТ 2026").Replace("k3p26.js", "k3oph26.js")
Set-Content -Path "krok3-ophthalmology.html" -Value $oph_content -Encoding UTF8

Write-Host "Success"
