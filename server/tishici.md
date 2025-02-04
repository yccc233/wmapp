# 给定一条insert语句，请帮助我生成100条尽可能真实的测试数据，目的是为了可以模拟真实环境，

## insert语句：
INSERT INTO "main"."tbl_topview_persons" 
("related_class_id", "person_id", "person_name", "off_time", "insert_time") VALUES 
(2002, 10003, '周紫荆', NULL, '2025-02-01 07:35:05');

## 其中：
related_class_id：关联的班id，目前在2001，2002，2003中选其一
person_id：人物id，不填，会自增
person_name：人物名称
off_time：离职时间，暂定全为NULL，
insert_time：不填，自动填充



# 给定一条insert语句，请帮助我生成1000条尽可能真实的测试数据，目的是为了可以模拟真实环境，如果使用程序生成，请使用JavaScript

## insert语句：

INSERT INTO "main"."tbl_topview_scores_deduct" 
("deduct_month", "person_id", "label_id", "ded_score", "remark", "update_time", "insert_time") VALUES 
('2025-01', 10002, 3005, 2, NULL, '2025-02-04 15:46:23', '2025-02-04 15:46:23');

## 其中：
deduct_month：是指月份，格式为"2025-01"，尽量选择近三个月的数据
person_id：人物id，在10001~10100范围中选择
label_id：关联的标签id，目前在3001~3007中选其一
ded_score：扣除的分数，在1~20中随机选择一个数
remark：扣除分数的原因，可不填，不填为NULL，
update_time和insert_time：不填，自动填充

## 注意
其中deduct_month，person_id，label_id是联合主键，不可产生相同的结果