import 'dotenv/config'
import { config } from 'dotenv'
import path from 'path'

// 加载 .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

import { db } from './src/db/index'
import { tests } from './src/db/schema'

async function checkTests() {
  try {
    const allTests = await db.select().from(tests)

    console.log('=== 所有测试 ===')
    allTests.forEach(test => {
      console.log(`ID: ${test.id}, 标题: ${test.title}, 分类: ${test.category}`)
    })

    console.log('\n=== 分类统计 ===')
    const funTests = allTests.filter(t => t.category === 'fun')
    const profTests = allTests.filter(t => t.category === 'professional')

    console.log(`专业测试: ${profTests.length} 个`)
    profTests.forEach(t => console.log(`  - ${t.title}`))

    console.log(`\n趣味测试: ${funTests.length} 个`)
    funTests.forEach(t => console.log(`  - ${t.title}`))

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkTests()
