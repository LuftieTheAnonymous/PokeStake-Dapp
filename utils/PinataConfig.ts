"server only"

import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_JWT_PINATA}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_API_ENDPOINT}`
})