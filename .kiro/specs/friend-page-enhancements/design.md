# 设计文档

## 概述

本设计为友链页面（src/pages/friend.astro）添加四项功能增强：贡献者区域展示、链接状态检测、统计框更新和交互功能（折叠加载、随机跳转）。设计遵循现有的 Astro + DaisyUI + Tailwind CSS 技术栈，保持页面的视觉一致性和动画效果。

所有新功能将通过客户端 JavaScript 实现交互逻辑，使用 Astro 的 `<script>` 标签和 `astro:page-load` 事件确保在页面导航时正确初始化。

## 架构

### 整体架构

```
friend.astro (页面组件)
├── 服务端渲染部分
│   ├── friends 数据数组
│   ├── 统计计算逻辑
│   └── HTML 结构生成
└── 客户端脚本部分
    ├── 链接状态检测模块
    ├── 折叠加载控制模块
    └── 随机跳转模块
```

### 数据流

1. **服务端渲染阶段**：
   - 读取 friends 数组
   - 按 type 字段过滤和分组数据
   - 计算统计数据（总数、贡献者数、朋友数）
   - 渲染初始 HTML 结构

2. **客户端初始化阶段**：
   - 页面加载完成后触发 `astro:page-load` 事件
   - 初始化链接状态检测
   - 初始化折叠加载控制器
   - 绑定随机跳转按钮事件

3. **用户交互阶段**：
   - 用户点击"加载更多"按钮 → 更新可见友链数量
   - 用户点击"收起"按钮 → 重置可见友链数量
   - 用户点击"随机访问"按钮 → 随机选择并跳转
   - 链接状态检测完成 → 更新状态指示器

## 组件和接口

### 1. 贡献者区域组件

**位置**：在"Header Section"之后，"Stats Section"之前插入

**HTML 结构**：
```html
<section class="animate-fade-in-up" style="animation-delay: 0.15s;">
  <div class="flex items-center gap-3 mb-6">
    <div class="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full p-3 shadow-md">
      <Icon name="lucide:award" class="w-6 h-6 text-accent" />
    </div>
    <h2 class="text-2xl md:text-3xl font-bold">本站贡献者</h2>
  </div>
  
  <div class="bg-gradient-to-br from-base-200/30 to-base-300/30 rounded-2xl p-6 border border-base-200/50">
    <div class="flex flex-wrap gap-3">
      {contributors.map((contributor) => (
        <a
          href={contributor.url}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline gap-2 hover:btn-primary transition-all"
          data-contributor-link={contributor.url}
        >
          <span class="w-2 h-2 rounded-full bg-base-300 contributor-status-dot" 
                data-status="checking"></span>
          <span>{contributor.name}</span>
        </a>
      ))}
    </div>
  </div>
</section>
```

**样式特点**：
- 使用 DaisyUI 的 `btn` 和 `btn-outline` 类
- 状态指示器为圆点，使用 `w-2 h-2 rounded-full`
- 容器使用渐变背景 `bg-gradient-to-br from-base-200/30 to-base-300/30`
- 按钮使用 `flex-wrap` 实现自动换行

### 2. 链接状态检测模块

**接口定义**：
```typescript
interface LinkStatus {
  url: string;
  status: 'checking' | 'online' | 'offline';
}

interface LinkChecker {
  checkLink(url: string): Promise<boolean>;
  updateIndicator(element: HTMLElement, status: 'online' | 'offline'): void;
  checkAllLinks(): Promise<void>;
}
```

**实现逻辑**：
```javascript
async function checkLink(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // 避免 CORS 问题
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true; // 在 no-cors 模式下，只要没有抛出错误就认为成功
  } catch (error) {
    return false;
  }
}

function updateIndicator(dotElement, isOnline) {
  if (isOnline) {
    dotElement.classList.remove('bg-base-300');
    dotElement.classList.add('bg-success');
    dotElement.setAttribute('data-status', 'online');
  } else {
    dotElement.classList.remove('bg-base-300');
    dotElement.classList.add('bg-error');
    dotElement.setAttribute('data-status', 'offline');
  }
}
```

**状态指示器颜色映射**：
- `checking`（检测中）：`bg-base-300`（灰色）
- `online`（在线）：`bg-success`（绿色）
- `offline`（离线）：`bg-error`（红色）

### 3. 统计框更新

**修改现有的统计计算逻辑**：
```javascript
const contributors = friends.filter(f => f.type === "contributor");
const friendsList = friends.filter(f => f.type === "friend");

const stats = {
  total: friends.length,
  contributors: contributors.length,
  friends: friendsList.length,
};
```

**HTML 结构更新**：
```html
<section class="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s;">
  <div class="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:scale-105 transition-transform">
    <div class="text-3xl font-bold text-primary">{stats.total}</div>
    <div class="text-xs text-base-content/60 mt-1">总计</div>
  </div>
  <div class="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:scale-105 transition-transform">
    <div class="text-3xl font-bold text-accent">{stats.contributors}</div>
    <div class="text-xs text-base-content/60 mt-1">贡献者</div>
  </div>
  <div class="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 hover:scale-105 transition-transform">
    <div class="text-3xl font-bold text-secondary">{stats.friends}</div>
    <div class="text-xs text-base-content/60 mt-1">朋友</div>
  </div>
</section>
```

### 4. 随机跳转按钮

**位置**：在"Header Section"的描述文字下方

**HTML 结构**：
```html
<section class="text-center py-4 animate-fade-in">
  <div class="inline-flex items-center gap-3 mb-4">
    <div class="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-error to-error"></div>
    <Icon name="lucide:heart" class="w-12 h-12 text-error animate-pulse" />
    <div class="h-1 w-24 md:w-32 bg-gradient-to-l from-transparent via-error to-error"></div>
  </div>
  <p class="text-base-content/80 max-w-2xl mx-auto text-lg mb-4">
    感谢这些优秀的朋友，让我的开发之路不再孤单！
  </p>
  <button 
    id="randomVisitBtn"
    class="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
  >
    <Icon name="lucide:shuffle" class="w-4 h-4" />
    <span>随机访问</span>
  </button>
</section>
```

**JavaScript 实现**：
```javascript
function setupRandomVisit(friendsData) {
  const btn = document.getElementById('randomVisitBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    if (friendsData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * friendsData.length);
    const randomFriend = friendsData[randomIndex];
    
    window.open(randomFriend.url, '_blank', 'noopener,noreferrer');
  });
}
```

### 5. 友链列表折叠加载

**状态管理**：
```typescript
interface CollapseState {
  visibleCount: number;
  totalCount: number;
  isExpanded: boolean;
}
```

**HTML 结构修改**：
```html
<div class="space-y-3" id="friendsList">
  {friendsList.map((friend, index) => (
    <a
      href={friend.url}
      target="_blank"
      rel="noopener noreferrer"
      class="friend-list-item flex items-center gap-4 p-4 bg-base-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-base-200/50 group"
      data-index={index}
      style={`display: ${index < 3 ? 'flex' : 'none'};`}
    >
      <!-- 现有的友链列表项内容 -->
    </a>
  ))}
</div>

<div class="text-center mt-4" id="loadMoreContainer" style={`display: ${friendsList.length >= 3 ? 'block' : 'none'};`}>
  <button 
    id="loadMoreBtn"
    class="btn btn-outline btn-primary gap-2"
    data-visible="3"
    data-total={friendsList.length}
  >
    <Icon name="lucide:chevron-down" class="w-4 h-4" />
    <span class="load-more-text">加载更多</span>
  </button>
</div>
```

**JavaScript 实现**：
```javascript
function setupCollapseLoad() {
  const btn = document.getElementById('loadMoreBtn');
  const container = document.getElementById('friendsList');
  if (!btn || !container) return;
  
  const items = container.querySelectorAll('.friend-list-item');
  let visibleCount = 3;
  const totalCount = items.length;
  const LOAD_INCREMENT = 5;
  
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('data-expanded') === 'true';
    
    if (isExpanded) {
      // 收起：只显示前 3 条
      items.forEach((item, index) => {
        item.style.display = index < 3 ? 'flex' : 'none';
      });
      visibleCount = 3;
      btn.setAttribute('data-expanded', 'false');
      btn.querySelector('.load-more-text').textContent = '加载更多';
      btn.querySelector('svg').style.transform = 'rotate(0deg)';
    } else {
      // 展开：增加 5 条或显示全部
      const newVisibleCount = Math.min(visibleCount + LOAD_INCREMENT, totalCount);
      items.forEach((item, index) => {
        if (index < newVisibleCount) {
          item.style.display = 'flex';
        }
      });
      visibleCount = newVisibleCount;
      
      if (visibleCount >= totalCount) {
        btn.setAttribute('data-expanded', 'true');
        btn.querySelector('.load-more-text').textContent = '收起';
        btn.querySelector('svg').style.transform = 'rotate(180deg)';
      }
    }
  });
}
```

## 数据模型

### Friend 数据结构

```typescript
interface Friend {
  name: string;        // 名称
  avatar: string;      // 头像 URL
  description: string; // 描述
  url: string;         // 链接 URL
  type: "friend" | "contributor"; // 类型
  tags?: string[];     // 标签（可选）
}
```

### 数据分组

```javascript
// 服务端数据处理
const contributors = friends.filter(f => f.type === "contributor");
const friendsList = friends.filter(f => f.type === "friend");

// 传递给客户端的数据
const clientData = {
  allFriends: friends,
  contributors: contributors,
  friendsList: friendsList
};
```

## 正确性属性

*属性是一种特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 贡献者按钮包含状态指示器

*对于任意*贡献者按钮元素，该按钮内部应该包含一个状态指示器圆点元素（具有 `contributor-status-dot` 类）

**验证需求: 1.4**

### 属性 2: 链接状态与指示器颜色映射

*对于任意*链接状态检测结果，当链接可访问时状态指示器应该显示绿色（`bg-success`），当链接不可访问时应该显示红色（`bg-error`）

**验证需求: 1.5, 1.6, 2.3, 2.4**

### 属性 3: 贡献者数量统计正确性

*对于任意* friends 数组，计算出的贡献者数量应该等于数组中 type 字段为 "contributor" 的条目数量

**验证需求: 3.2**

### 属性 4: 朋友数量统计正确性

*对于任意* friends 数组，计算出的朋友数量应该等于数组中 type 字段为 "friend" 的条目数量

**验证需求: 3.3**

### 属性 5: 初始显示友链数量限制

*对于任意*朋友列表，当朋友数量大于或等于 3 时，初始状态下可见的友链项数量应该等于 3

**验证需求: 4.1**

### 属性 6: 加载更多增量正确性

*对于任意*加载更多操作，点击"加载更多"按钮后，可见友链数量应该增加 5（或达到总数上限）

**验证需求: 4.4, 4.5**

### 属性 7: 全部展开后按钮文字变化

*对于任意*友链列表，当所有友链都已显示时（可见数量等于总数量），"加载更多"按钮的文字应该变为"收起"

**验证需求: 4.6**

### 属性 8: 收起操作重置状态

*对于任意*展开状态的友链列表，点击"收起"按钮后，可见友链数量应该重置为 3

**验证需求: 4.7**

### 属性 9: 随机选择范围完整性

*对于任意*随机跳转操作，随机选择的链接应该来自完整的 friends 数组（包含所有 contributor 和 friend 类型）

**验证需求: 5.4**

### 属性 10: 随机选择结果有效性

*对于任意*随机跳转操作，选择的结果索引应该在 0 到 friends 数组长度减 1 的范围内

**验证需求: 5.2**

## 错误处理

### 1. 链接状态检测错误

**场景**：网络请求失败、超时、CORS 错误

**处理策略**：
- 捕获所有 fetch 错误
- 超时设置为 5 秒
- 失败时将状态指示器设置为红色（离线状态）
- 不阻塞页面渲染和其他功能

**代码示例**：
```javascript
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  await fetch(url, {
    method: 'HEAD',
    mode: 'no-cors',
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  return true;
} catch (error) {
  console.warn(`Link check failed for ${url}:`, error.message);
  return false;
}
```

### 2. 空数据处理

**场景**：friends 数组为空或没有特定类型的条目

**处理策略**：
- 贡献者区域：如果没有贡献者，不显示该区域
- 友链列表：如果没有朋友，显示空状态提示
- 随机跳转：如果数组为空，禁用按钮或不执行操作

**代码示例**：
```javascript
// 服务端渲染条件
{contributors.length > 0 && (
  <section>
    <!-- 贡献者区域 -->
  </section>
)}

// 客户端随机跳转
function setupRandomVisit(friendsData) {
  const btn = document.getElementById('randomVisitBtn');
  if (!btn || friendsData.length === 0) {
    btn?.setAttribute('disabled', 'true');
    return;
  }
  // ... 正常逻辑
}
```

### 3. DOM 元素未找到

**场景**：JavaScript 初始化时找不到预期的 DOM 元素

**处理策略**：
- 所有 DOM 查询后进行 null 检查
- 如果元素不存在，提前返回，不执行后续逻辑
- 使用 `astro:page-load` 事件确保 DOM 已加载

**代码示例**：
```javascript
document.addEventListener('astro:page-load', () => {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) {
    console.warn('Load more button not found');
    return;
  }
  // ... 正常逻辑
});
```

### 4. 数据类型错误

**场景**：friends 数组中的数据格式不符合预期

**处理策略**：
- 使用可选链操作符 `?.` 访问属性
- 提供默认值
- 过滤掉无效数据

**代码示例**：
```javascript
const validFriends = friends.filter(f => 
  f && 
  typeof f.name === 'string' && 
  typeof f.url === 'string' &&
  (f.type === 'friend' || f.type === 'contributor')
);
```

## 测试策略

### 单元测试

单元测试用于验证特定示例、边界条件和错误处理。重点关注：

1. **DOM 结构测试**：
   - 验证贡献者区域是否正确渲染
   - 验证统计框是否包含三个统计项
   - 验证随机访问按钮是否存在于正确位置

2. **边界条件测试**：
   - 友链数量 < 3 时不显示"加载更多"按钮
   - 空数组时的处理
   - 单个友链时的显示

3. **错误处理测试**：
   - 网络请求失败时的状态指示器更新
   - DOM 元素不存在时的优雅降级
   - 无效数据格式的过滤

### 属性测试

属性测试用于验证通用属性在所有输入下都成立。每个测试应运行至少 100 次迭代。

1. **统计计算属性**：
   - **Feature: friend-page-enhancements, Property 3**: 贡献者数量统计正确性
   - **Feature: friend-page-enhancements, Property 4**: 朋友数量统计正确性
   - 生成随机 friends 数组，验证统计结果

2. **折叠加载属性**：
   - **Feature: friend-page-enhancements, Property 5**: 初始显示友链数量限制
   - **Feature: friend-page-enhancements, Property 6**: 加载更多增量正确性
   - **Feature: friend-page-enhancements, Property 7**: 全部展开后按钮文字变化
   - **Feature: friend-page-enhancements, Property 8**: 收起操作重置状态
   - 生成不同长度的友链列表，模拟点击操作，验证状态变化

3. **随机选择属性**：
   - **Feature: friend-page-enhancements, Property 9**: 随机选择范围完整性
   - **Feature: friend-page-enhancements, Property 10**: 随机选择结果有效性
   - 多次执行随机选择，验证结果的有效性和分布

4. **状态指示器属性**：
   - **Feature: friend-page-enhancements, Property 1**: 贡献者按钮包含状态指示器
   - **Feature: friend-page-enhancements, Property 2**: 链接状态与指示器颜色映射
   - 生成不同的链接状态，验证指示器颜色

### 测试工具

- **单元测试框架**：Vitest（Astro 推荐）
- **属性测试库**：fast-check（JavaScript/TypeScript 的属性测试库）
- **DOM 测试**：@testing-library/dom
- **测试配置**：每个属性测试至少 100 次迭代

### 集成测试

1. **页面加载流程**：
   - 验证页面加载后所有模块正确初始化
   - 验证链接状态检测自动启动
   - 验证初始状态正确显示

2. **用户交互流程**：
   - 完整的折叠加载流程（加载更多 → 全部展开 → 收起）
   - 随机跳转功能的端到端测试
   - 贡献者按钮点击跳转测试

3. **响应式测试**：
   - 在不同视口尺寸下测试布局
   - 验证移动端的可用性
