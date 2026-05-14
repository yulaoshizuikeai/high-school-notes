<template>
  <div class="home">
    <header class="hero">
      <h1>📚 高中学科知识库</h1>
      <p>基于 Vue + Markdown 的学科笔记平台</p>
    </header>

    <main class="subjects-grid">
      <div 
        v-for="subject in subjectsList" 
        :key="subject.id"
        class="subject-card"
        @click="navigateToSubject(subject.path)"
      >
        <div class="subject-icon">{{ subject.icon }}</div>
        <h3>{{ subject.name }}</h3>
        <p>点击查看 {{ subject.name }} 笔记</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSubjects } from '../composables/useDocs'

const router = useRouter()
const subjectsList = useSubjects().value

function navigateToSubject(path) {
  router.push(`/subject/${encodeURIComponent(path)}`)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.subject-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.subject-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subject-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.subject-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>
