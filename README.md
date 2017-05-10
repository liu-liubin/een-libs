# een-libs

#### 更新日志  2017-5-7

1. een/eenNumctrl.js

    新增onChange属性方法，监听ng-model值发生改变执行该方法

#### 更新日志  2017-5-3

1. een/eenRadio.js

    优化、修复复选BUG, 新增指令属性checkbox必须设置数字索引值，作用数组下标
    删除ng-value设置取值
    修复单次选择并改变全选按钮的状态

#### 更新日志  2017.4.27

1. een/attrStyle.js
    新增ellipsis属性指令

2. een/eenRadio.js
    更新，如果没有设置value值，则选中的情况默认为true,未选中默认为false
    修复bug，checkbox、radio选中未选中取值问题
    新增value变值监听，使用 $observe

#### 更新日志  2017.4.24

1. een/attrStyle.js
    新增指令 flexGrow

2. een/eenRadio.js
    新增全选按钮，如果在按钮上加上allctrl属性表示该按钮可以控制与之name对应的所有选择按钮的状态

3. een/eenher.js
    优化confirm弹层效果

#### 更新日志  2017.4.20
1. 改进优化een/eenRadio.js，并新增复选功能

#### 更新日志  2017.4.12
1. een/eenDropdown.js
    修复，在同一页面切换tab需要重新下拉刷新时加载无效。
    新增on-reload属性
