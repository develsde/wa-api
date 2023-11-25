export function logging (req, res, next) {
  console.log(new Date(), req.path)
  return next()
}
