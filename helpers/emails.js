import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ejs from 'ejs'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendMail = async (options) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // Name of template for example: confirm-account.ejs
  const file = __dirname + `/../views/emails/${options.file}.ejs`
  // Compile the file
  const compiled = ejs.compile(fs.readFileSync(file, 'utf-8'))
  // Create the html
  const html = compiled({ url: options.url })

  const mailOptions = {
    from: 'Meeti <noreply@meeti.com>',
    to: options.user.email,
    subject: options.subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}
