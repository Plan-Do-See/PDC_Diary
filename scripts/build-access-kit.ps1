# Rebuild the portable kit from an explicit allowlist. Never include local keys/secrets.
$ErrorActionPreference = 'Stop'
$taskRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$taskSource = Join-Path $taskRoot 'workspaces/PDC_Diary_Infra/access'
$taskOutputDir = Join-Path $taskRoot 'docs/downloads'
$taskOutput = Join-Path $taskOutputDir 'pds-access-kit.zip'
$taskNames = @('README-KO.md', 'pds-access.sh', 'add-public-key.sh', 'access-policy.json', 'verification.json')
$taskFiles = @($taskNames | ForEach-Object { Join-Path $taskSource $_ })
foreach ($taskFile in $taskFiles) {
    if (-not (Test-Path -LiteralPath $taskFile -PathType Leaf)) { throw "Missing kit source: $taskFile" }
}
New-Item -ItemType Directory -Path $taskOutputDir -Force | Out-Null
Compress-Archive -LiteralPath $taskFiles -DestinationPath $taskOutput -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskZip = [System.IO.Compression.ZipFile]::OpenRead($taskOutput)
try {
    $taskEntryNames = @($taskZip.Entries | ForEach-Object { $_.FullName })
    if (@(Compare-Object $taskNames $taskEntryNames).Count -ne 0) { throw 'Unexpected archive contents.' }
    foreach ($taskEntry in $taskZip.Entries) {
        $taskStream = $taskEntry.Open()
        $taskHasher = [System.Security.Cryptography.SHA256]::Create()
        try { $taskEntryHash = [Convert]::ToHexString($taskHasher.ComputeHash($taskStream)) }
        finally { $taskStream.Dispose(); $taskHasher.Dispose() }
        $taskSourceHash = (Get-FileHash -LiteralPath (Join-Path $taskSource $taskEntry.FullName) -Algorithm SHA256).Hash
        if ($taskEntryHash -ne $taskSourceHash) { throw "Archive/source mismatch: $($taskEntry.FullName)" }
    }
}
finally { $taskZip.Dispose() }
[pscustomobject]@{Archive=$taskOutput;Files=$taskNames;Sha256=(Get-FileHash -LiteralPath $taskOutput -Algorithm SHA256).Hash;SourceHashesMatch=$true} | ConvertTo-Json -Depth 4
