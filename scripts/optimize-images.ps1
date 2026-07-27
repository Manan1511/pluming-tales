Add-Type -AssemblyName System.Drawing

$maxDim = 1800
$jpegQuality = 80L

$root = "src\assets\images"
$files = Get-ChildItem -Path $root -Recurse -Include *.jpg,*.jpeg,*.png

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $jpegQuality)

$totalBefore = 0
$totalAfter = 0

foreach ($file in $files) {
    $before = $file.Length
    $totalBefore += $before

    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($ms)

    $hasAlpha = [System.Drawing.Bitmap]::new($img).PixelFormat -match 'Alpha'

    $w = $img.Width
    $h = $img.Height
    $scale = [Math]::Min(1.0, $maxDim / [Math]::Max($w, $h))
    $newW = [Math]::Max(1, [int]($w * $scale))
    $newH = [Math]::Max(1, [int]($h * $scale))

    $resized = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, 0, 0, $newW, $newH)
    $g.Dispose()
    $img.Dispose()
    $ms.Dispose()

    $ext = $file.Extension.ToLower()
    $targetPath = $file.FullName
    $tmpPath = "$($file.FullName).tmp"

    if ($ext -eq '.png' -and $hasAlpha) {
        $resized.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
        # Convert opaque PNGs and all JPEGs to quality-80 JPEG.
        if ($ext -eq '.png') {
            $targetPath = [System.IO.Path]::ChangeExtension($file.FullName, '.jpg')
            $tmpPath = "$targetPath.tmp"
        }
        $resized.Save($tmpPath, $jpegCodec, $encoderParams)
    }
    $resized.Dispose()

    Move-Item -Force $tmpPath $targetPath
    if ($targetPath -ne $file.FullName) {
        Remove-Item -Force $file.FullName
    }

    $after = (Get-Item $targetPath).Length
    $totalAfter += $after
    Write-Host "$($file.Name): $([Math]::Round($before/1kb))KB -> $([Math]::Round($after/1kb))KB"
}

Write-Host "---"
Write-Host "Total: $([Math]::Round($totalBefore/1mb,1))MB -> $([Math]::Round($totalAfter/1mb,1))MB"
