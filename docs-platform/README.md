# 高中学科知识库 - Vue + Markdown 文档平台

## 📚 项目简介

这是一个基于 **Vue 3 + Vite + Markdown** 构建的高中学科知识库平台，用于展示和管理高中各学科的笔记文档。

## ✨ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 8.x
- **路由管理**: Vue Router 4.x
- **Markdown 解析**: markdown-it
- **样式**: 原生 CSS + Scoped CSS

## 🚀 功能特性

### 已实现
1. ✅ **多学科导航**: 支持语文、数学、英语、物理、生物等学科
2. ✅ **Markdown 渲染**: 完整支持 Markdown 语法，包括代码块、表格、引用等
3. ✅ **Obsidian 链接**: 支持 `[[双向链接]]` 语法解析
4. ✅ **Front Matter**: 自动解析 YAML front matter（标签、元数据）
5. ✅ **响应式设计**: 适配桌面和移动设备
6. ✅ **面包屑导航**: 清晰的路径导航
7. ✅ **美观的 UI**: 现代化的卡片式设计和排版

### 待优化
- [ ] 目录结构自动扫描（当前使用静态配置）
- [ ] 全文搜索功能
- [ ] 深色模式切换
- [ ] 文档目录树（TOC）
- [ ] 阅读进度显示
- [ ] 移动端优化菜单

## 📁 项目结构

```
docs-platform/
├── public/
│   └── docs/              # 学科文档目录（符号链接）
│       ├── 高中语文
│       ├── 高中数学
│       ├── 高中英语
│       ├── 高中物理
│       └── 高中生物
├── src/
│   ├── components/        # Vue 组件
│   ├── composables/       # 组合式函数
│   │   └── useDocs.js     # 文档相关逻辑
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── utils/             # 工具函数
│   │   └── markdown.js    # Markdown 解析配置
│   ├── views/             # 页面视图
│   │   ├── HomeView.vue   # 首页
│   │   ├── SubjectView.vue # 学科页
│   │   └── DocView.vue    # 文档页
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── style.css          # 全局样式
├── package.json
└── vite.config.js
```

## 🔧 开发指南

### 安装依赖
```bash
cd docs-platform
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📝 文档规范

### Markdown 文件格式

每个文档建议使用以下格式：

```markdown
---
tags:
  - 学科标签
  - 知识点标签
---

# 文档标题

## 一级章节

内容...

## 二级章节

内容...
```

### Obsidian 双向链接

支持 `[[文档名]]` 格式的链接，渲染后会显示为紫色背景的链接样式。

## 🎯 重构计划

### 第一阶段：基础架构 ✅
- [x] 创建 Vue 3 + Vite 项目
- [x] 集成 Vue Router
- [x] 集成 markdown-it
- [x] 创建基础页面组件
- [x] 配置文档目录访问

### 第二阶段：文档标准化 🔄
- [ ] 统一各学科 README 格式
- [ ] 规范化 YAML front matter
- [ ] 转换 Obsidian 链接为标准路由
- [ ] 拆分超大文件（如 5000+ 行的文档）

### 第三阶段：功能增强
- [ ] 实现目录树自动生成
- [ ] 添加全文搜索
- [ ] 实现阅读进度
- [ ] 添加深色模式

### 第四阶段：部署优化
- [ ] 配置 SSR（可选）
- [ ] 优化首屏加载
- [ ] 配置 CDN
- [ ] 添加 PWA 支持

## 📊 当前学科覆盖

| 学科 | 状态 | 文档数量 |
|------|------|----------|
| 高中语文 | ✅ | ~50+ |
| 高中数学 | ✅ | 待统计 |
| 高中英语 | ✅ | 待统计 |
| 高中物理 | ✅ | 待统计 |
| 高中生物 | ✅ | 待统计 |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进本项目！

## 📄 许可证

MIT License
