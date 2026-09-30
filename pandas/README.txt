ETL EXERCISES — ANSWER FILES
============================

Files included:
1. exercise1_sales_cleaning.py
2. exercise2_customer_etl.py
3. exercise3_employee_payroll_pyspark.py
4. exercise4_ecommerce_etl.py
5. exercise5_banking_transaction_etl.py

Each Python file is a complete answer for its corresponding exercise.

Requirements
------------
Pandas:
    pip install pandas

PySpark:
    pip install pyspark

Run examples
------------
Exercise 1:
    python exercise1_sales_cleaning.py

Exercise 2:
    python exercise2_customer_etl.py

Exercise 3:
    spark-submit exercise3_employee_payroll_pyspark.py

Exercise 4:
    spark-submit exercise4_ecommerce_etl.py

Exercise 5:
    spark-submit exercise5_banking_transaction_etl.py

Input CSV files
---------------
Place the required input CSV files in the same directory as the Python script:

Exercise 1:
    sales.csv

Exercise 2:
    customers.csv

Exercise 3:
    employees.csv

Exercise 4:
    orders.csv
    products.csv

Exercise 5:
    transactions.csv

Notes
-----
- Exercise 1 uses the sales data shown in the supplied image.
- Exercise 3 writes the department payroll summary as CSV and also as a bonus Parquet output.
- Exercise 4 writes the final e-commerce dataset as Parquet because the question's output format was incomplete.
- Exercise 5 writes the requested summaries as CSV and the daily analysis as partitioned Parquet.
