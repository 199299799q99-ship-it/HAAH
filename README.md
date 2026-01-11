# NoteFlow - 极简笔记管理应用

NoteFlow 是一款基于 React 和 Ant Design 构建的轻量级笔记应用，旨在为用户提供快速记录灵感、管理待办事项和知识整理的纯净空间。

## (a) 项目代码结构 (Project Structure)

```text
.
├── public/                 # 静态资源 (如：favicon, 外部图标)
└── src/                    # 核心源代码
    ├── assets/             # 应用内使用的静态资源 (图片, SVG)
    ├── App.jsx             # 主应用组件 (包含核心业务逻辑与 UI 渲染)
    ├── App.css             # 应用全局样式及动画定义
    ├── index.css           # 基础样式重置与全局 CSS 变量
    └── main.jsx            # 项目入口文件 (React DOM 挂载)
```

## (b) 详细架构设计 (Architectural Design)

*   **分层设计**: 采用典型的单页面应用 (SPA) 架构。目前业务逻辑相对集中，由核心组件统一管理状态与视图。
*   **状态管理**: 利用 React 原生的 `useState` 钩子管理笔记列表、搜索关键词及主题状态。通过 `useEffect` 监听状态变化并同步至本地存储。
*   **数据流向**:
    1.  **用户输入**: 通过 Ant Design 的表单组件捕获。
    2.  **逻辑处理**: 在 `App.jsx` 中定义的处理器更新 React 状态。
    3.  **持久化**: 状态变更后自动写入 `localStorage`。
    4.  **界面渲染**: React 根据状态变化自动触发组件重绘。
*   **设计决策**: 为了保证极致的响应速度和零后端依赖，项目选择了 `localStorage` 作为数据源，避免了网络延迟带来的不确定性。

## (c) 技术栈详情 (Technology Stack)

*   **语言**: JavaScript (ES6+)，充分利用现代语法特性。sdsdfvssdfss
*   **核心框架**: [React 18.2](https://react.dev/) - 用于构建声明式的 UI。
*   **UI 库**: [Ant Design 6.1](https://ant.design/) - 提供了丰富的企业级 UI 组件和完善的主题定制能力。
*   **构建工具**: [Vite 5.1](https://vitejs.dev/) - 下一代前端构建工具，提供极速的热模块替换 (HMR)。
*   **图标系统**: [@ant-design/icons](https://ant.design/components/icon) - 矢量图标库。

## (d) 核心功能 (Core Features)

*   **笔记全生命周期管理**: 
    *   **功能描述**: 支持笔记的创建、实时预览、编辑更新及安全删除。
*   **全文即时搜索**: 
    *   **功能描述**: 输入关键词即可在毫秒级内从大量笔记中筛选出标题或内容匹配的项目。
*   **动态主题切换**: 
    *   **功能描述**: 内置浅色 (Light)、深色 (Dark) 与粉色 (Pink) 模式，通过 Ant Design 的 ConfigProvider 动态调整全局 UI 色调，并支持本地存储持久化。
*   **离线持久化存储**: 
    *   **功能描述**: 无需注册登录，所有数据均存储在本地浏览器，确保隐私与即时访问。
