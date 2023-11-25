export function auth (req, res, next) {
  const accessToken = `Bearer ${process.env.ACCESS_TOKEN}`
  const userAccessToken = req.headers.authorization

  if (accessToken !== userAccessToken) {
    return res.status(401).send('Unauthorized')
  }

  next()
}
