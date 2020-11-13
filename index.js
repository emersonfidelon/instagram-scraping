const puppeteer = require('puppeteer');
const fs = require('fs');
 
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/${process.argv[2]}/`);
  
  const imgList = await page.evaluate(() => {
    //  Toda essa função será executada no browser

    // Pegar todas as imagens que estão na de posts
    const nodeListLinks = document.querySelectorAll('article a')
    const nodeList = document.querySelectorAll('article img')
    
    // Transformar o nodelist em array
    const linkArray = [...nodeListLinks]
    let imgArray = [...nodeList]
    
    // transformar cada item do array em objetos
    const linkList = linkArray.map(({href}) => ({url: href}))
    const imgList = imgArray.map(({src}) => ({
      src: src
    }))

    imgList.forEach((img, index) => {
      if(index === 11) return
      img.url = linkList[index].url
    })
    
    // colocar para fora da função
    return imgList
  })

  // Escrever os dados em um arquivo local
  fs.writeFile(`${process.argv[3]}/instagram.json`, JSON.stringify(imgList, null, 2), err => {
    if(err) throw new Error('Ixxxi alguma coisa deu ruim hem na atualização do whatsapp!')

    console.log('Whatsapp images updated_at')
  })

  await browser.close();
})();