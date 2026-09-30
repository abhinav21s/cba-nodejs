"""
Exercise 2 — Customer ETL with Pandas

Input:
    customers.csv

Output:
    active_customers.csv
"""

import pandas as pd

# -------------------------
# Extract
# -------------------------
df = pd.read_csv("customers.csv")

print("DataFrame information:")
df.info()

print("\nNull values:")
print(df.isnull().sum())

print("\nDuplicate records:")
print(df.duplicated().sum())

# -------------------------
# Transform
# -------------------------
df["name"] = df["name"].str.strip().str.title()
df["email"] = df["email"].str.strip().str.lower()
df["city"] = df["city"].str.strip().str.title()

# Average age is calculated from the available age values.
average_age = df["age"].mean()
df["age"] = df["age"].fillna(average_age)

# Fill missing email
df["email"] = df["email"].fillna("unknown@email.com")

# Keep active customers only
df = df[df["status"].str.strip().str.lower() == "active"].copy()

# Create age group
def get_age_group(age):
    if age < 30:
        return "Young"
    elif age <= 40:
        return "Adult"
    else:
        return "Senior"

df["age_group"] = df["age"].apply(get_age_group)

print("\nFinal active customers:")
print(df.to_string(index=False))

# Bonus: city summary
city_summary = (
    df.groupby("city")
      .size()
      .reset_index(name="Customer_Count")
      .sort_values("city")
)

print("\nCity customer summary:")
print(city_summary.to_string(index=False))

# -------------------------
# Load
# -------------------------
df.to_csv("active_customers.csv", index=False)

print("\nSaved final dataframe as active_customers.csv")
