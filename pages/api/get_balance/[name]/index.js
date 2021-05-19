// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default async (req, res) => {
    return res.status(400).send("Bad Request: Currency required")
}
