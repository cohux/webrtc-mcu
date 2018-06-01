const fs = require("fs").promises


async function test () {
  try {
    let dir = await fs.readdir("./src")
    console.log(dir)
  } catch (error) {
    console.log(error)
  }
}


test()