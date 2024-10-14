import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

import { Course, Purchase } from '@prisma/client'

type PurchaseWithCourse = Purchase & {
  course: Course
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  // tao 1 grouped map qua các courses
  // tinh tong so purchase cua tung course,
  // luu vao grouped map theo course title
  //

  // Example implementation:
  // Initialize an empty object to store the grouped data.
  // Then, iterate through the purchases array and for each purchase,
  // increment the corresponding course title in the grouped object.

  // Note: Replace the following code with your actual implementation.

  // Example:

  // grouped = {
  //   'Course 1': 10,
  //   'Course 2': 5,
  //   //...
  // }

  // Return the grouped object.

  const grouped: { [courseTitle: string]: number } = {}

  purchases.forEach((p) => {
    const courseTitle = p.course.title
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }

    grouped[courseTitle] += p.course.price!
  })

  return grouped
}

export const getAnalytics = async (userId: string) => {
  // Lấy thông tin phân tích
  // lấy danh sách các course đã mua của người dùng
  // Lấy totalRevenue,
  // Lấy total sales
  try {
    if (!userId) {
      throw new Error('Only teacher can canm get analytics')
    }

    const purchases = await db.purchase.findMany({
      include: { course: true }
    })

    const groupedByCourse = groupByCourse(purchases)

    const totalRevenue = purchases.reduce((prev, purchase) => {
      return prev + purchase.course.price!
    }, 0)
    const totalSales = purchases.length

    return {
      data: Object.entries(groupedByCourse).map(
        ([courseTitle, totalPrice]) => ({
          name: courseTitle,
          total: totalPrice
        })
      ),
      totalRevenue,
      totalSales
    }
  } catch (error) {
    console.log('[GET_ANALYTCIS]::', error)
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0
    }
  }
}
