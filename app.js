(function () {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const config = window.RAKSAWALUYA_CONFIG;
  const core = window.RaksawaluyaCore;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmtTime = new Intl.DateTimeFormat('id-ID', {timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const settings = config.simulation;
  const intervalMs = Math.max(500, Number(settings.intervalMs) || 3000);
  document.title = config.title;
  $$('[data-site-name]').forEach(el => { el.textContent = config.name; });
  $('#year').textContent = new Date().getFullYear();
  $('[data-warning-threshold]').textContent = `${settings.warningWaterCm} cm`;
  $('[data-alert-threshold]').textContent = `${settings.alertWaterCm} cm`;
  $('.chart-note>span:last-child').textContent = `60 sampel / interval ${intervalMs / 1000} detik`;

  // Animasi masuk tetap menyediakan konten bila JavaScript nonaktif.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, {threshold: .08});
    $$('.reveal').forEach(el => revealObserver.observe(el));
    document.documentElement.classList.add('js-enhanced');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) $$('.desktop-nav a').forEach(link => {
          const selected = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', selected);
          if (selected) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-15% 0px -60% 0px'});
    $$('main>section[id]').forEach(el => navObserver.observe(el));
  }
  let scrollScheduled = false;
  function updateScroll() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    $('.scroll-progress').style.width = `${total > 0 ? window.scrollY / total * 100 : 0}%`;
    if (!reducedMotion) $('.hero-scene>img').style.transform = `translateY(${Math.min(window.scrollY * .12, 70)}px) scale(1.06)`;
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  updateScroll();

  // Menu seluler dan suasana visual.
  const menuButton = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Buka menu'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'Tutup menu' : 'Buka menu');
  });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if(window.innerWidth > 800) closeMenu(); });
  $$('[data-scene]').forEach(button => button.addEventListener('click', () => {
    const night = button.dataset.scene === 'night';
    $('.hero').classList.toggle('is-night',night);
    $$('[data-scene]').forEach(el => { const selected = el === button; el.classList.toggle('selected',selected); el.setAttribute('aria-pressed',String(selected)); });
  }));

  // Eksplorasi gambar dari sudut-sudut desain asli, bukan model 3D.
  const views = [
    {src:'assets/images/bridge-1.webp', title:'Tampak depan', code:'ELEVATION / 01', alt:'Visualisasi tampak depan Jembatan Raksawaluya', spots:[[50,40],[40,54],[80,58]]},
    {src:'assets/images/bridge-2.webp', title:'Perspektif diagonal', code:'PERSPECTIVE / 02', alt:'Visualisasi perspektif diagonal Jembatan Raksawaluya', spots:[[56,39],[67,51],[40,56]]},
    {src:'assets/images/bridge-3.webp', title:'Geometri rangka', code:'STRUCTURE / 03', alt:'Model rangka baja Raksawaluya tanpa lingkungan', spots:[[58,40],[48,60],[77,40]]},
    {src:'assets/images/bridge-6.webp', title:'Tampak atas', code:'TOP VIEW / 04', alt:'Visualisasi tampak atas lantai dan rangka Raksawaluya', spots:[[55,52],[40,56],[80,57]]}
  ];
  const parts = [
    {title:'Rangka utama', description:'Pola segitiga menghubungkan batang rangka. Geometri ini menjadi dasar untuk memahami bagaimana gaya diteruskan melalui struktur.'},
    {title:'Lantai jembatan', description:'Lantai menyediakan jalur pergerakan kendaraan. Dalam rancangan jembatan, beban pada lantai diteruskan menuju elemen pendukung dan rangka.'},
    {title:'Area tumpuan', description:'Tumpuan menjadi penghubung antara bentang jembatan dan struktur di bawahnya. Bagian ini berperan meneruskan gaya menuju fondasi.'}
  ];
  let activeView = 0, activePart = 0, switchTimer;
  function setPart(index) {
    activePart = (index + parts.length) % parts.length;
    $('#part-number').textContent = String(activePart+1).padStart(2,'0');
    $('#part-title').textContent = parts[activePart].title;
    $('#part-description').textContent = parts[activePart].description;
    $$('[data-part]').forEach(el => { const active = +el.dataset.part === activePart; el.classList.toggle('active',active); el.setAttribute('aria-pressed',String(active)); });
  }
  function setView(index) {
    activeView = index; clearTimeout(switchTimer);
    const stage = $('.explore-stage'); stage.classList.add('is-switching');
    $$('[data-view]').forEach(el => {const active = +el.dataset.view === index; el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    switchTimer = setTimeout(() => {
      const img = $('#explore-image'); img.src = views[index].src; img.alt = views[index].alt;
      img.classList.toggle('view-structure', index === 2); $('#view-label').textContent = views[index].code;
      $$('[data-part]').forEach((el,i) => {el.style.setProperty('--x',`${views[index].spots[i][0]}%`); el.style.setProperty('--y',`${views[index].spots[i][1]}%`);});
      const done = () => stage.classList.remove('is-switching');
      img.onload = done; img.onerror = done;
      if(img.complete) done();
    }, reducedMotion ? 0 : 140);
  }
  $$('[data-view]').forEach(el => el.addEventListener('click',()=>setView(+el.dataset.view)));
  $$('[data-part]').forEach(el => el.addEventListener('click',()=>setPart(+el.dataset.part)));
  $('#prev-part').addEventListener('click',()=>setPart(activePart-1));
  $('#next-part').addEventListener('click',()=>setPart(activePart+1));

  // Dashboard simulasi. Semua status menggunakan ambang contoh yang terlihat.
  let step = 0, scenario = 'normal', paused = false, metric = 'water';
  const metrics = {
    water:{title:'Ketinggian air sungai', label:'Ketinggian air', unit:'cm', digits:0},
    wind:{title:'Kecepatan angin', label:'Kecepatan angin', unit:'km/h', digits:1},
    vibration:{title:'Percepatan getaran', label:'Percepatan getaran', unit:'m/s²', digits:3}
  };
  const history = Array.from({length:60},(_,i)=>({...core.sample(i-59,scenario,settings),time:Date.now()+(i-59)*intervalMs}));
  const canvas = $('#sensor-chart');
  const ctx = canvas.getContext('2d');
  let hoverIndex = null, chartBounds = null;
  function displaySample(s) {
    for (const key of ['water','temp','wind','vibration','traffic','humidity']) {
      const digits = key === 'vibration' ? 3 : key === 'temp' || key === 'wind' ? 1 : 0;
      $(`#value-${key}`).textContent = s[key].toLocaleString('id-ID',{minimumFractionDigits:digits,maximumFractionDigits:digits});
    }
    $('#update-clock').textContent = `${fmtTime.format(new Date(s.time))} WIB`;
    const status = core.classifyWater(s.water,settings.warningWaterCm,settings.alertWaterCm);
    const statusNode = $('#scenario-status'); statusNode.classList.remove('warning','alert'); if(status!=='normal') statusNode.classList.add(status);
    const messages = {
      normal:['Normal · simulasi','Air berada di bawah ambang peringatan contoh.','Di bawah ambang contoh'],
      warning:['Waspada · simulasi','Air melewati ambang waspada contoh. Perhatikan perubahan tren.','Melewati ambang waspada'],
      alert:['Peringatan · simulasi','Air melewati ambang peringatan contoh. Ini hanya demonstrasi.','Melewati ambang peringatan']
    };
    $('#scenario-status-title').textContent=messages[status][0]; $('#scenario-status-text').textContent=messages[status][1];$('#water-caption').textContent=messages[status][2];
  }
  function pushSample() {
    step++; const s = {...core.sample(step,scenario,settings),time:Date.now()}; history.push(s);history.shift();displaySample(s);drawChart();
  }
  function drawChart() {
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect(); if(!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1,2); const w=rect.width,h=rect.height;
    if(canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) {canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const left = metric==='vibration'?51:37, right=12, top=20, bottom=28, cw=w-left-right,ch=h-top-bottom;
    const values=history.map(s=>s[metric]); const rawMin=Math.min(...values),rawMax=Math.max(...values);
    const range=Math.max(rawMax-rawMin,metric==='water'?20:metric==='wind'?4:.014);
    const min=Math.max(0,rawMin-range*.3),max=rawMax+range*.3;
    const x=i=>left+cw*i/(history.length-1); const y=v=>top+ch*(1-(v-min)/(max-min));
    chartBounds={left,right,top,bottom,cw,ch,w,h};
    ctx.font='10px Geist, Arial, sans-serif';ctx.lineWidth=1;
    for(let i=0;i<5;i++) {
      const yy=top+ch*i/4;ctx.strokeStyle='#dde8cb17';ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(w-right,yy);ctx.stroke();
      ctx.fillStyle='#a9b898';ctx.textAlign='right';const v=max-(max-min)*i/4;
      ctx.fillText(v.toFixed(metric==='vibration'?3:0),left-8,yy+3);
    }
    if(metric==='water') {
      for(const [threshold,text] of [[settings.warningWaterCm,'Waspada'],[settings.alertWaterCm,'Peringatan']]) {
        if(threshold>=min&&threshold<=max) {const yy=y(threshold);ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle='#f0ae67';ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(w-right,yy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#f0ae67';ctx.textAlign='right';ctx.fillText(`${text} ${threshold}`,w-right,yy-5);ctx.restore();}
      }
    }
    const gradient=ctx.createLinearGradient(0,top,0,h-bottom);gradient.addColorStop(0,'#b7d3a344');gradient.addColorStop(1,'#b7d3a300');
    ctx.beginPath();ctx.moveTo(x(0),h-bottom);values.forEach((v,i)=>ctx.lineTo(x(i),y(v)));ctx.lineTo(x(values.length-1),h-bottom);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
    ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.lineWidth=2;ctx.strokeStyle='#bad59d';ctx.lineJoin='round';ctx.stroke();
    ctx.fillStyle='#a9b898';ctx.textAlign='left';ctx.fillText(`−${Math.round(59*intervalMs/60000*10)/10} m`,left,h-5);ctx.textAlign='center';ctx.fillText(`−${Math.round(30*intervalMs/60000*10)/10} m`,left+cw*.5,h-5);ctx.textAlign='right';ctx.fillText('Sekarang',w-right,h-5);
    const end=values.length-1;ctx.beginPath();ctx.arc(x(end),y(values[end]),3.5,0,Math.PI*2);ctx.fillStyle='#d5e6bf';ctx.fill();
    if(hoverIndex!==null) {const i=Math.max(0,Math.min(59,hoverIndex));ctx.setLineDash([3,4]);ctx.strokeStyle='#d2dfba70';ctx.beginPath();ctx.moveTo(x(i),top);ctx.lineTo(x(i),h-bottom);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x(i),y(values[i]),4,0,Math.PI*2);ctx.fillStyle='#e9f0dc';ctx.fill();}
    canvas.setAttribute('aria-label',`Grafik simulasi ${metrics[metric].label.toLowerCase()}, nilai terakhir ${values[end].toFixed(metrics[metric].digits)} ${metrics[metric].unit}. 60 sampel terakhir.`);
  }
  function togglePause() {
    paused=!paused; const button=$('#pause-data');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Lanjutkan simulasi':'Jeda simulasi');$('use',button).setAttribute('href',paused?'#i-play':'#i-pause');
  }
  $('#pause-data').addEventListener('click',togglePause);
  $$('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
    scenario=button.dataset.scenario;
    $$('[data-scenario]').forEach(el=>{const active=el===button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    // Pemilihan skenario tetap bisa dicoba ketika pembaruan otomatis dijeda.
    pushSample();
  }));
  $$('[data-metric]').forEach(button=>button.addEventListener('click',()=>{
    metric=button.dataset.metric;hoverIndex=null;$('#chart-tooltip').hidden=true;
    $$('[data-metric]').forEach(el=>{const active=el===button;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    $('#chart-title').textContent=metrics[metric].title;$('#chart-unit').textContent=`${metrics[metric].label} (${metrics[metric].unit})`;drawChart();
  }));
  canvas.addEventListener('pointermove',e=>{
    if(!chartBounds)return;
    const rect=canvas.getBoundingClientRect();const px=e.clientX-rect.left;
    hoverIndex=Math.max(0,Math.min(59,Math.round((px-chartBounds.left)/chartBounds.cw*59)));
    const item=history[hoverIndex],m=metrics[metric],tooltip=$('#chart-tooltip');
    tooltip.textContent=`${fmtTime.format(new Date(item.time))} · ${item[metric].toLocaleString('id-ID',{minimumFractionDigits:m.digits,maximumFractionDigits:m.digits})} ${m.unit}`;
    tooltip.hidden=false;tooltip.style.left=`${Math.max(4,Math.min(px+10,rect.width-tooltip.offsetWidth-4))}px`;drawChart();
  });
  canvas.addEventListener('pointerleave',()=>{hoverIndex=null;$('#chart-tooltip').hidden=true;drawChart();});
  displaySample(history[history.length-1]);
  if('ResizeObserver' in window)new ResizeObserver(drawChart).observe(canvas);else window.addEventListener('resize',drawChart);
  if(document.fonts)document.fonts.ready.then(drawChart);else drawChart();
  setInterval(()=>{if(!paused&&!document.hidden)pushSample();},intervalMs);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){drawChart();}});

  // Accordion inovasi, satu panel terbuka pada saat yang sama.
  $$('.innovation-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(detail.open)$$('.innovation-list details').forEach(other=>{if(other!==detail)other.open=false;});
  }));

  // Galeri, filter, keyboard, serta dialog native dengan pengelolaan fokus.
  const galleryItems=[
    {src:'assets/images/bridge-2.webp',title:'Di antara dua sisi',alt:'Perspektif diagonal Raksawaluya di atas sungai',category:'visual'},
    {src:'assets/images/bridge-3.webp',title:'Geometri yang berbicara',alt:'Model rangka baja Raksawaluya tanpa lingkungan',category:'structure'},
    {src:'assets/images/bridge-4.webp',title:'Dari dalam bentang',alt:'Visualisasi jalan di dalam rangka Raksawaluya',category:'visual'},
    {src:'assets/images/bridge-6.webp',title:'Ritme sebuah rancangan',alt:'Tampak atas dek dan rangka Raksawaluya',category:'structure'}
  ];
  let galleryFilter='all',modalItems=[],modalIndex=0,lastFocused;
  const lightbox=$('#lightbox');
  function renderLightbox(){
    const item=modalItems[modalIndex];$('#lightbox-image').src=item.src;$('#lightbox-image').alt=item.alt;$('#lightbox-title').textContent=item.title;
    $('#lightbox-index').textContent=`${String(modalIndex+1).padStart(2,'0')} / ${String(modalItems.length).padStart(2,'0')}`;
    $('.lightbox-controls').hidden=modalItems.length<2;
  }
  function showLightbox(items,index){
    lastFocused=document.activeElement;modalItems=items;modalIndex=index;renderLightbox();lightbox.showModal();document.body.classList.add('modal-open');
  }
  function nextImage(delta){modalIndex=(modalIndex+delta+modalItems.length)%modalItems.length;renderLightbox();}
  function closeLightbox(){lightbox.close();}
  $('#close-lightbox').addEventListener('click',closeLightbox);$('#lightbox-prev').addEventListener('click',()=>nextImage(-1));$('#lightbox-next').addEventListener('click',()=>nextImage(1));
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();nextImage(1);}if(e.key==='ArrowLeft'){e.preventDefault();nextImage(-1);}});
  lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastFocused)lastFocused.focus();});
  lightbox.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeLightbox();}});
  $$('.gallery-item').forEach(button=>button.addEventListener('click',()=>{
    const items=galleryItems.filter(item=>galleryFilter==='all'||item.category===galleryFilter);
    const selected=galleryItems[+button.dataset.image];showLightbox(items,items.indexOf(selected));
  }));
  $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    galleryFilter=button.dataset.filter;
    $$('[data-filter]').forEach(el=>{const selected=el===button;el.classList.toggle('active',selected);el.setAttribute('aria-pressed',String(selected));});
    let count=0;$$('.gallery-item').forEach(el=>{el.hidden=galleryFilter!=='all'&&el.dataset.category!==galleryFilter;if(!el.hidden)count++;});
    $('.gallery-grid').classList.toggle('is-filtered',galleryFilter!=='all');$('#gallery-count').textContent=`${count} visualisasi ditampilkan • Klik gambar untuk memperbesar`;
  }));
  $('#expand-view').addEventListener('click',()=>showLightbox(views,activeView));

  // Formulir hanya membuat laporan lokal; tidak mengirim data atau menyimpan di server.
  let reportText='';const reportDialog=$('#report-dialog');
  $('#report-form').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;const messageField=$('[name="message"]',form);const nameField=$('[name="name"]',form);
    nameField.setCustomValidity(nameField.value.trim()?'':'Tuliskan nama kamu.');
    messageField.setCustomValidity(messageField.value.trim().length>=10?'':'Pesan perlu memuat setidaknya 10 karakter.');
    if(!form.reportValidity())return;
    const data=new FormData(form);reportText=core.report({name:data.get('name'),email:data.get('email'),topic:data.get('topic'),message:data.get('message')},config.name);
    $('#report-preview').textContent=reportText;lastFocused=document.activeElement;reportDialog.showModal();document.body.classList.add('modal-open');
  });
  $$('#report-form input, #report-form textarea').forEach(input=>input.addEventListener('input',()=>input.setCustomValidity('')));
  $('#close-report').addEventListener('click',()=>reportDialog.close());
  reportDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastFocused)lastFocused.focus();});
  $('#download-report').addEventListener('click',()=>{
    const blob=new Blob(['\uFEFF'+reportText],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`laporan-${config.name.toLowerCase().replace(/[^a-z0-9-]/g,'-')}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
})();
