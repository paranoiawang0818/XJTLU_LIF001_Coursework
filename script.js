const appData = {
  playerProfile: {
    nickname: "星野逐光",
    rank: "最强王者 37 星",
    lanes: ["打野", "对抗路"],
    heroes: ["镜", "曜", "夏洛特"],
    bindStatus: "已绑定微信与战绩 UID",
  },
  recentPerformance: {
    winRate: 62,
    kda: 4.8,
    teamFight: 71,
    goldConversion: 83,
    deathRate: 18,
    streak: "2 连败后 3 连胜",
    heroPool: 76,
    variance: 63,
    mentalityRisk: 39,
    recentSignals: [
      { day: "周一", performance: 78, fatigue: 36, note: "节奏稳定，打野位支援成功率提升。" },
      { day: "周二", performance: 84, fatigue: 31, note: "镜的切后排效率明显提升。" },
      { day: "周三", performance: 73, fatigue: 52, note: "深夜双排后，团战失误率开始上升。" },
      { day: "周四", performance: 69, fatigue: 58, note: "法师位补位表现低于主分路，经济落后偏多。" },
      { day: "周五", performance: 81, fatigue: 38, note: "切回打野位后，前中期节奏恢复。" },
      { day: "周六", performance: 86, fatigue: 33, note: "午后时段操作平稳，推进效率最佳。" },
      { day: "周日", performance: 74, fatigue: 55, note: "连续游玩超 3 小时后，死亡率偏高。" },
    ],
  },
  timeRecords: {
    today: "2.6 小时",
    weekly: "17.8 小时",
    monthly: "68.4 小时",
    streak: "最长连续 3.4 小时",
    nightRatio: 34,
    bestPeriod: "14:00 - 17:00",
    fatiguePeriod: "23:30 - 01:30",
    daily: [
      { day: "周一", hours: 1.8 },
      { day: "周二", hours: 2.2 },
      { day: "周三", hours: 3.5 },
      { day: "周四", hours: 2.9 },
      { day: "周五", hours: 1.9 },
      { day: "周六", hours: 3.1 },
      { day: "周日", hours: 2.4 },
    ],
    aiLinks: [
      { title: "连续游玩超 180 分钟", text: "系统自动降低推荐强度，避免在疲劳状态下继续高压对抗。" },
      { title: "深夜对局比例达到 34%", text: "AI 标记为高波动时段，优先推荐恢复训练与低压磨合模式。" },
      { title: "午后训练期胜率更高", text: "若在 14:00 - 17:00 开始排位，系统会恢复稳态进阶档位。" },
    ],
  },
  aiRecommendation: {
    level: "稳态进阶",
    score: 72,
    confidence: 86,
    mode: "3v3 适应赛 + 5v5 中高压对抗",
    trainingFocus: "团战入场时机与逆风资源置换",
    delta: "高压对抗 -> 稳态进阶",
    trigger: "近 3 日疲劳升高 + 法师位补位表现偏弱",
    summary: "AI 识别到你在主分路仍保持较强操作强度，但深夜连打会让死亡率与团战失误率同步上升，因此建议从高压对抗下调一级，先稳定决策质量再继续拉强度。",
    reasons: [
      "近 5 场死亡率偏高",
      "凌晨时段表现下降",
      "打野位胜率高于法师位 14%",
      "连续游玩超过 3 小时后波动上升",
    ],
    pipeline: [
      { title: "输入数据层", text: "读取近 10 场战绩、近 7 日在线时长、主分路与补位分路差异、时段化表现波动。" },
      { title: "行为判断层", text: "交叉计算团战失误率、经济转化、深夜疲劳影响和英雄熟练度稳定区间。" },
      { title: "推荐输出层", text: "生成当前难度、适配模式、训练方向，并保留最近一次自动降档记录。" },
    ],
    adjustments: [
      { title: "03 月 29 日 23:48", text: "检测到连续 4 局高强度排位后死亡率上升，AI 从“高压对抗”下调至“稳态进阶”。" },
      { title: "03 月 31 日 15:10", text: "午后训练胜率回升，AI 保持“稳态进阶”，未重新升档，优先巩固稳定度。" },
    ],
  },
};

const metricConfig = [
  { label: "KDA", value: () => appData.recentPerformance.kda, detail: "输出、击杀与生存的综合平衡。" },
  { label: "参团率", value: () => `${appData.recentPerformance.teamFight}%`, detail: "当前节奏参与度维持在较高区间。" },
  { label: "经济转化", value: () => `${appData.recentPerformance.goldConversion}%`, detail: "拿到资源后转化为推进和击杀的效率。" },
  { label: "死亡率", value: () => `${appData.recentPerformance.deathRate}%`, detail: "疲劳时段死亡率偏高，是本轮降档主因。" },
  { label: "连胜 / 连败", value: () => appData.recentPerformance.streak, detail: "当前状态处于修复后的回升阶段。" },
  { label: "英雄池稳定度", value: () => `${appData.recentPerformance.heroPool}/100`, detail: "主玩英雄稳定，补位英雄仍有波动。" },
  { label: "操作波动值", value: () => `${appData.recentPerformance.variance}/100`, detail: "数值越高，说明同强度下发挥越不稳定。" },
  { label: "心态风险指数", value: () => `${appData.recentPerformance.mentalityRisk}/100`, detail: "仍处于可控区间，但深夜时段会上浮。" },
];

const screenIds = ["lobby", "dashboard", "time"];
let isAuthenticated = false;

function $(selector) {
  return document.querySelector(selector);
}

function createTag(text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = text;
  return span;
}

function setScreen(screen) {
  if (!isAuthenticated) {
    return;
  }
  const next = screenIds.includes(screen) ? screen : "lobby";
  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.toggle("active", section.dataset.screen === next);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === next);
  });
  window.location.hash = next;
}

function setAuthState(authenticated) {
  isAuthenticated = authenticated;
  $("#login-shell").classList.toggle("app-hidden", authenticated);
  $("#app-shell").classList.toggle("app-hidden", !authenticated);
}

function renderSidebar() {
  $("#sidebar-difficulty-label").textContent = appData.aiRecommendation.level;
  $("#sidebar-difficulty-copy").textContent = appData.aiRecommendation.summary;
  $("#sidebar-confidence").textContent = `${appData.aiRecommendation.confidence}%`;
}

function renderLobbyScreen() {
  $("#lobby-greeting").textContent = `${appData.playerProfile.nickname}，你的 AI 辅助状态已同步`;
  $("#lobby-summary").textContent = `当前账号${appData.playerProfile.bindStatus}。AI 结合近 10 场战绩与近 7 日时长后，判断你处在“可进阶但不宜持续拉满强度”的阶段。`;
  $("#lobby-rank").textContent = appData.playerProfile.rank;
  $("#lobby-heroes").textContent = appData.playerProfile.heroes.join(" / ");
  $("#lobby-mode").textContent = appData.aiRecommendation.mode;
  $("#lobby-difficulty").textContent = `今日推荐难度：${appData.aiRecommendation.level}`;
  $("#lobby-difficulty-copy").textContent = appData.aiRecommendation.summary;
  $("#lobby-difficulty-fill").style.width = `${appData.aiRecommendation.score}%`;

  const lobbyTags = $("#lobby-tags");
  lobbyTags.innerHTML = "";
  appData.aiRecommendation.reasons.slice(0, 3).forEach((tag) => lobbyTags.appendChild(createTag(tag)));

  const signalList = $("#recent-signal-list");
  signalList.innerHTML = "";
  appData.recentPerformance.recentSignals.slice(-4).forEach((signal) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `<strong>${signal.day}</strong><p>${signal.note}</p>`;
    signalList.appendChild(item);
  });
}

function renderDashboard() {
  $("#dashboard-status").textContent = "状态波动可控";

  const metricGrid = $("#metric-grid");
  metricGrid.innerHTML = "";
  metricConfig.forEach((metric) => {
    const card = document.createElement("div");
    card.className = "metric-card";
    card.innerHTML = `<span>${metric.label}</span><strong>${metric.value()}</strong><p>${metric.detail}</p>`;
    metricGrid.appendChild(card);
  });

  const chart = $("#performance-chart");
  chart.innerHTML = "";
  appData.recentPerformance.recentSignals.forEach((signal) => {
    const day = document.createElement("div");
    day.className = "chart-day";
    day.innerHTML = `
      <div class="bar-stack">
        <div class="bar performance" style="height:${signal.performance * 2}px"></div>
        <div class="bar fatigue" style="height:${signal.fatigue * 2}px"></div>
      </div>
      <span class="chart-label">${signal.day}</span>
    `;
    chart.appendChild(day);
  });

  const pipeline = $("#ai-pipeline");
  pipeline.innerHTML = "";
  appData.aiRecommendation.pipeline.forEach((step) => {
    const item = document.createElement("div");
    item.className = "pipeline-step";
    item.innerHTML = `<strong>${step.title}</strong><p>${step.text}</p>`;
    pipeline.appendChild(item);
  });

  $("#recommendation-title").textContent = appData.aiRecommendation.level;
  $("#recommendation-confidence").textContent = `置信度 ${appData.aiRecommendation.confidence}%`;
  $("#recommendation-summary").textContent = appData.aiRecommendation.summary;
  $("#recommendation-mode").textContent = appData.aiRecommendation.mode;
  $("#recommendation-training").textContent = appData.aiRecommendation.trainingFocus;
  $("#recommendation-delta").textContent = appData.aiRecommendation.delta;
  $("#recommendation-trigger").textContent = appData.aiRecommendation.trigger;

  const reasonTags = $("#reason-tags");
  reasonTags.innerHTML = "";
  appData.aiRecommendation.reasons.forEach((reason) => reasonTags.appendChild(createTag(reason)));

  const adjustmentLog = $("#adjustment-log");
  adjustmentLog.innerHTML = "";
  appData.aiRecommendation.adjustments.forEach((log) => {
    const entry = document.createElement("div");
    entry.className = "adjustment-item";
    entry.innerHTML = `<strong>${log.title}</strong><p>${log.text}</p>`;
    adjustmentLog.appendChild(entry);
  });
}

function renderTimeScreen() {
  const timeCards = $("#time-cards");
  const timeCardData = [
    ["今日游玩", appData.timeRecords.today],
    ["本周累计", appData.timeRecords.weekly],
    ["本月累计", appData.timeRecords.monthly],
    ["最长连续", appData.timeRecords.streak],
  ];
  timeCards.innerHTML = "";
  timeCardData.forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "time-card";
    card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    timeCards.appendChild(card);
  });

  const heatmap = $("#time-heatmap");
  heatmap.innerHTML = "";
  appData.timeRecords.daily.forEach((day) => {
    const row = document.createElement("div");
    row.className = "heat-row";
    row.innerHTML = `
      <span>${day.day}</span>
      <div class="heat-bar-track"><div class="heat-bar" style="width:${(day.hours / 4) * 100}%"></div></div>
    `;
    heatmap.appendChild(row);
  });

  $("#best-period").textContent = appData.timeRecords.bestPeriod;
  $("#fatigue-period").textContent = appData.timeRecords.fatiguePeriod;

  const timeAiLink = $("#time-ai-link");
  timeAiLink.innerHTML = "";
  appData.timeRecords.aiLinks.forEach((item) => {
    const card = document.createElement("div");
    card.className = "link-item";
    card.innerHTML = `<strong>${item.title}</strong><p>${item.text}</p>`;
    timeAiLink.appendChild(card);
  });

  $("#wellness-alert").innerHTML = `<strong>健康提醒</strong><p>近 7 日深夜对局占比 ${appData.timeRecords.nightRatio}%，AI 已将 ${appData.timeRecords.fatiguePeriod} 标记为高疲劳区。若继续长时间排位，系统会优先推荐“恢复训练”而不是继续升档。</p>`;
}

function bindEvents() {
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => setScreen(button.dataset.screen));
  });

  document.querySelectorAll(".nav-jump").forEach((button) => {
    button.addEventListener("click", () => setScreen(button.dataset.target));
  });

  $("#login-enter-button").addEventListener("click", () => {
    setAuthState(true);
    setScreen("lobby");
  });

  $("#apply-button").addEventListener("click", () => setScreen("dashboard"));
  $("#recalibrate-button").addEventListener("click", () => {
    $("#dashboard-status").textContent = "已重新校准，建议维持稳态进阶";
    setScreen("dashboard");
  });

  window.addEventListener("hashchange", () => {
    if (!isAuthenticated) {
      window.location.hash = "";
      return;
    }
    const hash = window.location.hash.replace("#", "");
    if (screenIds.includes(hash)) {
      setScreen(hash);
    }
  });
}

function init() {
  setAuthState(false);
  renderSidebar();
  renderLobbyScreen();
  renderDashboard();
  renderTimeScreen();
  bindEvents();
  if (window.location.hash) {
    window.location.hash = "";
  }
}

init();
