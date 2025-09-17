import * as art from "ascii-art"

export async function asciiArt() {
  try {
    const text = await art.style('CONTACT MANAGER', 'green')
    console.log(text)
  } catch {
    console.log(`error generating ASCII art`)
  }
}


