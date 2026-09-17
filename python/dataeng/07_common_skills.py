# 7. Find Common Skills

developer1 = {"Python", "SQL", "Spark", "Git", "Docker"}
developer2 = {"Python", "Java", "SQL", "Git", "AWS"}

common_skills = developer1 & developer2
only_developer1 = developer1 - developer2
only_developer2 = developer2 - developer1
all_unique_skills = developer1 | developer2

print("Common skills:", common_skills)
print("Skills only developer 1 has:", only_developer1)
print("Skills only developer 2 has:", only_developer2)
print("All unique skills:", all_unique_skills)
print("Number of common skills:", len(common_skills))
