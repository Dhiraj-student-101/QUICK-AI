import { clerkClient, getAuth } from '@clerk/express'

export const auth = async (req, res, next) => {
  try {
    const { userId, sessionClaims } = getAuth(req)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - please log in',
      })
    }

    // "pla" claim looks like "u:premium" or "u:free_user" - extract the plan key
    const planClaim = sessionClaims?.pla || ''
    const hasPremiumPlan = planClaim.split(':')[1] === 'premium'

    const user = await clerkClient.users.getUser(userId)

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      })
      req.free_usage = 0
    }

    req.userId = userId
    req.user = user
    req.plan = hasPremiumPlan ? 'premium' : 'free'

    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    res.status(401).json({
      success: false,
      message: 'Unauthorized - invalid or expired session',
    })
  }
}