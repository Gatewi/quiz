
import os
import requests

screens = [
    {
        "name": "home.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y3NGUxYzAxY2M3NDRjMDVhNTNiZmJkYTUxNmNiYWViEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "forgot_password.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JhOTViMDBkNjA0OTRlYzk4NWExM2JjZWJkYTkwNGM2EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "exam_result.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y3NGUxYzAxY2M3NDRjMDVhNTNiZmJkYTUxNmNiYWViEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "guide.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZjZTMxZTY2NDYyMDQyYjA5YTcyOTNiMTE3NGJkZmIyEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "exam_interface.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M4N2JiMzBmZDAxOTQyYjRhMzcyNjg5ODU4MzI4NGU3EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    }
]

# Note: The 'exam_result' URL in the list above seems to be identical to 'home' in my manual copy-paste. 
# I need to double check the source context in step 67.
# Result: "name":"projects/14519860205898364560/files/373b83a622414925ae4bd68bb2fa43f0"
# URL: ...X2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y3NGUxYzAxY2M3NDRjMDVhNTNiZmJkYTUxNmNiYWVi...
# Wait, "Trang chủ" (Home) htmlCode name is "...files/373b83a622414925ae4bd68bb2fa43f0" ?? 
# No, let's re-read step 67 carefully.

# Screen 1: Quên (Forgot)
# htmlCode name: files/b9461e6f40cf4e33a9ecbaedf44e4d65
# URL char chunk: ...X2JhOTViMDBkNjA0OTRlYzk4NWExM2JjZWJkYTkwNGM2...

# Screen 2: Kết quả (Result)
# htmlCode name: files/373b83a622414925ae4bd68bb2fa43f0
# URL char chunk: ...X2Y3NGUxYzAxY2M3NDRjMDVhNTNiZmJkYTUxNmNiYWVi...

# Screen 3: Trang chủ (Home)
# htmlCode name: ...
# Step 67 was truncated! "screenshot":{"nam... <truncated> ... SBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
# I missed the HTML code for Home because of truncation?
# Ah, I see "Trang chủ" title. Then "screenshot". Then some data. Then it truncates.
# I might NOT have the HTML URL for "Trang chủ".
# I have "Forgot", "Result". 
# "Guide" (Hướng dẫn) is there.
# "Exam" (Làm bài) is there.
# I am missing "Home" HTML code URL because of truncation. 
# I will download what I have and then ask for Home specifically or list again to get it.

# Corrected list for script:
# Forgot: Correct.
# Result: Correct.
# Guide: Correct.
# Exam Interface: Correct.
# Home: MISSING.

output_dir = "design_assets"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

valid_screens = [
    {
        "name": "forgot_password.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JhOTViMDBkNjA0OTRlYzk4NWExM2JjZWJkYTkwNGM2EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "exam_result.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y3NGUxYzAxY2M3NDRjMDVhNTNiZmJkYTUxNmNiYWViEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "guide.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZjZTMxZTY2NDYyMDQyYjA5YTcyOTNiMTE3NGJkZmIyEgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    },
    {
        "name": "exam_interface.html",
        "url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M4N2JiMzBmZDAxOTQyYjRhMzcyNjg5ODU4MzI4NGU3EgsSBxD6q5StoQYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUxOTg2MDIwNTg5ODM2NDU2MA&filename=&opi=89354086"
    }
]

for screen in valid_screens:
    print(f"Downloading {screen['name']}...")
    try:
        response = requests.get(screen['url'])
        if response.status_code == 200:
            with open(os.path.join(output_dir, screen['name']), 'wb') as f:
                f.write(response.content)
            print(f"Saved {screen['name']}")
        else:
            print(f"Failed to download {screen['name']}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {screen['name']}: {e}")

