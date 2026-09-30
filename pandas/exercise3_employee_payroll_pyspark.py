"""
Exercise 3 — Employee Payroll ETL with PySpark

Input:
    employees.csv

Output:
    output/payroll_summary/
    output/payroll_summary_parquet/   (bonus)
"""

from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField, StringType,
    IntegerType, DoubleType
)
from pyspark.sql.functions import (
    col, avg, max as spark_max, sum as spark_sum
)

# -------------------------
# Extract
# -------------------------
spark = (
    SparkSession.builder
    .appName("EmployeePayrollETL")
    .getOrCreate()
)

schema = StructType([
    StructField("emp_id", StringType(), False),
    StructField("name", StringType(), False),
    StructField("department", StringType(), False),
    StructField("salary", DoubleType(), False),
    StructField("bonus", DoubleType(), False),
])

df = (
    spark.read
    .option("header", True)
    .schema(schema)
    .csv("employees.csv")
)

print("Schema:")
df.printSchema()

print("Employee data:")
df.show()

# -------------------------
# Transform
# -------------------------
df = df.withColumn("total_salary", col("salary") + col("bonus"))

print("Employees with total salary:")
df.show()

# Average salary by department
avg_salary = (
    df.groupBy("department")
      .agg(avg("salary").alias("average_salary"))
      .orderBy("department")
)

print("Average salary by department:")
avg_salary.show()

# Maximum salary by department
max_salary = (
    df.groupBy("department")
      .agg(spark_max("salary").alias("maximum_salary"))
      .orderBy("department")
)

print("Maximum salary by department:")
max_salary.show()

# Total payroll by department
payroll_summary = (
    df.groupBy("department")
      .agg(spark_sum("total_salary").alias("total_payroll"))
      .orderBy("department")
)

print("Total payroll by department:")
payroll_summary.show()

# Employees whose salary is greater than 70000
high_salary = df.filter(col("salary") > 70000)

print("Employees with salary > 70000:")
high_salary.show()

# Sort employees by salary descending
sorted_employees = df.orderBy(col("salary").desc())

print("Employees sorted by salary descending:")
sorted_employees.show()

# -------------------------
# Load
# -------------------------
payroll_summary.write.mode("overwrite").option("header", True).csv(
    "output/payroll_summary"
)

# Bonus: write the same result as Parquet
payroll_summary.write.mode("overwrite").parquet(
    "output/payroll_summary_parquet"
)

spark.stop()
