"use client"

import { TypeAnimation } from "react-type-animation"

// give me a list of 10 peoples names
const names = [
  "jhon",
  3000,
  "alex",
  5000,
  "uiMery",
  3000,
  "michael",
  4000,
  "james",
  2000,
  "jane",
  2000,
  "lucy",
  4000,
  "jessica",
  3000,
  "jennifer",
  3000,
]

const ExampleComponent = () => {
  return (
    <TypeAnimation
      className="after:animate-cursor after:content-['|']"
      sequence={names}
      wrapper="span"
      cursor={false}
      repeat={Infinity}
    />
  )
}

export default ExampleComponent
