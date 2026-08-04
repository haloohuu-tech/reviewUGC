const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const pageTitles = {
  reviews:'审核任务',
  tasks:'任务查询',
  policies:'策略中心',
  'user-assets':'用户资产查询',
  'credit-adjust':'Credit 增减管理',
  membership:'会员权益管理',
  'credit-ledger':'Credits 消耗与过期流水',
  'subscription-orders':'订阅订单流水',
  'pack-orders':'加油包订单流水',
  'robot-general':'通用配置',
  'robot-library':'机器人评论库'
};

function avatarData(initial, c1, c2){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="160" height="160" rx="24" fill="url(#g)"/><circle cx="80" cy="62" r="29" fill="rgba(255,255,255,.88)"/><path d="M29 146c5-34 25-51 51-51s46 17 51 51" fill="rgba(255,255,255,.88)"/><text x="80" y="153" text-anchor="middle" font-size="13" font-family="sans-serif" fill="rgba(21,32,51,.68)">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const reviews = [
  {id:'TSK-260714-09281',type:'头像',preview:'林',image:avatarData('林','#7a8faa','#31455e'),user:'UID-882104',sub:'用户头像',machine:'机审通过',risk:'色情低俗 62%',region:'欧盟',uploadAt:'2026-07-15 10:26'},
  {id:'TSK-260714-09277',type:'评论',preview:'评',user:'UID-291830',sub:'这首歌简直是一团糟，创作者根本不配继续做音乐，建议马上退出这个平台。',machine:'机审通过',risk:'骚扰辱骂 58%',region:'中国大陆',uploadAt:'2026-07-15 10:23'},
  {id:'TSK-260714-09265',type:'昵称',preview:'名',user:'UID-638201',sub:'免费领币官方活动中心888',machine:'机审通过',risk:'广告垃圾 54%',region:'东南亚',uploadAt:'2026-07-15 10:21'},
  {id:'TSK-260714-09260',type:'简介',preview:'简',user:'UID-557418',sub:'独立音乐人，长期提供无损音乐资源和付费推广合作，私信获取联系方式。',machine:'机审通过',risk:'广告垃圾 57%',region:'欧盟',uploadAt:'2026-07-15 10:20'},
  {id:'TSK-260714-09251',type:'评论',preview:'评',user:'UID-420182',sub:'你这种人就不该出现在这里，听到你的作品只会让人觉得非常不舒服。',machine:'机审通过',risk:'仇恨歧视 49%',region:'北美',uploadAt:'2026-07-15 10:18'},
  {id:'TSK-260714-09242',type:'头像',preview:'周',image:avatarData('周','#e5a75f','#8f4e35'),user:'UID-930427',sub:'用户头像',machine:'机审通过',risk:'低风险 28%',region:'日本',uploadAt:'2026-07-15 10:14'},
  {id:'TSK-260714-09231',type:'昵称',preview:'名',user:'UID-110827',sub:'XX音乐平台官方客服-小陈',machine:'机审通过',risk:'冒充欺诈 66%',region:'欧盟',uploadAt:'2026-07-15 10:09'},
  {id:'TSK-260714-09218',type:'评论',preview:'评',user:'UID-712900',sub:'访问我的主页查看更多免费资源，添加联系方式即可领取完整音乐包。',machine:'机审通过',risk:'广告垃圾 52%',region:'中国大陆',uploadAt:'2026-07-15 10:04'},
  {id:'TSK-260714-09202',type:'头像',preview:'郑',image:avatarData('郑','#7a6fbd','#403574'),user:'UID-538991',sub:'用户头像',machine:'机审通过',risk:'暴力极端 47%',region:'北美',uploadAt:'2026-07-15 09:58'}
];

const selectedReviewIds=new Set();
const completedReviewIds=new Set();
let currentReviewId=null;

let taskRows = [
  {id:'TSK-260715-09318',object:'CMT-739411 / CV-50192',user:'UID-725118',type:'评论',detectedAt:'2026-07-15 10:38',mode:'不检查',flow:'未调用机审 → 直接发布',reviewer:'无人工审核',status:'已通过',badge:'success',time:'07-15 10:38'},
  {id:'TSK-260715-09316',object:'BIO-725118 / CV-50188',user:'UID-725118',type:'简介',detectedAt:'2026-07-15 10:36',mode:'不检查',flow:'直接发布 → 运营复审通过（仍可驳回）',reviewer:'周岚 / ops.zhoulan',status:'已通过',badge:'success',time:'07-15 10:36'},
  {id:'TSK-260715-09312',object:'CMT-739390 / CV-50179',user:'UID-681330',type:'评论',detectedAt:'2026-07-15 10:34',mode:'不检查',flow:'直接发布 → 用户删除评论',reviewer:'无人工审核',status:'用户更改',badge:'neutral',time:'—',changeNote:'用户已删除已公开评论'},
  {id:'TSK-260715-09309',object:'USR-447291 / CV-50172',user:'UID-447291',type:'昵称',detectedAt:'2026-07-15 10:33',mode:'先发后审',flow:'机审通过 → 自动发布 → 运营复审通过（仍可驳回）',reviewer:'林子涵 / ops.linzihan',status:'已通过',badge:'success',time:'07-15 10:33'},
  {id:'TSK-260715-09307',object:'BIO-447291 / CV-50169',user:'UID-447291',type:'简介',detectedAt:'2026-07-15 10:32',mode:'先发后审',flow:'自动发布 → 用户更新简介',reviewer:'无人工审核',status:'用户更改',badge:'neutral',time:'—',changeNote:'用户已更新已公开简介'},
  {id:'TSK-260715-09305',object:'USR-310925 / CV-50166',user:'UID-310925',type:'昵称',detectedAt:'2026-07-15 10:31',mode:'先发后审',flow:'机审通过 → 自动发布',reviewer:'无人工审核',status:'已通过',badge:'success',time:'07-15 10:31'},
  {id:'TSK-260715-09302',object:'BIO-310925 / CV-50161',user:'UID-310925',type:'简介',detectedAt:'2026-07-15 10:30',mode:'先发后审',flow:'机审通过 → 自动发布',reviewer:'无人工审核',status:'已通过',badge:'success',time:'07-15 10:30'},
  {id:'TSK-260715-09299',object:'CMT-739268 / CV-50154',user:'UID-516802',type:'评论',detectedAt:'2026-07-15 10:29',mode:'先发后审',flow:'机审驳回 → 未发布',reviewer:'无人工审核',status:'机审驳回',badge:'danger',time:'—'},
  {id:'TSK-260714-09281',object:'USR-882104 / CV-50129',user:'UID-882104',type:'头像',detectedAt:'2026-07-15 10:26',mode:'先审后发',flow:'机审通过 → 待人工二审',reviewer:'未分配',status:'待人工审核',badge:'warning',time:'—'},
  {id:'TSK-260714-09277',object:'CMT-739201 / CV-50117',user:'UID-291830',type:'评论',detectedAt:'2026-07-15 10:23',mode:'先审后发',flow:'机审通过 → 待人工二审',reviewer:'王悦 / ops.wangyue',status:'待人工审核',badge:'warning',time:'—'},
  {id:'TSK-260714-09265',object:'USR-638201 / CV-50098',user:'UID-638201',type:'昵称',detectedAt:'2026-07-15 10:21',mode:'先审后发',flow:'待人工二审 → 用户更新昵称',reviewer:'无人工审核',status:'用户更改',badge:'neutral',time:'—',changeNote:'用户已更新待审核昵称'},
  {id:'TSK-260714-09260',object:'BIO-557418 / CV-50091',user:'UID-557418',type:'简介',detectedAt:'2026-07-15 10:20',mode:'先审后发',flow:'机审通过 → 待人工二审',reviewer:'孙宁 / ops.sunning',status:'待人工审核',badge:'warning',time:'—'},
  {id:'TSK-260714-09258',object:'BIO-449201 / CV-50084',user:'UID-449201',type:'简介',detectedAt:'2026-07-15 10:19',mode:'先审后发',flow:'待人工二审 → 用户清空简介',reviewer:'无人工审核',status:'用户更改',badge:'neutral',time:'—',changeNote:'用户已清空待审核简介'},
  {id:'TSK-260714-09251',object:'CMT-739088 / CV-50062',user:'UID-420182',type:'评论',detectedAt:'2026-07-15 10:18',mode:'先审后发',flow:'机审通过 → 待人工二审',reviewer:'李然 / ops.liran',status:'待人工审核',badge:'warning',time:'—'},
  {id:'TSK-260714-09242',object:'USR-930427 / CV-50031',user:'UID-930427',type:'头像',detectedAt:'2026-07-15 10:14',mode:'先审后发',flow:'待人工二审 → 用户删除头像',reviewer:'无人工审核',status:'用户更改',badge:'neutral',time:'—',changeNote:'用户已删除待审核头像'},
  {id:'TSK-260714-09231',object:'USR-110827 / CV-50018',user:'UID-110827',type:'昵称',detectedAt:'2026-07-15 10:09',mode:'先审后发',flow:'机审通过 → 待人工二审',reviewer:'陈星 / ops.chenxing',status:'待人工审核',badge:'warning',time:'—'},
  {id:'TSK-260714-09218',object:'CMT-738990 / CV-49992',user:'UID-712900',type:'评论',detectedAt:'2026-07-14 12:57',mode:'先发后审',flow:'机审通过 → 运营驳回',reviewer:'陈星 / ops.chenxing',status:'已驳回',badge:'danger',time:'07-14 12:57'},
  {id:'TSK-260714-09202',object:'USR-538991 / CV-49976',user:'UID-538991',type:'头像',detectedAt:'2026-07-14 12:43',mode:'先审后发',flow:'机审通过 → 人工通过',reviewer:'赵欣 / ops.zhaoxin',status:'已通过',badge:'success',time:'07-14 12:48'},
  {id:'TSK-260705-08126',object:'CMT-728101 / CV-48216',user:'UID-208114',type:'评论',detectedAt:'2026-07-05 16:20',mode:'先发后审',flow:'机审通过 → 自动发布',reviewer:'无人工审核',status:'已通过',badge:'success',time:'07-05 16:20'}
];

const policies = [
  {name:'德国用户资料先审策略',id:'POL-DE-PROFILE-009',region:'德国',mode:'先审后发',types:'头像、昵称、简介',after:'进入人工二审队列',status:'已生效',badge:'success',time:'2026-07-12 00:00'},
  {name:'德国评论自动发布策略',id:'POL-DE-COMMENT-010',region:'德国',mode:'先发后审',types:'评论、回复',after:'机审通过后自动发布',status:'已生效',badge:'success',time:'2026-07-13 09:20'},
  {name:'美国用户资料审核策略',id:'POL-US-PROFILE-007',region:'美国',mode:'先审后发',types:'头像、昵称、简介',after:'进入人工二审队列',status:'已生效',badge:'success',time:'2026-07-08 08:00'},
  {name:'新加坡全内容策略',id:'POL-SG-ALL-006',region:'新加坡',mode:'先发后审',types:'头像、昵称、简介、评论、回复',after:'机审通过后自动发布',status:'已生效',badge:'success',time:'2026-07-15 09:30'}
];

const thumbClass = type => type==='头像'?'avatar-img':type==='评论'?'comment-img':'name-img';

function reviewContentCell(r){
  if(r.type==='头像'){
    return `<div class="review-content-stack"><div class="review-content image-content hover-detail" tabindex="0" title="头像完整预览 · ${r.user}"><img src="${r.image}" alt="${r.user} 上传的待审核头像"/><div class="detail-popover image-popover"><img src="${r.image}" alt="头像大图预览"/><div><b>头像完整预览</b><span>${r.user}</span><small>移动鼠标可查看，点击“开始审核”进入详情</small></div></div></div><span class="content-owner-id">用户 ID：${r.user}</span></div>`;
  }
  return `<div class="review-content-stack"><div class="review-content text-content hover-detail" tabindex="0" title="${r.type}：${r.sub}"><span class="content-type-label">${r.type}</span><p>${r.sub}</p><div class="detail-popover text-popover"><b>${r.type}完整内容</b><p>${r.sub}</p><span>${r.user} · ${r.region}</span></div></div><span class="content-owner-id">用户 ID：${r.user}</span></div>`;
}

function taskById(id){return taskRows.find(t=>t.id===id);}
function isReviewTaskActive(id){return taskById(id)?.status==='待人工审核';}
function handleUserContentChanged(id, changeType='更新'){
  const task=taskById(id);
  if(!task||task.status!=='待人工审核')return false;
  task.status='用户更改';task.badge='neutral';task.time='—';task.changeNote=`用户已${changeType}待审核${task.type}`;task.flow=`待人工二审 → 用户${changeType}${task.type}`;
  selectedReviewIds.delete(id);completedReviewIds.add(id);
  if(currentReviewId===id)closeReview();
  renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);renderTasks($('#taskSearch').value,$('#taskStatusFilter').value);
  return true;
}

function updateBatchActions(){
  const count=selectedReviewIds.size;
  $('#selectedCount').textContent=count;
  $('#batchPassBtn').disabled=count===0;
  $('#batchRejectBtn').disabled=count===0;
  const visibleChecks=$$('[data-review-select]');
  $('#reviewSelectAll').checked=visibleChecks.length>0&&visibleChecks.every(box=>box.checked);
  $('#reviewSelectAll').indeterminate=count>0&&!$('#reviewSelectAll').checked;
}

function inDateRange(dateTime,start,end){
  const date=dateTime.slice(0,10);
  return (!start||date>=start)&&(!end||date<=end);
}

function renderReviews(filter='all', query=''){
  const start=$('#reviewStartDate')?.value||'';
  const end=$('#reviewEndDate')?.value||'';
  const list = reviews.filter(r => isReviewTaskActive(r.id) && !completedReviewIds.has(r.id) && inDateRange(r.uploadAt,start,end) && (filter==='all'||r.type===filter) && (!query || `${r.id}${r.user}${r.sub}`.toLowerCase().includes(query.toLowerCase())));
  const visibleIds=new Set(list.map(r=>r.id));
  [...selectedReviewIds].forEach(id=>{if(!visibleIds.has(id))selectedReviewIds.delete(id);});
  $('#reviewCount').textContent = list.length;
  $('#reviewTable').innerHTML = list.map(r=>`<tr class="review-row ${selectedReviewIds.has(r.id)?'selected':''}"><td><input type="checkbox" data-review-select="${r.id}" aria-label="选择任务 ${r.id}" ${selectedReviewIds.has(r.id)?'checked':''}/></td><td>${reviewContentCell(r)}</td><td><b>${r.id}</b><br><small>先审后发 · 待人工二审</small></td><td><span class="badge success">${r.machine}</span><br><small>${r.risk}</small></td><td><b>${r.region}</b><br><span class="mode-tag">先审后发</span></td><td class="upload-time-cell"><b>${r.uploadAt.slice(5)}</b><small>用户上传</small></td><td><button class="table-action" data-open-review="${r.id}">开始审核</button></td></tr>`).join('');
  updateBatchActions();
}

function reviewerCell(reviewer){
  if(!reviewer||!reviewer.includes(' / '))return `<span class="reviewer-empty">${reviewer||'无人工审核'}</span>`;
  const [name,account]=reviewer.split(' / ');
  return `<span class="reviewer-account"><b>${name}</b><small>${account}</small></span>`;
}

function renderTasks(query='', status='all'){
  const q=query.toLowerCase();
  const start=$('#taskStartDate')?.value||'';
  const end=$('#taskEndDate')?.value||'';
  const contentType=$('#taskContentTypeFilter')?.value||'all';
  const mode=$('#taskModeFilter')?.value||'all';
  const list=taskRows.filter(t=>inDateRange(t.detectedAt,start,end)&&(status==='all'||t.status===status)&&(mode==='all'||t.mode===mode)&&(contentType==='all'||t.type===contentType)&&(!q||`${t.id}${t.object}${t.user}${t.type}${t.reviewer}${t.flow}`.toLowerCase().includes(q)));
  $('#taskCount').textContent=list.length;
  $('#taskTable').innerHTML=list.map(t=>`<tr data-task-row="${t.id}"><td><b>${t.id}</b><br><small>${t.object}</small></td><td>${t.user}</td><td>${t.type}</td><td class="detected-time-cell"><b>${t.detectedAt.slice(5)}</b><small>${t.mode==='不检查'?'内容入库':'内容检测'}</small></td><td><span class="badge ${t.mode==='先发后审'?'success':t.mode==='不检查'?'neutral':'info'}">${t.mode}</span></td><td>${t.flow}</td><td>${reviewerCell(t.reviewer)}</td><td><span class="badge ${t.badge}">${t.status}</span>${t.status==='已驳回'||t.status==='机审驳回'?'<br><small class="locked-state">已锁定 · 不可编辑</small>':t.status==='用户更改'?`<br><small class="user-change-state">${t.changeNote} · 不可编辑</small>`:''}</td><td>${t.time}</td><td>${t.status==='已通过'?`<button class="table-action danger-link" data-direct-reject="${t.id}" title="复审通过后仍可直接驳回">直接驳回</button>`:t.status==='待人工审核'?`<button class="table-action" data-open-review="${t.id}">去审核</button>`:'<span class="disabled-action">不可编辑</span>'}</td></tr>`).join('');
}

function rejectedFlow(task, previousStatus){
  if(task.mode==='不检查')return '直接发布 → 运营驳回';
  if(task.mode==='先发后审')return '机审通过 → 运营驳回';
  return previousStatus==='已通过'?'人工通过 → 运营驳回':'机审通过 → 人工驳回';
}

function renderPolicies(){
  $('#policyTable').innerHTML=policies.map(p=>`<tr><td><b>${p.name}</b><br><small>${p.id}</small></td><td>${p.region}</td><td><span class="badge ${p.mode==='先发后审'?'success':'info'}">${p.mode}</span></td><td>${p.types}</td><td><b>${p.after}</b></td><td><span class="badge ${p.badge}">${p.status}</span></td><td>${p.time}</td><td><button class="table-action" data-policy-edit="${p.id}">配置</button></td></tr>`).join('');
  $('#configuredRegionCount').textContent=new Set(policies.map(p=>p.region)).size;
}

function policyScopeValues(types){
  return ['头像','昵称','简介','评论、回复'].filter(scope=>scope==='评论、回复'?(types.includes('评论')||types.includes('回复')):types.includes(scope));
}

function resolvePolicyForContent(country,scope){
  return policies.find(p=>p.region===country&&p.status==='已生效'&&policyScopeValues(p.types).includes(scope))||null;
}

function updateScopeAvailability(resetAvailable=false){
  const country=$('#policyCountrySelect').value;
  const occupied=new Set(policies.filter(p=>p.region===country&&p.id!==editingPolicyId).flatMap(p=>policyScopeValues(p.types)));
  $$('input[name="policyScope"]').forEach(input=>{
    const used=occupied.has(input.value);
    input.disabled=used;
    if(used)input.checked=true;
    else if(resetAvailable||!country)input.checked=false;
    const label=input.closest('label');label.classList.toggle('scope-used',used);
    const marker=label.querySelector('small');if(marker)marker.textContent=used?'其他策略已配置':'';
  });
}

function saveRegionalPolicies(){
  const region=$('#policyCountrySelect').value;
  const scopes=$$('input[name="policyScope"]:checked:not(:disabled)').map(input=>input.value);
  if(!region){toast('请选择一个适用国家；未配置范围默认不检查');return false;}
  if(!scopes.length){toast('请至少选择一种审核内容');return false;}
  const occupied=new Set(policies.filter(p=>p.region===region&&p.id!==editingPolicyId).flatMap(p=>policyScopeValues(p.types)));
  if(scopes.some(scope=>occupied.has(scope))){
    updateScopeAvailability();
    toast('所选审核范围已被该国家的其他策略配置，请重新选择');
    return false;
  }
  const mode=$('#publishModeSelect').value==='post'?'先发后审':'先审后发';
  const baseName=$('#policyNameInput').value.trim()||`${mode}地区策略`;
  const codeMap={'中国':'CN','美国':'US','德国':'DE','日本':'JP','韩国':'KR','新加坡':'SG'};
  const existingIndex=editingPolicyId?policies.findIndex(p=>p.id===editingPolicyId):-1;
  const policy={name:baseName,id:existingIndex>=0?policies[existingIndex].id:`POL-${codeMap[region]||'REG'}-${Date.now().toString().slice(-6)}`,region,mode,types:scopes.join('、'),after:mode==='先发后审'?'机审通过后自动发布':'进入人工二审队列',status:'已生效',badge:'success',time:'2026-07-15 10:30'};
  if(existingIndex>=0)policies.splice(existingIndex,1,policy);else policies.push(policy);
  renderPolicies();
  return {region,mode};
}

function route(page){
  const target=pageTitles[page]?page:'reviews';
  $$('.page').forEach(p=>p.classList.toggle('active',p.dataset.view===target));
  const activeNavPage=['credit-adjust','membership'].includes(target)?'user-assets':target;
  $$('#mainNav a').forEach(a=>a.classList.toggle('active',a.dataset.page===activeNavPage));
  const isAssetChild=['credit-adjust','membership'].includes(target);
  const isRobotChild=['robot-general','robot-library'].includes(target);
  const hasParent=isAssetChild||isRobotChild;
  document.body.classList.toggle('robot-config-active',isRobotChild);
  $('#crumbParent').hidden=!hasParent;
  $('#crumbParentChevron').hidden=!hasParent;
  $('#crumbParent').textContent=isAssetChild?'用户资产查询':isRobotChild?'AI 机器人配置':'';
  $('#crumbTitle').textContent=pageTitles[target];
  document.title=`${pageTitles[target]} · Vanso 运营后台`;
  if(location.hash!==`#${target}`) history.replaceState(null,'',`#${target}`);
  window.scrollTo(0,0);
}

function filterStaticTable(input){
  const page=input.closest('.page');
  const query=input.value.trim().toLowerCase();
  $$('tbody tr',page).forEach(row=>row.style.display=row.textContent.toLowerCase().includes(query)?'':'none');
}

function filterApplicationTable(select){
  const page=select.closest('.page');
  const status=select.value;
  $$('.application-table tbody tr',page).forEach(row=>{
    const matches=status==='全部审核状态'||$('[data-application-status]',row)?.textContent.trim()===status;
    row.style.display=matches?'':'none';
  });
}

function openReview(id){
  if(!isReviewTaskActive(id)){renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);toast('内容已被用户更新或删除，任务已从审核队列移除');return;}
  const r=reviews.find(x=>x.id===id)||reviews[0];
  currentReviewId=r.id;
  $('#drawerTitle').textContent=`${r.type}审核 · ${r.id}`;
  $('#drawerMeta').textContent=`${r.user} · ${r.region} · 先审后发 · 机审已通过`;
  const preview=r.type==='头像'?`<img class="avatar-preview review-avatar-large" src="${r.image}" alt="待审核头像大图"/>`:`<div class="text-preview">${r.sub}</div>`;
  $('#drawerBody').innerHTML=`<div class="review-preview"><span class="preview-label">原始${r.type} · 仅审核可见</span>${preview}</div><section class="drawer-section"><h3>审核链路</h3><div class="review-flow"><span class="done">内容提交</span><i>→</i><span class="done">机审通过</span><i>→</i><span class="current">人工二审</span><i>→</i><span>发布</span></div></section><section class="drawer-section"><h3>任务信息</h3><div class="detail-grid"><span>内容类型<b>${r.type}</b></span><span>地区策略<b>${r.region} · 先审后发</b></span><span>机审结果<b class="text-green">机审通过</b></span><span>用户上传时间<b>${r.uploadAt}</b></span><span>内容版本<b>CV-${Math.floor(Math.random()*90000+10000)}</b></span><span>策略动作<b>人工通过后发布</b></span></div></section><section class="drawer-section"><h3>机审参考</h3><div class="risk-box"><div class="risk-box-top"><b>${r.risk.split(' ')[0]}</b><span class="badge warning">风险分 ${r.risk.split(' ')[1]}</span></div><p>机审已通过，该标签仅供人工二审参考。请根据地区规则给出最终结论。</p></div></section><section class="drawer-section"><h3>操作说明</h3><p class="drawer-rule">人工审核通过后内容发布；如驳回，内容不发布并直接进入不可编辑终态。</p></section>`;
  $('#reviewDrawer').classList.add('open');$('#drawerBackdrop').classList.add('open');$('#reviewDrawer').setAttribute('aria-hidden','false');
}

function closeReview(){ $('#reviewDrawer').classList.remove('open');$('#drawerBackdrop').classList.remove('open');$('#reviewDrawer').setAttribute('aria-hidden','true'); }
let editingPolicyId=null;
function openModal(policyId=null){
  editingPolicyId=policyId;
  const editing=policies.find(p=>p.id===policyId);
  $('#policyCountrySelect').value=editing?.region||'';
  if(editing){$('#policyNameInput').value=editing.name;$('#publishModeSelect').value=editing.mode==='先发后审'?'post':'pre';const ownScopes=new Set(policyScopeValues(editing.types));$$('input[name="policyScope"]').forEach(input=>input.checked=ownScopes.has(input.value));}
  else{$('#policyNameInput').value='';$('#publishModeSelect').value='post';$$('input[name="policyScope"]').forEach(input=>input.checked=false);}
  $('#savePolicy').textContent='保存并立即生效';
  updateScopeAvailability();
  $('#modeHelp span').textContent=$('#publishModeSelect').value==='post'?'先发后审：机审通过后自动发布，无需人工审核；发布后仍可由运营驳回。':'先审后发：机审通过后进入人工二审队列，人工审核通过后才发布。';
  $('#policyModal').classList.add('open');$('#modalBackdrop').classList.add('open');$('#policyModal').setAttribute('aria-hidden','false');
}
function closeModal(){ editingPolicyId=null;$('#policyModal').classList.remove('open');$('#modalBackdrop').classList.remove('open');$('#policyModal').setAttribute('aria-hidden','true'); }
let pendingRejectIds=[];
function openRejectConfirm(ids){
  pendingRejectIds=Array.isArray(ids)?ids:[ids];
  const isBatch=pendingRejectIds.length>1;
  $('#rejectConfirm h2').textContent=isBatch?`确认批量驳回 ${pendingRejectIds.length} 条内容？`:'确认驳回该内容？';
  $('#rejectConfirm>p').textContent=isBatch?'选中的内容将统一按所选原因驳回并下架，所有任务进入不可编辑终态。':'驳回后内容将立即下架，任务进入不可编辑终态，无法再次修改审核结论。';
  $('#rejectConfirm').classList.add('open');$('#modalBackdrop').classList.add('open');$('#rejectConfirm').setAttribute('aria-hidden','false');
}
function closeRejectConfirm(){pendingRejectIds=[];$('#rejectConfirm').classList.remove('open');if(!$('#policyModal').classList.contains('open'))$('#modalBackdrop').classList.remove('open');$('#rejectConfirm').setAttribute('aria-hidden','true');$('#rejectReason').value='';}
let toastTimer;
function toast(msg){clearTimeout(toastTimer);$('#toast span').textContent=msg;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}

function bindEvents(){
  window.addEventListener('hashchange',()=>route(location.hash.slice(1)));
  document.addEventListener('click',e=>{
    const routeBtn=e.target.closest('[data-route]');if(routeBtn){route(routeBtn.dataset.route);$('#commandPalette').classList.remove('open');}
    const segmentBtn=e.target.closest('[data-segment-group] button');if(segmentBtn){$$('button',segmentBtn.closest('[data-segment-group]')).forEach(btn=>btn.classList.toggle('active',btn===segmentBtn));}
    const queryBtn=e.target.closest('[data-prototype-query]');if(queryBtn)toast('已按当前条件刷新查询结果');
    const resetBtn=e.target.closest('[data-prototype-reset]');if(resetBtn){const page=resetBtn.closest('.page');$$('input',page).forEach(input=>{if(input.type==='date')return;input.value='';});$$('select',page).forEach(select=>select.selectedIndex=0);$$('tbody tr',page).forEach(row=>row.style.display='');toast('筛选条件已重置');}
    const submitBtn=e.target.closest('[data-prototype-submit]');if(submitBtn){submitBtn.textContent='已提交飞书审核';submitBtn.disabled=true;toast('申请已提交飞书审核');}
    const withdrawBtn=e.target.closest('[data-withdraw-application]');if(withdrawBtn){const row=withdrawBtn.closest('tr');const statusCell=$('[data-application-status]',row);statusCell.innerHTML='<span class="badge neutral">已撤回</span>';const operationCell=withdrawBtn.closest('td');operationCell.textContent='—';operationCell.classList.add('empty-operation');toast('申请已撤回，资产与权益均未生效');}
    const reviewBtn=e.target.closest('[data-open-review]');if(reviewBtn)openReview(reviewBtn.dataset.openReview);
    const rejectBtn=e.target.closest('[data-direct-reject]');if(rejectBtn)openRejectConfirm(rejectBtn.dataset.directReject);
    const selectBox=e.target.closest('[data-review-select]');if(selectBox){selectBox.checked?selectedReviewIds.add(selectBox.dataset.reviewSelect):selectedReviewIds.delete(selectBox.dataset.reviewSelect);selectBox.closest('tr').classList.toggle('selected',selectBox.checked);updateBatchActions();}
    if(e.target.closest('[data-close-drawer]')||e.target===$('#drawerBackdrop'))closeReview();
    if(e.target.closest('[data-close-modal]'))closeModal();
    if(e.target.closest('[data-close-confirm]'))closeRejectConfirm();
    if(e.target===$('#modalBackdrop')){closeModal();closeRejectConfirm();}
    const policyEdit=e.target.closest('[data-policy-edit]');if(policyEdit)openModal(policyEdit.dataset.policyEdit);
  });
  $('#globalSearch').addEventListener('click',()=>$('#commandPalette').classList.toggle('open'));
  $('#newPolicy').addEventListener('click',()=>openModal());
  $('#savePolicy').addEventListener('click',()=>{const result=saveRegionalPolicies();if(!result)return;closeModal();toast(`${result.region}策略已立即生效，新内容按“${result.mode}”处理`);});
  $('#passTask').addEventListener('click',()=>{if(!currentReviewId||!isReviewTaskActive(currentReviewId)){closeReview();renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);toast('内容已被用户更改，本次审核未提交');return;}const task=taskById(currentReviewId);task.status='已通过';task.badge='success';task.flow='机审通过 → 人工通过';task.reviewer='林子涵 / ops.linzihan';task.time='07-15 10:28';completedReviewIds.add(currentReviewId);selectedReviewIds.delete(currentReviewId);closeReview();renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);renderTasks($('#taskSearch').value,$('#taskStatusFilter').value);toast('人工审核已通过，内容已发布');});
  $('#rejectTask').addEventListener('click',()=>{const id=currentReviewId;closeReview();openRejectConfirm(id);});
  $('#batchPassBtn').addEventListener('click',()=>{const ids=[...selectedReviewIds];const activeIds=ids.filter(isReviewTaskActive);activeIds.forEach(id=>{const task=taskById(id);task.status='已通过';task.badge='success';task.flow='机审通过 → 人工通过';task.reviewer='林子涵 / ops.linzihan';task.time='07-15 10:28';completedReviewIds.add(id);});selectedReviewIds.clear();renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);renderTasks($('#taskSearch').value,$('#taskStatusFilter').value);toast(activeIds.length===ids.length?`已批量通过 ${activeIds.length} 条内容`:`已通过 ${activeIds.length} 条，${ids.length-activeIds.length} 条因用户更改未处理`);});
  $('#batchRejectBtn').addEventListener('click',()=>{const activeIds=[...selectedReviewIds].filter(isReviewTaskActive);if(!activeIds.length){selectedReviewIds.clear();renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);toast('所选内容已被用户更改，无法驳回');return;}openRejectConfirm(activeIds);});
  $('#reviewSelectAll').addEventListener('change',e=>{$$('[data-review-select]').forEach(box=>{box.checked=e.target.checked;box.checked?selectedReviewIds.add(box.dataset.reviewSelect):selectedReviewIds.delete(box.dataset.reviewSelect);box.closest('tr').classList.toggle('selected',box.checked);});updateBatchActions();});
  $('#confirmReject').addEventListener('click',()=>{
    if(!$('#rejectReason').value){$('#rejectReason').focus();return;}
    const ids=[...pendingRejectIds];
    const allowedIds=ids.filter(id=>['待人工审核','已通过'].includes(taskById(id)?.status));
    allowedIds.forEach(id=>{const t=taskById(id);const previousStatus=t.status;t.status='已驳回';t.badge='danger';t.flow=rejectedFlow(t,previousStatus);t.reviewer='林子涵 / ops.linzihan';t.time='—';if(reviews.some(r=>r.id===id))completedReviewIds.add(id);selectedReviewIds.delete(id);});
    closeRejectConfirm();renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value);renderTasks($('#taskSearch').value,$('#taskStatusFilter').value);toast(allowedIds.length!==ids.length?`已驳回 ${allowedIds.length} 条，${ids.length-allowedIds.length} 条因用户更改未处理`:allowedIds.length>1?`已批量驳回 ${allowedIds.length} 条内容，任务已锁定`:'内容已驳回并下架，任务已锁定');
  });
  $('#reviewSearch').addEventListener('input',e=>renderReviews($('#contentTypeFilter').value,e.target.value));
  $('#contentTypeFilter').addEventListener('change',e=>renderReviews(e.target.value,$('#reviewSearch').value));
  $('#reviewStartDate').addEventListener('change',()=>renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value));
  $('#reviewEndDate').addEventListener('change',()=>renderReviews($('#contentTypeFilter').value,$('#reviewSearch').value));
  $('#taskSearchBtn').addEventListener('click',()=>renderTasks($('#taskSearch').value,$('#taskStatusFilter').value));
  $('#taskSearch').addEventListener('input',e=>renderTasks(e.target.value,$('#taskStatusFilter').value));
  $('#taskStatusFilter').addEventListener('change',e=>renderTasks($('#taskSearch').value,e.target.value));
  $('#taskModeFilter').addEventListener('change',()=>renderTasks($('#taskSearch').value,$('#taskStatusFilter').value));
  $('#taskContentTypeFilter').addEventListener('change',()=>renderTasks($('#taskSearch').value,$('#taskStatusFilter').value));
  $('#taskStartDate').addEventListener('change',()=>renderTasks($('#taskSearch').value,$('#taskStatusFilter').value));
  $('#taskEndDate').addEventListener('change',()=>renderTasks($('#taskSearch').value,$('#taskStatusFilter').value));
  $('#policySearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('#policyTable tr').forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?'':'none');});
  $('#policyCountrySelect').addEventListener('change',()=>updateScopeAvailability(true));
  $('#publishModeSelect').addEventListener('change',e=>{$('#modeHelp span').textContent=e.target.value==='post'?'先发后审：机审通过后自动发布，无需人工审核；发布后仍可由运营驳回。':'先审后发：机审通过后进入人工二审队列，人工审核通过后才发布。';updateScopeAvailability();});
  $$('[data-table-search]').forEach(input=>input.addEventListener('input',()=>filterStaticTable(input)));
  $$('[data-application-status-filter]').forEach(select=>select.addEventListener('change',()=>filterApplicationTable(select)));
  $('#commandPalette input').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();$$('.command-results button').forEach(button=>button.style.display=button.textContent.toLowerCase().includes(q)?'':'none');});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#commandPalette').classList.add('open');}if(e.key==='Escape'){closeReview();closeModal();closeRejectConfirm();$('#commandPalette').classList.remove('open');}});
}

renderReviews();renderTasks();renderPolicies();bindEvents();route(location.hash.slice(1)||'reviews');
