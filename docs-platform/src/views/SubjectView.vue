<template>
  <div class="subject-view">
    <nav class="breadcrumb">
      <router-link to="/">🏠 首页</router-link>
      <span>/</span>
      <span>{{ subjectName }}</span>
    </nav>

    <header class="subject-header">
      <h1>{{ subjectIcon }} {{ decodedSubjectName }}</h1>
      <p v-if="subjectDesc">{{ subjectDesc }}</p>
    </header>

    <main class="categories-grid" v-if="categories.length > 0">
      <div 
        v-for="(category, index) in categories" 
        :key="index"
        class="category-card"
      >
        <h2>{{ category.name }}</h2>
        <ul class="doc-list">
          <li 
            v-for="doc in category.docs" 
            :key="doc.name"
            @click="navigateToDoc(category.id, doc.name)"
          >
            <span class="doc-icon">📄</span>
            {{ doc.title }}
          </li>
        </ul>
      </div>
    </main>

    <div v-else class="loading">
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseReadmeStructure } from '../composables/useDocs'

const route = useRoute()
const router = useRouter()

const subjectName = computed(() => route.params.subject)
const decodedSubjectName = computed(() => decodeURIComponent(subjectName.value))
const subjectIcon = '📖'
const subjectDesc = ref('')
const categories = ref([])

onMounted(async () => {
  try {
    // 读取学科 README 文件
    const readmeResponse = await fetch(`/docs/${subjectName.value}/README.md`)
    if (readmeResponse.ok) {
      const readmeText = await readmeResponse.text()
      // 解析 README 内容获取分类信息
      await parseReadme(readmeText)
    } else {
      // 如果没有 README，扫描目录结构
      await scanDirectory()
    }
  } catch (error) {
    console.error('加载学科内容失败:', error)
    await scanDirectory()
  }
})

async function parseReadme(content) {
  // 提取描述
  const descMatch = content.match(/>\s*(.+)$/m)
  if (descMatch) {
    subjectDesc.value = descMatch[1]
  }
  
  // 使用新的解析函数
  categories.value = parseReadmeStructure(content)
}

async function scanDirectory() {
  // 备用方案：简单的静态目录结构
  // 实际项目中应该通过 API 获取真实目录结构
  categories.value = [
    {
      id: '01',
      name: '知识模块',
      docs: [
        { name: 'README', title: '学科概览', file: 'README.md' }
      ]
    }
  ]
}

function navigateToDoc(categoryId, docName) {
  // 构建分类路径：如 "01-文言文"
  const categoryPath = categories.value.find(c => c.id === categoryId)?.name || categoryId
  
  router.push(`/doc/${subjectName.value}/${categoryId}-${categoryPath}/${encodeURIComponent(docName)}`)
}
</script>

<style scoped>
.subject-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  margin-bottom: 2rem;
  color: #7f8c8d;
}

.breadcrumb a {
  color: #3498db;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.subject-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.subject-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subject-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-card h2 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ecf0f1;
}

.doc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.doc-list li {
  padding: 0.75rem 0;
  cursor: pointer;
  color: #34495e;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doc-list li:hover {
  color: #3498db;
}

.doc-icon {
  font-size: 0.9rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}
</style>
