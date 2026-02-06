
$designDir = "c:\setup\Antigravity\quiz\design_assets"
if (!(Test-Path $designDir)) { New-Item -ItemType Directory -Path $designDir }

$screens = @(
    @{ name = "guide"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZjZTMxZTY2NDYyMDQyYjA5YTcyOTNiMTE3NGJkZmIyEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "login"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzgxMmI3NjFkZWRlZTQ5NDRiMzEwOTU4MDJkOWYxMDBhEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "home"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVhYTg3ZWMzNDNlNDQzZTQ4NjUwY2MwYjQwMTMzNzc0EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "report"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBhM2JjOTQ1MDZjZjQ2ZmM4YWI2NjdhZWIwMWM0NzBlEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "forgot_password"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JhOTViMDBkNjA0OTRlYzk4NWExM2JjZWJkYTkwNGM2EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "quiz_hint"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2YxMGNhN2MyNTMyNDRkMzA4NTg2NzEzYTg2MTg1ZGNlEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" },
    @{ name = "exam_interface"; url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M4N2JiMzBmZDAxOTQyYjRhMzcyNjg5ODU4MzI4NGU3EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086" }
)

foreach ($screen in $screens) {
    $path = Join-Path $designDir ($screen.name + ".html")
    Write-Host "Downloading $($screen.name)..."
    try {
        Invoke-WebRequest -Uri $screen.url -OutFile $path
        Write-Host "Success."
    }
    catch {
        Write-Host "Failed to download $($screen.name): $_"
    }
}

Write-Host "Done downloading available assets."
