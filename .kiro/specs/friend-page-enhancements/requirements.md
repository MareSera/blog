# 需求文档

## 简介

本功能为友链页面（src/pages/friend.astro）添加四项增强功能，以提升用户体验和页面交互性。这些增强包括：独立的贡献者展示区域、改进的统计框、友链列表的折叠加载功能，以及随机跳转按钮。所有新功能都将保持现有的 DaisyUI + Tailwind CSS 设计风格和动画效果。

## 术语表

- **Friend_Page**: 友链页面，位于 src/pages/friend.astro
- **Contributor**: 贡献者，type 字段为 "contributor" 的友链条目
- **Friend**: 朋友，type 字段为 "friend" 的友链条目
- **Link_Status_Indicator**: 链接状态指示器，显示链接可访问性的视觉元素
- **Contributor_Button**: 贡献者按钮，用于展示和跳转到贡献者链接的按钮元素
- **Load_More_Button**: 加载更多按钮，用于展开友链列表的交互按钮
- **Random_Visit_Button**: 随机访问按钮，用于随机跳转到任意友链的按钮
- **Friends_Array**: 友链数据数组，包含所有友链和贡献者信息

## 需求

### 需求 1: 贡献者区域展示

**用户故事:** 作为网站访问者，我想看到一个独立的贡献者区域，以便我能够识别和访问为本站做出贡献的人员。

#### 验收标准

1. WHEN THE Friend_Page 加载时，THE System SHALL 在页面上显示一个独立的"本站贡献者"区域
2. WHEN 显示贡献者时，THE System SHALL 使用按钮形式而非卡片形式展示每个 Contributor
3. WHEN 用户点击 Contributor_Button 时，THE System SHALL 在新标签页中打开对应的贡献者链接
4. WHEN 显示 Contributor_Button 时，THE System SHALL 在按钮上显示 Link_Status_Indicator
5. WHERE Link_Status_Indicator 为绿色圆点，THE System SHALL 表示该链接可正常访问
6. WHERE Link_Status_Indicator 为灰色圆点，THE System SHALL 表示该链接无法访问
7. THE System SHALL 保持现有的 DaisyUI 和 Tailwind CSS 样式风格
8. THE System SHALL 保持现有的动画效果和渐变色设计

### 需求 2: 链接状态检测

**用户故事:** 作为网站访问者，我想实时看到链接的可访问状态，以便我知道哪些链接当前可用。

#### 验收标准

1. WHEN THE Friend_Page 加载时，THE System SHALL 对所有 Contributor 链接执行状态检测
2. WHEN 检测链接状态时，THE System SHALL 使用客户端 JavaScript 发送请求
3. WHEN 链接响应成功时，THE System SHALL 将 Link_Status_Indicator 设置为绿色
4. IF 链接响应失败或超时，THEN THE System SHALL 将 Link_Status_Indicator 设置为灰色
5. THE System SHALL 在 5 秒内完成单个链接的状态检测
6. WHEN 检测进行中时，THE System SHALL 显示默认的灰色 Link_Status_Indicator

### 需求 3: 统计框更新

**用户故事:** 作为网站访问者，我想看到准确的贡献者和朋友数量统计，以便我了解网站的社区规模。

#### 验收标准

1. THE System SHALL 在统计框中分别显示贡献者数量和朋友数量
2. WHEN 计算贡献者数量时，THE System SHALL 只统计 type 为 "contributor" 的 Friends_Array 条目
3. WHEN 计算朋友数量时，THE System SHALL 只统计 type 为 "friend" 的 Friends_Array 条目
4. THE System SHALL 保持统计框的现有样式和动画效果
5. THE System SHALL 在统计框中显示总数、贡献者数和朋友数三个指标

### 需求 4: 友链列表折叠加载

**用户故事:** 作为网站访问者，我想在友链数量较多时能够逐步加载查看，以便页面不会显得过于冗长。

#### 验收标准

1. WHEN Friends_Array 中 type 为 "friend" 的条目数量大于或等于 3 时，THE System SHALL 默认只显示前 3 条友链
2. WHEN Friends_Array 中 type 为 "friend" 的条目数量小于 3 时，THE System SHALL 显示所有友链且不显示 Load_More_Button
3. WHEN 默认显示状态下，THE System SHALL 在友链列表下方显示 Load_More_Button
4. WHEN 用户首次点击 Load_More_Button 时，THE System SHALL 额外显示 5 条友链
5. WHEN 用户再次点击 Load_More_Button 时，THE System SHALL 继续额外显示 5 条友链
6. WHEN 所有友链都已显示时，THE System SHALL 将 Load_More_Button 文字更改为"收起"
7. WHEN 用户点击"收起"按钮时，THE System SHALL 恢复到初始状态（只显示前 3 条）
8. THE System SHALL 使用客户端 JavaScript 实现折叠加载功能
9. WHEN 加载更多友链时，THE System SHALL 应用平滑的展开动画效果

### 需求 5: 随机跳转功能

**用户故事:** 作为网站访问者，我想能够随机访问一个友链，以便发现新的有趣内容。

#### 验收标准

1. THE System SHALL 在"感谢这些优秀的朋友"文字下方显示 Random_Visit_Button
2. WHEN 用户点击 Random_Visit_Button 时，THE System SHALL 从 Friends_Array 中随机选择一个条目
3. WHEN 随机选择完成后，THE System SHALL 在新标签页中打开选中的链接
4. THE System SHALL 包含所有 Contributor 和 Friend 类型的链接在随机选择范围内
5. THE System SHALL 使用客户端 JavaScript 实现随机跳转功能
6. THE Random_Visit_Button SHALL 使用"随机访问"或类似的中文文案
7. THE Random_Visit_Button SHALL 保持与页面其他按钮一致的样式风格

### 需求 6: 样式和动画一致性

**用户故事:** 作为网站维护者，我想确保所有新功能都与现有设计保持一致，以便提供统一的用户体验。

#### 验收标准

1. THE System SHALL 对所有新增元素使用 DaisyUI 组件类
2. THE System SHALL 对所有新增元素使用 Tailwind CSS 工具类
3. THE System SHALL 对新增的交互元素应用渐变色背景效果
4. THE System SHALL 对新增的元素应用 fadeIn 或 fadeInUp 动画
5. WHEN 用户悬停在可交互元素上时，THE System SHALL 显示 hover 状态效果
6. THE System SHALL 确保新增元素的颜色方案与现有页面一致
7. THE System SHALL 确保新增元素的圆角、间距和阴影与现有元素一致

### 需求 7: 响应式设计

**用户故事:** 作为移动设备用户，我想在小屏幕上也能正常使用所有新功能，以便获得良好的移动体验。

#### 验收标准

1. WHEN 在移动设备上查看时，THE System SHALL 确保 Contributor_Button 正确换行和排列
2. WHEN 在移动设备上查看时，THE System SHALL 确保 Load_More_Button 和 Random_Visit_Button 可点击且大小适中
3. THE System SHALL 在不同屏幕尺寸下保持元素的可读性和可用性
4. THE System SHALL 使用 Tailwind CSS 响应式类（sm:, md:, lg:）适配不同屏幕
5. WHEN 在小屏幕上查看时，THE System SHALL 确保贡献者区域不会出现横向滚动
