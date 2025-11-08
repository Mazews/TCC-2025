<#
  setup-jdk.ps1

  Helper script to guide setting JAVA_HOME and adding java to PATH on Windows (PowerShell).
  This script does NOT download or install a JDK. Install a JDK first (Adoptium/Temurin recommended),
  then run this script with the path to the JDK installation directory.

  Usage (PowerShell as Administrator):
    .\setup-jdk.ps1 -JdkPath 'C:\Program Files\Java\jdk-17.0.8'

  The script will:
  - set JAVA_HOME persistently using setx
  - add the JDK bin folder to the user PATH persistently
  - print the resulting java -version
#>

param(
    [Parameter(Mandatory=$true)]
    [string] $JdkPath
)

if (-not (Test-Path $JdkPath)) {
    Write-Host "O caminho fornecido não existe: $JdkPath" -ForegroundColor Red
    Write-Host "Instale um JDK (por exemplo, Temurin/OpenJDK) e informe o caminho do diretório do JDK." -ForegroundColor Yellow
    exit 1
}

$jdkBin = Join-Path $JdkPath 'bin'
if (-not (Test-Path $jdkBin)) {
    Write-Host "O diretório bin não foi encontrado no JDK: $jdkBin" -ForegroundColor Red
    exit 1
}

Write-Host "Definindo JAVA_HOME para: $JdkPath" -ForegroundColor Green
setx JAVA_HOME "$JdkPath" | Out-Null

# Atualiza o PATH do usuário adicionando o jdk\bin caso não exista
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike "*$jdkBin*") {
    Write-Host "Adicionando $jdkBin ao Path do usuário" -ForegroundColor Green
    $newPath = "$currentPath;$jdkBin"
    setx Path "$newPath" | Out-Null
} else {
    Write-Host "$jdkBin já presente no Path do usuário" -ForegroundColor Cyan
}

Write-Host "Reinicie o terminal (ou abra um novo PowerShell) para que as variáveis tenham efeito." -ForegroundColor Yellow
Write-Host "Tentando exibir java -version usando o PATH atual da sessão (não persistente)..." -ForegroundColor Cyan

# Atualiza a sessão atual para testes imediatos
$env:JAVA_HOME = $JdkPath
$env:Path = "$jdkBin;" + $env:Path

try {
    java -version
} catch {
    Write-Host "Não foi possível executar 'java -version' — verifique se o JDK está instalado corretamente." -ForegroundColor Red
}

Write-Host "Se java -version retornou a versão esperada, tente rodar o build novamente:" -ForegroundColor Green
Write-Host "  cd android; .\\gradlew.bat assembleDebug" -ForegroundColor White
