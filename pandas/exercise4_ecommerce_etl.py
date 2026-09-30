"""
Exercise 4 — E-Commerce ETL with Pandas + PySpark

Inputs:
    orders.csv
    products.csv

Pandas outputs:
    cleaned_orders.csv
    cleaned_products.csv

PySpark output:
    output/ecommerce_orders/

The final Spark dataset is written as Parquet.
"""

import os
import pandas as pd

from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField, StringType,
    IntegerType, DoubleType, DateType
)
from pyspark.sql.functions import (
    col, sum as spark_sum, count, desc
)

# ============================================================
# PART A — PANDAS
# ============================================================

orders_pd = pd.read_csv("orders.csv")
products_pd = pd.read_csv("products.csv")

print("Orders data types:")
print(orders_pd.dtypes)

print("\nProducts data types:")
print(products_pd.dtypes)

print("\nOrders missing values:")
print(orders_pd.isnull().sum())

print("\nProducts missing values:")
print(products_pd.isnull().sum())

# Convert order_date to datetime
orders_pd["order_date"] = pd.to_datetime(orders_pd["order_date"])

# Remove duplicate orders
orders_pd = orders_pd.drop_duplicates(subset=["order_id"]).copy()

# Standardize product categories
products_pd["category"] = (
    products_pd["category"]
    .astype(str)
    .str.strip()
    .str.title()
)

# Save cleaned Pandas files
orders_pd.to_csv("cleaned_orders.csv", index=False)
products_pd.to_csv("cleaned_products.csv", index=False)

# ============================================================
# PART B — PYSPARK
# ============================================================

spark = (
    SparkSession.builder
    .appName("ECommerceETL")
    .getOrCreate()
)

orders_schema = StructType([
    StructField("order_id", StringType(), False),
    StructField("customer_id", StringType(), False),
    StructField("product_id", StringType(), False),
    StructField("quantity", IntegerType(), False),
    StructField("order_date", DateType(), False),
])

products_schema = StructType([
    StructField("product_id", StringType(), False),
    StructField("product_name", StringType(), False),
    StructField("category", StringType(), False),
    StructField("price", DoubleType(), False),
])

orders = (
    spark.read
    .option("header", True)
    .schema(orders_schema)
    .csv("cleaned_orders.csv")
)

products = (
    spark.read
    .option("header", True)
    .schema(products_schema)
    .csv("cleaned_products.csv")
)

# Join orders and products using product_id
joined = orders.join(products, on="product_id", how="inner")

# Create order_amount
joined = joined.withColumn(
    "order_amount",
    col("quantity") * col("price")
)

print("\nFinal joined dataset:")
joined.show()

# Total revenue
total_revenue = joined.agg(
    spark_sum("order_amount").alias("total_revenue")
)

print("Total revenue:")
total_revenue.show()

# Revenue by category
revenue_by_category = (
    joined.groupBy("category")
    .agg(spark_sum("order_amount").alias("total_revenue"))
    .orderBy(desc("total_revenue"))
)

print("Revenue by category:")
revenue_by_category.show()

# Revenue by product
revenue_by_product = (
    joined.groupBy("product_id", "product_name")
    .agg(spark_sum("order_amount").alias("total_revenue"))
    .orderBy(desc("total_revenue"))
)

print("Revenue by product:")
revenue_by_product.show()

# Revenue by customer
revenue_by_customer = (
    joined.groupBy("customer_id")
    .agg(spark_sum("order_amount").alias("total_revenue"))
    .orderBy(desc("total_revenue"))
)

print("Revenue by customer:")
revenue_by_customer.show()

# Number of orders per day
orders_per_day = (
    joined.groupBy("order_date")
    .agg(count("order_id").alias("number_of_orders"))
    .orderBy("order_date")
)

print("Number of orders per day:")
orders_per_day.show()

# Top 3 products by revenue
top_3_products = revenue_by_product.limit(3)

print("Top 3 products by revenue:")
top_3_products.show()

# Expected final schema:
# order_id, customer_id, product_id, product_name, category,
# quantity, price, order_date, order_amount
final_df = joined.select(
    "order_id",
    "customer_id",
    "product_id",
    "product_name",
    "category",
    "quantity",
    "price",
    "order_date",
    "order_amount"
)

print("Final schema:")
final_df.printSchema()

# ============================================================
# PART C — LOAD
# ============================================================

final_df.write.mode("overwrite").parquet("output/ecommerce_orders")

spark.stop()

print("Saved final dataset to output/ecommerce_orders/")
