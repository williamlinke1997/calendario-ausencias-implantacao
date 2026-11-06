const TEAM = [
  { name: "Alice Bitello", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787768575/baymax/implantacao/wtnjdhocfjgkynatw4vv.webp" },
  { name: "Andryll Rafael da Silva", role: "ISM I", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787771268/baymax/implantacao/hejhnsdkbrqflrqn4fjk.webp" },
  { name: "Bianka Leandra Santos da Silva", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787768723/baymax/implantacao/wvnmjidiec3pkplxtche.webp" },
  { name: "Guilherme Weide Rodrigues Martins", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1788455974/baymax/implantacao/u95aotndhuwymnly38cs.webp" },
  { name: "Jhulielen Santos da Cunha", role: "ISM JR", photo: "" },
  { name: "Kellen de Barros Lisboa", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787768623/baymax/implantacao/jxy1ead33haykwf5myyq.webp" },
  { name: "Nathalia Cassiely Marques de Figueiredo", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787772073/baymax/implantacao/mw1fbiaihdwjzixgp7m1.webp" },
  { name: "Quezia Ramos de Ramos", role: "ISM JR", photo: "" },
  { name: "Stefane", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787769160/baymax/implantacao/zjytfprcpyril79zkhcj.webp" },
  { name: "Susana Bletsch", role: "ISM I", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787769220/baymax/implantacao/vuqlgdzh2lzaj80sraoa.webp" },
  { name: "Vitoria Tainara Dalavera Alba", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787768683/baymax/implantacao/fouaadwpmeccdapqpnfb.webp" },
  { name: "Wagner Garcia Teixeira", role: "ISM JR", photo: "https://res.cloudinary.com/zvmqr5hs/image/upload/v1787834629/baymax/implantacao/q9uj0gquqtode94n2ck0.webp" }
];

const ABSENCES = [
  { name: "Andryll Rafael da Silva", type: "Férias", start: "2026-12-07", end: "2026-12-11", status: "Planejado" },
  { name: "Kellen de Barros Lisboa", type: "Férias", start: "2026-12-28", end: "2027-01-01", status: "Planejado" },
  { name: "Stefane", type: "Férias", start: "2026-12-28", end: "2027-01-11", status: "Planejado" },
  { name: "Guilherme Weide Rodrigues Martins", type: "Férias", start: "2026-12-29", end: "2027-01-04", status: "Planejado" },
  { name: "Alice Bitello", type: "Férias", start: "2027-01-04", end: "2027-01-18", status: "Planejado" }
].map(item => ({ ...item, person: TEAM.find(person => person.name === item.name) || {} }));

const TYPE_COLORS = {
  "Férias": "#7057d9", "Folga": "#ee7c72", "Atestado": "#32a983",
  "Licença": "#4e89d8", "Treinamento": "#db9d2d", "Banco de horas": "#9c66bc"
};

const state = {
  month: getInitialMonth(),
  activeTypes: new Set(Object.keys(TYPE_COLORS))
};

const monthLabel = document.querySelector("#monthLabel");
const calendarGrid = document.querySelector("#calendarGrid");

function localDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function getInitialMonth() {
  const today = new Date();
  const next = ABSENCES.map(a => localDate(a.start)).filter(d => d >= today).sort((a,b) => a-b)[0];
  const target = next || today;
  return new Date(target.getFullYear(), target.getMonth(), 1);
}

function initials(name) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words.at(-1)[0] : "")).toUpperCase();
}

function datesEqual(a,b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function eventForDate(date) {
  return ABSENCES.filter(a => state.activeTypes.has(a.type) && date >= localDate(a.start) && date <= localDate(a.end));
}

function renderLegend() {
  const usedTypes = [...new Set(ABSENCES.map(a => a.type))];
  document.querySelector("#legend").innerHTML = usedTypes.map(type =>
    `<button data-type="${type}" style="--dot:${TYPE_COLORS[type] || "#777"}" aria-pressed="true">${type}</button>`
  ).join("");
  document.querySelectorAll("#legend button").forEach(button => button.addEventListener("click", () => {
    const type = button.dataset.type;
    state.activeTypes.has(type) ? state.activeTypes.delete(type) : state.activeTypes.add(type);
    button.classList.toggle("is-off", !state.activeTypes.has(type));
    button.setAttribute("aria-pressed", String(state.activeTypes.has(type)));
    renderCalendar();
  }));
}

function renderEvent(event) {
  const avatar = event.person.photo
    ? `<img src="${event.person.photo}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;avatar-fallback&quot;>${initials(event.name)}</span>'">`
    : `<span class="avatar-fallback">${initials(event.name)}</span>`;
  const start = localDate(event.start).toLocaleDateString("pt-BR", {day:"2-digit",month:"2-digit"});
  const end = localDate(event.end).toLocaleDateString("pt-BR", {day:"2-digit",month:"2-digit",year:"numeric"});
  return `<div class="event" data-type="${event.type}" title="${event.name} · ${event.type} · ${start} a ${end}">
    ${avatar}<span class="event-name">${event.name.split(" ")[0]}</span>
  </div>`;
}

function renderCalendar() {
  const year = state.month.getFullYear();
  const month = state.month.getMonth();
  monthLabel.textContent = state.month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  const last = new Date(year, month + 1, 0);
  const totalCells = Math.ceil((first.getDay() + last.getDate()) / 7) * 7;
  const today = new Date();
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const events = eventForDate(date);
    const outside = date.getMonth() !== month;
    cells.push(`<div class="day${outside ? " outside" : ""}${datesEqual(date,today) ? " today" : ""}" role="gridcell" aria-label="${date.toLocaleDateString("pt-BR",{day:"numeric",month:"long"})}">
      <span class="day-number">${date.getDate()}</span>
      <div class="events">${events.slice(0,3).map(renderEvent).join("")}${events.length > 3 ? `<span class="more-events">+${events.length-3} pessoas</span>` : ""}</div>
    </div>`);
  }
  calendarGrid.innerHTML = cells.join("");
  renderMetrics();
}

function renderMetrics() {
  const y = state.month.getFullYear(), m = state.month.getMonth();
  const start = new Date(y,m,1), end = new Date(y,m+1,0);
  const monthEvents = ABSENCES.filter(a => state.activeTypes.has(a.type) && localDate(a.start) <= end && localDate(a.end) >= start);
  const people = new Set(monthEvents.map(a => a.name));
  let days = 0;
  monthEvents.forEach(a => {
    const from = localDate(a.start) < start ? start : localDate(a.start);
    const to = localDate(a.end) > end ? end : localDate(a.end);
    days += Math.floor((to-from)/86400000)+1;
  });
  const next = monthEvents.filter(a => localDate(a.start) >= new Date()).length;
  document.querySelector("#peopleCount").textContent = people.size;
  document.querySelector("#daysCount").textContent = days;
  document.querySelector("#nextCount").textContent = next;
  document.querySelector("#teamCount").textContent = TEAM.length;
}

document.querySelector("#prevMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(),state.month.getMonth()-1,1); renderCalendar(); });
document.querySelector("#nextMonth").addEventListener("click", () => { state.month = new Date(state.month.getFullYear(),state.month.getMonth()+1,1); renderCalendar(); });
document.querySelector("#todayButton").addEventListener("click", () => { const t=new Date(); state.month=new Date(t.getFullYear(),t.getMonth(),1); renderCalendar(); });

const helpDialog = document.querySelector("#helpDialog");
document.querySelector("#helpButton").addEventListener("click", () => helpDialog.showModal());
document.querySelector("#closeHelp").addEventListener("click", () => helpDialog.close());
helpDialog.addEventListener("click", event => { if (event.target === helpDialog) helpDialog.close(); });

renderLegend();
renderCalendar();
