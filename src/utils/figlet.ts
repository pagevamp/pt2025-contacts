import figlet from 'figlet'

export async function asciiText(str: string) {
  try {
    const text = await figlet.text(str, {
      // font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 50,
      whitespaceBreak: false,
    })
    console.log(text)
  } catch (error) {
    console.log('Failed')
  }
}
