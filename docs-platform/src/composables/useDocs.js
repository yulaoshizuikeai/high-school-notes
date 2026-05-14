import { ref, computed } from 'vue'

// 学科配置
export const subjects = [
  { id: 'chinese', name: '高中语文', path: '高中语文', icon: '📖' },
  { id: 'math', name: '高中数学', path: '高中数学', icon: '📐' },
  { id: 'english', name: '高中英语', path: '高中英语', icon: '🔤' },
  { id: 'physics', name: '高中物理', path: '高中物理', icon: '⚛️' },
  { id: 'biology', name: '高中生物', path: '高中生物', icon: '🧬' }
]

// 获取学科列表
export function useSubjects() {
  return ref(subjects)
}

// 获取单个学科信息
export function getSubjectById(id) {
  return subjects.find(s => s.id === id)
}

// 解析 Markdown 文件内容
export function parseMarkdownContent(content) {
  // 提取 front matter
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  let frontMatter = {}
  let body = content
  
  if (frontMatterMatch) {
    const frontMatterStr = frontMatterMatch[1]
    const lines = frontMatterStr.split('\n')
    let currentKey = null
    
    lines.forEach(line => {
      if (line.startsWith('tags:')) {
        currentKey = 'tags'
        frontMatter.tags = []
      } else if (line.trim().startsWith('- ') && currentKey === 'tags') {
        frontMatter.tags.push(line.trim().substring(2))
      } else if (!line.startsWith(' ') && line.includes(':')) {
        const [key, value] = line.split(':')
        currentKey = key.trim()
        frontMatter[currentKey] = value ? value.trim() : ''
      }
    })
    
    body = content.substring(frontMatterMatch[0].length)
  }
  
  // 提取标题
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : (frontMatter.title || '无标题')
  
  return {
    frontMatter,
    title,
    body
  }
}

// 从 README 解析学科结构
export function parseReadmeStructure(content) {
  const categories = []
  const lines = content.split('\n')
  let currentCategory = null
  let currentDocs = []
  
  for (const line of lines) {
    // 匹配分类标题 ### XX 分类名
    const categoryMatch = line.match(/^###\s+(\d*)[-\s]*(.+)/)
    if (categoryMatch) {
      // 保存之前的分类
      if (currentCategory && currentDocs.length > 0) {
        categories.push({
          id: currentCategory.match(/^\d+/)?.[0] || '',
          name: currentCategory.replace(/^\d+\s*/, ''),
          docs: [...currentDocs]
        })
      }
      currentCategory = categoryMatch[0].replace(/^###\s*/, '').trim()
      currentDocs = []
      continue
    }
    
    // 匹配文档列表项 - [[文档名]]
    const docMatch = line.match(/-\s*\[\[(.+?)\]\]/)
    if (docMatch && currentCategory) {
      const docName = docMatch[1]
      currentDocs.push({
        name: docName,
        title: docName.replace(/-/g, ' '),
        file: docName + '.md'
      })
    }
  }
  
  // 保存最后一个分类
  if (currentCategory && currentDocs.length > 0) {
    categories.push({
      id: currentCategory.match(/^\d+/)?.[0] || '',
      name: currentCategory.replace(/^\d+\s*/, ''),
      docs: [...currentDocs]
    })
  }
  
  return categories
}

// 将文档名转换为路径
export function docNameToPath(docName, categoryPrefix) {
  // 从 [[01-文言文基础]] 转换为 01-文言文/01-文言文基础.md
  const match = docName.match(/^(\d+)-(.+)/)
  if (match) {
    const num = match[1]
    // 找到对应的分类目录
    return `${categoryPrefix}${num}-*/${docName}.md`
  }
  return `${categoryPrefix}**/${docName}.md`
}

// 生成文档的完整路径
export function generateDocPath(subject, category, docName) {
  // 清理 category，移除数字前缀的空格
  const cleanCategory = category.replace(/^\d+\s*/, '')
  const categoryWithNum = category.match(/^\d+/) ? category : `**-${cleanCategory}`
  
  // 尝试几种可能的路径格式
  const paths = [
    `/docs/${subject}/${category}/${docName}.md`,
    `/docs/${subject}/${categoryWithNum}/${docName}.md`
  ]
  
  return paths
}
