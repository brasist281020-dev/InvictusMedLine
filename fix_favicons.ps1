$newTag = '    <link rel="icon" type="image/svg+xml" href="favicon.svg">'

$files = @(
    'd:\Desktop\AGInvictus\krok3-pediatrics.html',
    'd:\Desktop\AGInvictus\krok3-pediatrics-2025.html',
    'd:\Desktop\AGInvictus\krok3-family-med.html',
    'd:\Desktop\AGInvictus\krok3-ophthalmology.html',
    'd:\Desktop\AGInvictus\news.html'
)

foreach ($filePath in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $content = [System.Text.Encoding]::UTF8.GetString($bytes)

    # Find the opening of the favicon link
    $start = $content.IndexOf('    <link rel="icon"')
    if ($start -lt 0) {
        Write-Host "[SKIP - no link tag] $filePath"
        continue
    }

    # Find closing >
    $end = $content.IndexOf('>', $start)
    if ($end -lt 0) {
        Write-Host "[SKIP - no closing >] $filePath"
        continue
    }

    $oldTag = $content.Substring($start, $end - $start + 1)

    # Only replace if it looks like the data:image inline favicon
    if ($oldTag.IndexOf('data:image/svg+xml') -ge 0) {
        $newContent = $content.Substring(0, $start) + $newTag + $content.Substring($end + 1)
        $newBytes = [System.Text.Encoding]::UTF8.GetBytes($newContent)
        [System.IO.File]::WriteAllBytes($filePath, $newBytes)
        Write-Host "[OK] Replaced in: $filePath"
    } else {
        Write-Host "[SKIP - already updated] $filePath"
    }
}
