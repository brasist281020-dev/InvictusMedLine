$Root = "d:\Desktop\AGInvictus"
$Port = 5500
$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
    ".svg"  = "image/svg+xml"
    ".mp3"  = "audio/mpeg"
    ".webp" = "image/webp"
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "InvictusMedLine server: http://localhost:$Port  (Ctrl+C to stop)"
try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        $raw = $req.Url.AbsolutePath
        $decoded = [System.Uri]::UnescapeDataString($raw)
        $safe = $decoded.TrimStart('/').Replace('/', '\')
        $full = Join-Path $Root $safe
        if (-not (Test-Path $full)) {
            $ext = [System.IO.Path]::GetExtension($full)
            if (-not $ext) {
                $html = $full + ".html"
                if (Test-Path $html) { $full = $html }
            }
        }
        if ((Test-Path $full -PathType Container)) {
            $idx = Join-Path $full "index.html"
            if (Test-Path $idx) { $full = $idx }
        }
        if (Test-Path $full -PathType Leaf) {
            $ext  = [System.IO.Path]::GetExtension($full).ToLower()
            $mime = if ($MimeTypes[$ext]) { $MimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $res.StatusCode = 200
            $res.ContentType = $mime
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "200 $raw"
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $raw")
            $res.StatusCode = 404
            $res.ContentType = "text/plain"
            $res.ContentLength64 = $body.Length
            $res.OutputStream.Write($body, 0, $body.Length)
            Write-Host "404 $raw"
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}