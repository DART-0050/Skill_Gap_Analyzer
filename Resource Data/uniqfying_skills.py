import json

# Load the JSON file
with open('./full_role_skills.json', 'r') as f:
    data = json.load(f)

# Use a set to collect unique skills
unique_skills = set()

# Iterate through roles and their skills
for role, skills in data.items():
    unique_skills.update(skills)

# Convert set to sorted list
unique_skills_list = sorted(unique_skills)

# Print or save the unique skills
print("Unique Skills:")
for skill in unique_skills_list:
    print(skill)

# Optional: save to a JSON file
with open('unique_skills.json', 'w') as f:
    json.dump(unique_skills_list, f, indent=2)
