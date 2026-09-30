"""
Exercise 5 — Banking Transaction ETL Pipeline

Input:
    transactions.csv

Outputs:
    output/transaction_summary/
    output/high_value_transactions/
    output/account_summary/
    output/daily_transactions/   (partitioned by transaction_date)
"""

import pandas as pd

from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField, StringType,
    DoubleType, DateType
)
from pyspark.sql.functions import (
    col, when, month, count, sum as spark_sum, avg
)

# ============================================================
# PART A — PANDAS DATA QUALITY
# ============================================================

df = pd.read_csv("transactions.csv")

print("Duplicate transactions:")
print(df.duplicated(subset=["transaction_id"]).sum())

print("\nMissing values:")
print(df.isnull().sum())

# Convert transaction_date to datetime
df["transaction_date"] = pd.to_datetime(df["transaction_date"])

# Standardize city
df["city"] = df["city"].str.strip().str.title()

# Convert transaction_type to uppercase
df["transaction_type"] = df["transaction_type"].str.strip().str.upper()

# Remove failed transactions
df = df[df["status"].str.strip().str.upper() != "FAILED"].copy()

# Validate amount > 0
invalid_amounts = df[df["amount"] <= 0]

if not invalid_amounts.empty:
    raise ValueError("Found transactions with amount <= 0")

# Save cleaned data for the Spark stage
df.to_csv("cleaned_transactions.csv", index=False)

print("\nCleaned transaction data:")
print(df.to_string(index=False))

# ============================================================
# PART B — PYSPARK TRANSFORMATION
# ============================================================

spark = (
    SparkSession.builder
    .appName("BankingTransactionETL")
    .getOrCreate()
)

schema = StructType([
    StructField("transaction_id", StringType(), False),
    StructField("account_id", StringType(), False),
    StructField("transaction_type", StringType(), False),
    StructField("amount", DoubleType(), False),
    StructField("city", StringType(), False),
    StructField("transaction_date", DateType(), False),
    StructField("status", StringType(), False),
])

transactions = (
    spark.read
    .option("header", True)
    .schema(schema)
    .csv("cleaned_transactions.csv")
)

# Create transaction_month
transactions = transactions.withColumn(
    "transaction_month",
    month("transaction_date")
)

# Create risk flag
transactions = transactions.withColumn(
    "risk_flag",
    when(col("amount") >= 100000, "HIGH_VALUE")
    .otherwise("NORMAL")
)

print("Transactions after transformation:")
transactions.show()

# ------------------------------------------------------------
# 1. Transaction summary
# ------------------------------------------------------------
transaction_summary = (
    transactions.groupBy("transaction_type")
    .agg(
        count("*").alias("total_transactions"),
        spark_sum("amount").alias("total_amount"),
        avg("amount").alias("average_amount")
    )
    .orderBy("transaction_type")
)

print("Transaction summary:")
transaction_summary.show()

# ------------------------------------------------------------
# 2. City summary
# ------------------------------------------------------------
city_summary = (
    transactions.groupBy("city")
    .agg(
        count("*").alias("transaction_count"),
        spark_sum("amount").alias("total_amount"),
        avg("amount").alias("average_amount")
    )
    .orderBy("city")
)

print("City summary:")
city_summary.show()

# ------------------------------------------------------------
# 3. High-value transactions
# ------------------------------------------------------------
high_value_transactions = transactions.filter(
    col("amount") >= 100000
)

print("High-value transactions:")
high_value_transactions.show()

# ------------------------------------------------------------
# 4. Account analysis
# ------------------------------------------------------------
account_summary = (
    transactions.groupBy("account_id")
    .agg(
        count("*").alias("total_transactions"),
        spark_sum("amount").alias("total_amount"),
        avg("amount").alias("average_transaction")
    )
    .orderBy("account_id")
)

print("Account summary:")
account_summary.show()

# ------------------------------------------------------------
# 5. Daily transaction analysis
# ------------------------------------------------------------
daily_transactions = (
    transactions.groupBy("transaction_date")
    .agg(
        count("*").alias("transaction_count"),
        spark_sum("amount").alias("total_amount")
    )
    .orderBy("transaction_date")
)

print("Daily transaction analysis:")
daily_transactions.show()

# ============================================================
# PART C — ETL OUTPUT
# ============================================================

transaction_summary.write.mode("overwrite").option("header", True).csv(
    "output/transaction_summary"
)

high_value_transactions.write.mode("overwrite").option("header", True).csv(
    "output/high_value_transactions"
)

account_summary.write.mode("overwrite").option("header", True).csv(
    "output/account_summary"
)

daily_transactions.write.mode("overwrite").partitionBy(
    "transaction_date"
).parquet("output/daily_transactions")

spark.stop()

print("Banking ETL outputs created successfully.")
