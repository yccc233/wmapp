
# 结项

## 左边分类
- 安全风险【暂时不做】
- 状态风险【做】
【标题D，后果E，责任人，详情】
【详情点了是个列表】
【标题前有两个按钮-机械、电气、其他（筛选）】
【钢卷小车，可放置字】
【表格里有时间的话，标红？】
- 质量风险【暂时不做】

## 提问：
我想写一个shell脚本start.sh，执行命令：sh start.sh
1、当执行“sh start.sh”时，运行npm run prod
2、当执行“sh start.sh --build”时，先运行 npm run build，如果运行失败，直接退出，并输出build project ERROR!，ERROR标红，如果运行成功输出 "build project SUCCESS!"，SUCCESS标绿，并且下一步运行npm run prod
3、当执行“sh start.sh --install --build ”时，先运行npm install，再重复上述的第2步骤


## 样式变动

下面卡片内容
- 图中风险点,风险数量,责任人数，分类数量- 10个失效点，16个风险项（）
- 分类数量- 电气3个，机械2个，生产4个（饼图）
- 责任人排序 - wtz 6个 yc 3个（列表）
- 风险等级排序 - 4星3个 3行6个 （列表）

# 交接

## 1.前置准备

- 安装【安装包.zip】的三个文件（谷歌推荐安装）

## 2.启动步骤

1. npm install
2. npm run build
3. npm run prod


