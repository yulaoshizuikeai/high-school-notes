<template>
  <div class="doc-view">
    <nav class="breadcrumb">
      <router-link to="/">🏠 首页</router-link>
      <span>/</span>
      <router-link :to="`/subject/${subject}`">{{ subject }}</router-link>
      <span>/</span>
      <span>{{ docTitle }}</span>
    </nav>

    <main class="doc-content" v-if="!loading">
      <article v-html="renderedContent"></article>
    </main>

    <div v-else class="loading">
      <p>加载文档中...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '../utils/markdown'
import { parseMarkdownContent } from '../composables/useDocs'

const route = useRoute()
const subject = computed(() => route.params.subject)
const category = computed(() => route.params.category)
const docName = computed(() => route.params.doc)
const docTitle = computed(() => decodeURIComponent(docName.value).replace(/-/g, ' '))

const content = ref('')
const renderedContent = ref('')
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    
    // 从 category 中提取目录名，如 "01-文言文" -> "01-文言文"
    const categoryDir = category.value
    
    // 构建文档路径
    const docPath = `/docs/${subject.value}/${categoryDir}/${docName.value}.md`
    
    const response = await fetch(docPath)
    if (!response.ok) {
      throw new Error(`无法加载文档：${docPath}`)
    }
    
    content.value = await response.text()
    
    // 解析 front matter 和正文
    const parsed = parseMarkdownContent(content.value)
    
    // 渲染 Markdown
    renderedContent.value = renderMarkdown(parsed.body)
  } catch (err) {
    console.error('加载文档失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.doc-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.breadcrumb a {
  color: #3498db;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  margin: 0 0.5rem;
  color: #bdc3c7;
}

.doc-content {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
}

.doc-content :deep(h1) {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #ecf0f1;
}

.doc-content :deep(h2) {
  font-size: 1.5rem;
  color: #34495e;
  margin: 2rem 0 1rem;
}

.doc-content :deep(h3) {
  font-size: 1.25rem;
  color: #34495e;
  margin: 1.5rem 0 0.75rem;
}

.doc-content :deep(p) {
  margin: 1rem 0;
  color: #2c3e50;
}

.doc-content :deep(ul),
.doc-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.doc-content :deep(li) {
  margin: 0.5rem 0;
}

.doc-content :deep(blockquote) {
  border-left: 4px solid #3498db;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #7f8c8d;
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
}

.doc-content :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
  color: #e74c3c;
}

.doc-content :deep(pre) {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.doc-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.doc-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.doc-content :deep(th),
.doc-content :deep(td) {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.doc-content :deep(th) {
  background: #f5f5f5;
  font-weight: 600;
}

.doc-content :deep(a) {
  color: #3498db;
  text-decoration: none;
}

.doc-content :deep(a:hover) {
  text-decoration: underline;
}

.doc-content :deep(.obsidian-link) {
  color: #9b59b6;
  background: #f5eef8;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-content :deep(.obsidian-link:hover) {
  background: #e8daef;
  text-decoration: none;
}

/* 特殊标记样式 */
.doc-content :deep(.special-marker) {
  display: inline-block;
  margin: 0 0.3rem;
  font-size: 1.1em;
}

.doc-content :deep(.marker-⭐) {
  color: #f39c12;
}

.doc-content :deep(.marker-💡) {
  color: #3498db;
}

.doc-content :deep(.marker-📌) {
  color: #e74c3c;
}

.doc-content :deep(.marker-⚠️) {
  color: #f39c12;
}

/* 表格样式增强 */
.doc-content :deep(.markdown-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.doc-content :deep(.markdown-table th) {
  background: linear-gradient(to bottom, #f8f9fa, #ecf0f1);
  font-weight: 600;
  color: #2c3e50;
}

/* 代码块样式增强 */
.doc-content :deep(.code-block) {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  position: relative;
}

.doc-content :deep(.code-block code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
  line-height: 1.6;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
}

.loading {
  color: #7f8c8d;
}

.error {
  color: #e74c3c;
  background: #fdedec;
  border-radius: 8px;
  border: 1px solid #fadbd8;
}
</style>
