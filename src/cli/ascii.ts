import figlet from "figlet"

export async function asciiArt() {
  const text = "CONTACTS - MANAGER"

  try {
    console.log(
      await figlet.text(text, {
        font: "Standard",
        whitespaceBreak: true,
      })
    )
  } catch (err) {
    console.log("Something went wrong...")
    console.dir(err)
  }
}
