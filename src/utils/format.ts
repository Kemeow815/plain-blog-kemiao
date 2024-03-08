import fm from 'front-matter'

// 格式化日期
export function formatDate(date: string) {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}-${month}-${day}`
}

/*
 * 格式化文章内容
 * */
interface TempBody {
  title: string
  summary: string
  body: string
  date: string
  updated: string
}
function formatBody(body: string) {
  const annotationRegex = /^(.+)?\r\n\s*(.+)?\r\n/
  const markReg = /^\[(.+)\]: # '[^']*'?\r\n/
  const firstLineReg = /^(.+)?\s+/
  const frontMatterReg = /^---\s+.*\s+---/s
  const obj: TempBody = {
    title: '',
    summary: '',
    body,
    date: '',
    updated: '',
  }
  // 有 front matter
  if (frontMatterReg.test(obj.body)) {
    const frontMatter = fm(obj.body)
    if (frontMatter.attributes) {
      const { title, date, updated } = frontMatter.attributes as TempBody
      obj.title = title
      obj.date = date
      obj.updated = updated
    }
    if (frontMatter.body)
      obj.body = frontMatter.body
  }
  // 其他
  if (firstLineReg.test(obj.body)) {
    const result = firstLineReg.exec(obj.body)
    if (result?.[1])
      obj.summary = result[1]
    if (markReg.test(obj.body)) {
      const result = annotationRegex.exec(obj.body)
      if (result?.[2])
        obj.summary = result[2]
    }
  }
  return obj
}

/*
 * 格式化文章列表
 * */
interface Post {
  id: number
  title: string
  comments: number
  comments_url: string
  created_at: string
  updated_at: string
  labels: string[]
  milestone: { name: string }
  summary: string
  body: string
  number: number
}
export function formatPost(post: Post) {
  const { id, title, comments, comments_url, created_at, updated_at, labels, body, milestone, number } = post
  const obj = formatBody(body)
  return {
    id,
    title: obj.title || title,
    date: obj.date ? formatDate(obj.date) : formatDate(created_at),
    updated: obj.updated ? formatDate(obj.updated) : formatDate(updated_at),
    comments,
    comments_url,
    labels,
    milestone,
    summary: obj.summary,
    body: obj.body,
    num: number,
  }
}
