// Stored as shifted character codes so the address and number never appear as plain text in the code or the shipped bundle.
const EMAIL = [62,33,51,35,32,50,60,54,36,34,106,107,119,8,40,59,60,45,39,124,58,47,42]
const PHONE = [102,96,111,98,126,100,97,104,101,122,103,98,116,121,120]

const decode = (codes: number[]) => String.fromCharCode(...codes.map((c, i) => c ^ (((i * 7 + 13) & 31) + 64)))

export const contact = {
  email: decode(EMAIL),
  phone: decode(PHONE),
}
