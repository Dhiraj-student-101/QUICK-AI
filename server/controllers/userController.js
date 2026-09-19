import sql from '../configs/db.js'

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;

    const creations = await sql`SELECT * FROM "Creation" WHERE "userId" = ${userId} ORDER BY "createdAt" DESC`;

    res.json({ success: true, creations, plan })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`SELECT * FROM "Creation" WHERE publish = true ORDER BY "createdAt" DESC`;

    res.json({ success: true, creations })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM "Creation" WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" })
    }

    const currentLikes = creation.likes || []
    const alreadyLiked = currentLikes.includes(userId)

    const updatedLikes = alreadyLiked
      ? currentLikes.filter((uid) => uid !== userId)
      : [...currentLikes, userId]

    await sql`UPDATE "Creation" SET likes = ${updatedLikes} WHERE id = ${id}`;

    res.json({
      success: true,
      message: alreadyLiked ? "Creation unliked" : "Creation liked",
    })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}