# PowerShell script to add premium-styles.css to all HTML files

$htmlFiles = Get-ChildItem -Path "d:\Work\StockEasy\public" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if premium-styles.css is already included
    if ($content -notmatch 'premium-styles\.css') {
        # Find the line with style.css and add premium-styles.css after it
        $content = $content -replace '(<link rel="stylesheet" href="style\.css"[^>]*>)', "`$1`r`n  <link rel=""stylesheet"" href=""premium-styles.css"" />"
        
        # Save the file
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "Skipped (already has premium-styles.css): $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nAll HTML files have been updated!" -ForegroundColor Cyan
