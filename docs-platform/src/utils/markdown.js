import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 自定义渲染规则，处理 Obsidian 风格的双向链接 [[xxx]]
md.inline.ruler.after('link', 'obsidian_link', (state, silent) => {
  const pos = state.pos
  if (state.src[pos] !== '[' || state.src[pos + 1] !== '[') {
    return false
  }
  
  const end = state.src.indexOf(']]', pos)
  if (end === -1) {
    return false
  }
  
  if (silent) {
    return true
  }
  
  const content = state.src.substring(pos + 2, end)
  const token = state.push('obsidian_link', 'a', 1)
  token.content = content
  token.attrs = [['href', '#'], ['class', 'obsidian-link']]
  
  state.pos = end + 2
  return true
})

// 渲染 obsidian 链接
md.renderer.rules.obsidian_link = (tokens, idx) => {
  const token = tokens[idx]
  const href = token.attrs.find(attr => attr[0] === 'href')[1]
  const content = token.content
  return `<a href="${href}" class="obsidian-link" title="双向链接：${content}">[[${content}]]</a>`
}

// 增强表格渲染
md.renderer.rules.table_open = () => {
  return '<table class="markdown-table">\n'
}

// 增强代码块渲染
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const lang = token.info ? token.info.trim() : ''
  const code = token.content
  
  if (lang) {
    return `<pre class="code-block"><code class="language-${lang}">${md.utils.escapeHtml(code)}</code></pre>`
  }
  return `<pre class="code-block"><code>${md.utils.escapeHtml(code)}</code></pre>`
}

// 处理特殊标记：⭐ 和 💡
md.inline.ruler.after('emphasis', 'special_marker', (state, silent) => {
  const pos = state.pos
  const markers = ['⭐', '💡', '📌', '⚠️']
  
  for (const marker of markers) {
    if (state.src.substr(pos, marker.length) === marker) {
      if (silent) return true
      
      const token = state.push('special_marker', 'span', 0)
      token.content = marker
      token.attrs = [['class', `special-marker marker-${marker.replace(/[^\w]/g, '')}`]]
      state.pos += marker.length
      return true
    }
  }
  return false
})

md.renderer.rules.special_marker = (tokens, idx) => {
  const token = tokens[idx]
  const className = token.attrs.find(attr => attr[0] === 'class')[1]
  return `<span class="${className}">${token.content}</span>`
}

export function renderMarkdown(content) {
  return md.render(content)
}

export default md
