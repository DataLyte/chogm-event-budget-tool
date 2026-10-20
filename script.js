// ===== The list that holds every event =====
let events = [];
let nextId = 1;

// ===== Find the parts of the page we need =====
const form = document.getElementById("event-form");
const tableBody = document.querySelector("#events-table tbody");

// ===== Helper: round to 2 decimal places =====
function round2(number) {
  return Math.round(number * 100) / 100;
}

// ===== Helper: show money nicely, e.g. £56,000 =====
function formatMoney(number) {
  const sign = number < 0 ? "−" : "";
  return sign + "£" + Math.abs(number).toLocaleString("en-GB", { maximumFractionDigits: 2 });
}

// ===== Work out the calculated fields for one event =====
function calculate(ev) {
  ev.VarianceGBP = ev.ActualCostGBP - ev.BudgetGBP;
  ev.VariancePct = ev.BudgetGBP > 0 ? round2(ev.VarianceGBP / ev.BudgetGBP * 100) : "";
  ev.BudgetStatus = ev.VarianceGBP > 0 ? "Over" : "Within";
  ev.NetCostGBP = ev.ActualCostGBP - ev.IncomeGBP;
  ev.CostPerAttendeeGBP = ev.ActualAttendees > 0 ? round2(ev.ActualCostGBP / ev.ActualAttendees) : "";
  ev.AttendanceRatePct = round2(ev.ActualAttendees / ev.ExpectedAttendees * 100);
  return ev;
}

// ===== Helper: add one cell to a table row =====
function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

// ===== Draw the events table =====
function showEvents() {
  tableBody.innerHTML = "";

  events.forEach(function (ev) {
    const row = document.createElement("tr");

    addCell(row, ev.EventName);
    addCell(row, ev.Category);
    addCell(row, ev.EventDate);
    addCell(row, formatMoney(ev.BudgetGBP));
    addCell(row, formatMoney(ev.ActualCostGBP));

    const sign = ev.VarianceGBP > 0 ? "+" : "";
    const pct = ev.VariancePct === "" ? "" : " (" + sign + ev.VariancePct + "%)";
    addCell(row, sign + formatMoney(ev.VarianceGBP) + pct);

    const statusCell = addCell(row, "");
    const label = document.createElement("span");
    label.textContent = ev.BudgetStatus;
    label.className = ev.BudgetStatus === "Over" ? "status-over" : "status-within";
    statusCell.appendChild(label);

    addCell(row, ev.CostPerAttendeeGBP === "" ? "–" : formatMoney(ev.CostPerAttendeeGBP));
    addCell(row, ev.AttendanceRatePct + "%");
    addCell(row, "");   // Actions – edit/delete buttons come later

    tableBody.appendChild(row);
  });
}

// ===== Update the four summary boxes =====
function updateSummary() {
  let totalBudget = 0;
  let totalSpent = 0;
  let overCount = 0;

  events.forEach(function (ev) {
    totalBudget += ev.BudgetGBP;
    totalSpent += ev.ActualCostGBP;
    if (ev.BudgetStatus === "Over") {
      overCount++;
    }
  });

  document.getElementById("total-budget").textContent = formatMoney(totalBudget);
  document.getElementById("total-spent").textContent = formatMoney(totalSpent);
  document.getElementById("total-remaining").textContent = formatMoney(totalBudget - totalSpent);
  document.getElementById("over-budget-count").textContent = overCount + " of " + events.length;
}

// ===== When "Add event" is clicked =====
form.addEventListener("submit", function (e) {
  e.preventDefault();   // stops the page from reloading

  const newEvent = {
    EventID: "EVT-" + String(nextId).padStart(3, "0"),
    EventName: document.getElementById("event-name").value.trim(),
    Category: document.getElementById("category").value,
    EventDate: document.getElementById("event-date").value,
    BudgetGBP: Number(document.getElementById("budget").value),
    ActualCostGBP: Number(document.getElementById("actual-cost").value),
    IncomeGBP: Number(document.getElementById("income").value) || 0,
    ExpectedAttendees: Number(document.getElementById("expected-guests").value),
    ActualAttendees: Number(document.getElementById("actual-guests").value)
  };

  nextId++;
  events.push(calculate(newEvent));

  showEvents();
  updateSummary();
  form.reset();   // empties the form ready for the next event
});