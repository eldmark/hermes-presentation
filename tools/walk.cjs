// Recorrido real con la tecla → y una captura por paso (prueba también los vuelos de cámara entre escenas).
// Uso (vía tools/walk.sh): OUT=<carpeta> [WAIT=3500] [WAIT_SCENE=7000] [VIEW=1280x720] node tools/walk.cjs "N/k" <pasos>
const dir = process.env.PLAYWRIGHT_DIR || `${process.env.HOME}/.claude/skills/playwright-skill/node_modules/playwright`
const { chromium } = require(dir)
const out = process.env.OUT, base = process.env.BASE || 'http://127.0.0.1:5175/'
const [vw, vh] = (process.env.VIEW || '1280x720').split('x').map(Number)
const [n0, k0] = process.argv[2].split('/'), steps = Number(process.argv[3] || 10)
const pad = (n) => String(n).padStart(2, '0')
;(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--disable-dev-shm-usage', '--disable-extensions'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } })
    const errs = []
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)) })
    page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 200)))
    await page.goto(base + `#/p/${n0}/${k0}`, { waitUntil: 'load' })
    await page.waitForTimeout(Number(process.env.WAIT_SCENE || 7000))
    let prev = `${n0}/${k0}`, i = 0
    for (;;) {
      const tag = (await page.evaluate(() => location.hash)).replace('#/p/', '')
      await page.screenshot({ path: `${out}/${pad(i)}_s${tag.replace('/', '_')}.png` })
      console.log('ok', pad(i), tag)
      if (++i > steps) break
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(100)
      const now = (await page.evaluate(() => location.hash)).replace('#/p/', '')
      const changedScene = now.split('/')[0] !== prev.split('/')[0]
      prev = now
      await page.waitForTimeout(Number(changedScene ? process.env.WAIT_SCENE || 7000 : process.env.WAIT || 3500))
    }
    console.log([...new Set(errs)].slice(0, 8).join('\n') || 'sin errores en consola')
  } finally {
    await browser.close()
  }
})()
