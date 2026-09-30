"""
Exercise 1 — Sales Data Cleaning with Pandas

Input:
    sales.csv

Output:
    cleaned_sales.csv
"""

import pandas as pd

# -------------------------
# Extract
# -------------------------
df = pd.read_csv("sales.csv")

print("First 5 records:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

# -------------------------
# Transform
# -------------------------
df["city"] = df["city"].str.strip().str.title()
df["category"] = df["category"].str.strip().str.title()

df["total_amount"] = df["quantity"] * df["price"]

print("\nCleaned data:")
print(df)

# Total sales by city
city_sales = (
    df.groupby("city", as_index=False)["total_amount"]
      .sum()
      .rename(columns={"total_amount": "Total Sales"})
)

print("\nTotal sales by city:")
print(city_sales.to_string(index=False))

# Total sales by category
category_sales = (
    df.groupby("category", as_index=False)["total_amount"]
      .sum()
      .rename(columns={"total_amount": "Total Sales"})
)

print("\nTotal sales by category:")
print(category_sales.to_string(index=False))

# City with highest sales
highest_city = city_sales.loc[city_sales["Total Sales"].idxmax()]
print(
    f"\nCity with highest sales: {highest_city['city']} "
    f"({highest_city['Total Sales']})"
)

# -------------------------
# Load
# -------------------------
df.to_csv("cleaned_sales.csv", index=False)

print("\nSaved cleaned data as cleaned_sales.csv")
