export function preloader() {
    document.addEventListener("DOMContentLoaded", preloading);
    window.addEventListener('load', removePreloader);
}

let preloadingRender = true
let intervalCoef = 1.12
let intervalTime = 1.5
let loadProcent = 0

function preloading() {
  let start = performance.now()
  document.querySelector('.root').style.opacity = 0
  requestAnimationFrame(function interval(time) {
    let delta = time - start
    if ( delta >= intervalTime ) {
      loadProcent += 1
      intervalTime *= intervalCoef
      document.querySelector('.preloader_bg').style.transform = `translateY(${-loadProcent}%)`
    }
    if ( loadProcent === 100) preloadingRender = false
    if ( preloadingRender ) requestAnimationFrame(interval)
  })
}
function removePreloader() {
  console.log('page loaded')
  let preloader = document.querySelector('.preloader')
  if ( preloadingRender ) {
    intervalCoef = 1
    intervalTime = 1.5
  }
  
  setTimeout(function() {
    preloader.style.cssText = `
        transition: opacity 1s;
        opacity: 0;
    `
    document.querySelector('.root').style.cssText = `
        transition: 1s opacity .5s;
        opacity: 1;
    `

    setTimeout(function() {
        document.querySelector('.root').style.cssText = ''
        preloader.remove()
    }, 4000)
  }, 2500)
}