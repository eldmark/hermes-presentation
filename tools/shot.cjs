// Capturas de la presentación con Chromium (render por software).
// Uso (siempre vía tools/shot.sh, que serializa): OUT=<carpeta> [WAIT=6000] [VIEW=1280x720] [BASE=http://127.0.0.1:5175/] node tools/shot.cjs "N/k" "N/k2" ...
// Genera <OUT>/sN_k.png. Requiere el paquete `playwright` (ruta en PLAYWRIGHT_DIR o la del skill de Claude Code).
const dir = process.env.PLAYWRIGHT_DIR || `${process.env.HOME}/.claude/skills/playwright-skill/node_modules/playwright`
const { chromium } = require(dir)
const out = process.env.OUT, base = process.env.BASE || 'http://127.0.0.1:5175/'
const [vw, vh] = (process.env.VIEW || '1280x720').split('x').map(Number)
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
    await page.goto(base + '#/p/' + process.argv[2], { waitUntil: 'load' })
    for (const tag of process.argv.slice(2)) {
      const [n, k] = tag.split('/')
      await page.evaluate((h) => { location.hash = h }, `#/p/${n}/${k}`)
      await page.waitForTimeout(Number(process.env.WAIT || 6000))
      await page.screenshot({ path: `${out}/s${n}_${k}.png` })
      console.log('ok', tag)
    }
    console.log([...new Set(errs)].slice(0, 8).join('\n') || 'sin errores en consola')
  } finally {
    await browser.close()
  }
})()
