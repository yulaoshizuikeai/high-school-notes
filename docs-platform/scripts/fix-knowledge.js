#!/usr/bin/env node

/**
 * 知识点整理与修正脚本
 * 功能：
 * 1. 扫描所有 Markdown 文件
 * 2. 检测并修复常见问题
 * 3. 标准化文档格式
 * 4. 生成问题报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 直接使用绝对路径
const WORKSPACE_DIR = '/workspace';
const DOCS_DIRS = [
  path.join(WORKSPACE_DIR, '高中语文'),
  path.join(WORKSPACE_DIR, '高中数学'),
  path.join(WORKSPACE_DIR, '高中英语'),
  path.join(WORKSPACE_DIR, '高中物理'),
  path.join(WORKSPACE_DIR, '高中生物')
].filter(dir => fs.existsSync(dir));

const REPORT_FILE = path.join(__dirname, '../reports/knowledge-fix-report.md');

// 常见问题检测规则
const issues = {
  brokenLinks: [],
  duplicateHeadings: [],
  missingFrontMatter: [],
  inconsistentFormatting: [],
  largeFiles: [],
  obsidianSyntax: []
};

// 统计信息
const stats = {
  totalFiles: 0,
  fixedFiles: 0,
  totalIssues: 0
};

/**
 * 读取所有 Markdown 文件
 */
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    // 跳过符号链接和隐藏文件
    if (file.startsWith('.') || file === 'node_modules' || file === '.git') {
      return;
    }
    
    const filePath = path.join(dir, file);
    
    try {
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !stat.isSymbolicLink()) {
        getAllMarkdownFiles(filePath, fileList);
      } else if (file.endsWith('.md') && stat.isFile()) {
        fileList.push(filePath);
      }
    } catch (error) {
      // 跳过无法访问的文件或目录
      console.warn(`跳过无法访问的路径：${filePath}`);
    }
  });
  
  return fileList;
}

/**
 * 检测 YAML front matter
 */
function checkFrontMatter(content, filePath) {
  if (!content.trim().startsWith('---')) {
    issues.missingFrontMatter.push({
      file: filePath,
      message: '缺少 YAML front matter'
    });
    return false;
  }
  return true;
}

/**
 * 检测 Obsidian 双向链接语法
 */
function checkObsidianSyntax(content, filePath) {
  const obsidianLinks = content.match(/\[\[.*?\]\]/g);
  if (obsidianLinks && obsidianLinks.length > 0) {
    issues.obsidianSyntax.push({
      file: filePath,
      links: obsidianLinks,
      count: obsidianLinks.length
    });
  }
}

/**
 * 检测重复标题
 */
function checkDuplicateHeadings(content, filePath) {
  const headings = content.match(/^#{1,6}\s+(.+)$/gm);
  if (headings) {
    const headingMap = {};
    headings.forEach(heading => {
      const text = heading.replace(/^#{1,6}\s+/, '').trim();
      headingMap[text] = (headingMap[text] || 0) + 1;
    });
    
    Object.entries(headingMap).forEach(([heading, count]) => {
      if (count > 1) {
        issues.duplicateHeadings.push({
          file: filePath,
          heading,
          count
        });
      }
    });
  }
}

/**
 * 检测大文件
 */
function checkLargeFile(content, filePath) {
  const lines = content.split('\n').length;
  if (lines > 500) {
    issues.largeFiles.push({
      file: filePath,
      lines,
      suggestion: '建议拆分为多个小文件'
    });
  }
}

/**
 * 修复常见问题
 */
function fixIssues(content, filePath) {
  let fixedContent = content;
  let hasChanges = false;
  
  // 修复 Obsidian 链接语法 [[xxx]] -> [xxx](xxx.md)
  fixedContent = fixedContent.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
    hasChanges = true;
    // 简单转换，实际可能需要更复杂的逻辑
    return `[${linkText}](${linkText}.md)`;
  });
  
  // 标准化标题层级（确保从 H1 开始）
  const lines = fixedContent.split('\n');
  let firstHeadingFound = false;
  const fixedLines = lines.map(line => {
    if (line.startsWith('#') && !firstHeadingFound) {
      firstHeadingFound = true;
      if (!line.startsWith('# ')) {
        hasChanges = true;
        return '# ' + line.replace(/^#+\s*/, '');
      }
    }
    return line;
  });
  
  fixedContent = fixedLines.join('\n');
  
  // 添加或修复 front matter
  if (!fixedContent.trim().startsWith('---')) {
    const fileName = path.basename(filePath, '.md');
    const frontMatter = `---
title: ${fileName}
date: ${new Date().toISOString().split('T')[0]}
tags: []
---

`;
    fixedContent = frontMatter + fixedContent;
    hasChanges = true;
  }
  
  return { content: fixedContent, hasChanges };
}

/**
 * 生成问题报告
 */
function generateReport() {
  let report = `# 知识库问题修复报告\n\n`;
  report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  report += `## 统计信息\n\n`;
  report += `- 总文件数：${stats.totalFiles}\n`;
  report += `- 已修复文件数：${stats.fixedFiles}\n`;
  report += `- 发现问题总数：${stats.totalIssues}\n\n`;
  
  if (issues.missingFrontMatter.length > 0) {
    report += `## 缺少 Front Matter 的文件 (${issues.missingFrontMatter.length})\n\n`;
    issues.missingFrontMatter.forEach(item => {
      report += `- ${item.file}: ${item.message}\n`;
    });
    report += '\n';
  }
  
  if (issues.obsidianSyntax.length > 0) {
    report += `## Obsidian 语法问题 (${issues.obsidianSyntax.length})\n\n`;
    issues.obsidianSyntax.forEach(item => {
      report += `- ${item.file}: 发现 ${item.count} 个双向链接\n`;
      item.links.slice(0, 5).forEach(link => {
        report += `  - ${link}\n`;
      });
      if (item.links.length > 5) {
        report += `  - ... 还有 ${item.links.length - 5} 个\n`;
      }
    });
    report += '\n';
  }
  
  if (issues.duplicateHeadings.length > 0) {
    report += `## 重复标题问题 (${issues.duplicateHeadings.length})\n\n`;
    issues.duplicateHeadings.forEach(item => {
      report += `- ${item.file}: "${item.heading}" 重复 ${item.count} 次\n`;
    });
    report += '\n';
  }
  
  if (issues.largeFiles.length > 0) {
    report += `## 超大文件建议拆分 (${issues.largeFiles.length})\n\n`;
    issues.largeFiles.forEach(item => {
      report += `- ${item.file}: ${item.lines} 行 - ${item.suggestion}\n`;
    });
    report += '\n';
  }
  
  return report;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 开始扫描知识库...');
  
  const markdownFiles = [];
  DOCS_DIRS.forEach(dir => {
    const files = getAllMarkdownFiles(dir);
    markdownFiles.push(...files);
  });
  
  stats.totalFiles = markdownFiles.length;
  
  console.log(`找到 ${markdownFiles.length} 个 Markdown 文件`);
  
  markdownFiles.forEach((filePath, index) => {
    if ((index + 1) % 50 === 0) {
      console.log(`处理进度：${index + 1}/${markdownFiles.length}`);
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 检测问题
      checkFrontMatter(content, filePath);
      checkObsidianSyntax(content, filePath);
      checkDuplicateHeadings(content, filePath);
      checkLargeFile(content, filePath);
      
      // 修复问题
      const { content: fixedContent, hasChanges } = fixIssues(content, filePath);
      
      if (hasChanges) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8');
        stats.fixedFiles++;
      }
    } catch (error) {
      console.error(`处理文件失败 ${filePath}:`, error.message);
    }
  });
  
  // 计算总问题数
  stats.totalIssues = 
    issues.missingFrontMatter.length +
    issues.obsidianSyntax.length +
    issues.duplicateHeadings.length +
    issues.largeFiles.length;
  
  // 生成报告
  const report = generateReport();
  
  // 确保报告目录存在
  const reportDir = path.dirname(REPORT_FILE);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  
  console.log('\n✅ 知识库整理完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 总文件数：${stats.totalFiles}`);
  console.log(`   - 已修复文件数：${stats.fixedFiles}`);
  console.log(`   - 发现问题总数：${stats.totalIssues}`);
  console.log(`📄 详细报告已保存至：${REPORT_FILE}`);
}

main();
