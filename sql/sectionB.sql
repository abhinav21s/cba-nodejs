-- B1
INSERT INTO departments VALUES(001,'SALES','BENGALURU'),
('ENGINEERING','HYDERABAD'),
('HR','GURUGRAM');

-- employee INSERTION
INSERT INTO employees VALUES(001,'SAM','HARMAN','ABC@mail',200000,'2020-03-01',001,NULL),
VALUES(002,'JASON','SMITH','jason@mail','250000','2019-08-01',002,NULL),
VALUES(003,'TIM','PAYNE','tim@mail.com','200000','2026-03001',002,002),
VALUES(004,'LEWIS','DAVIS','lewis@mail.com',200000,'2023-03-01',001,001),
VALUES(005,'CASSIDY','FINCH','cassidy@mail.com',250000,'2022-08-01',003,NULL);

-- B2

INSERT INTO customers VALUES(001,'Praveen','praveen@mail.com','chennai','India'),
VALUES(002,'Devon','devon@mail.com','Indiana','USA'),
VALUES(003,'Axl','axl@mail.com','Iowa','USA');

INSERT INTO orders VALUES(001,001,'2026-05-01',2000.00),
VALUES(002,001,'2026-04-22',200.02),
VALUES(003,003,'2026-03-21',2300.02),
VALUES(004,002,'2026-02-12',250.00);

-- B3
UPDATE employees 
set salary=(0.1*salary)+salary
where dept_id =(
    select dept_id 
    from departments
    where dept_name="ENGINEERING"
);


