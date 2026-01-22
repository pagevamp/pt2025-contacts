import figlet from 'figlet'
import chalk from 'chalk'

export async function asciiArt() {
  const text = 'CONTACTS - MANAGER'

  try {
    console.log(
      chalk.bold.blueBright(
        await figlet.text(text, {
          font: 'Standard',
          whitespaceBreak: true,
        })
      )
    )
  } catch (err) {
    console.log('Something went wrong...')
    console.dir(err)
  }
}
