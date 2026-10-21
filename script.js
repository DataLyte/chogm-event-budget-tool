// ===== The list that holds every event =====
let events = [];
let nextId = 1;
let editingId = null;   // which event is being edited (null = none)

// ===== Find the parts of the page we need =====
const form = document.getElementById("event-form");
const tableBody = document.querySelector("#events-table tbody");
const submitButton = form.querySelector('button[type="submit"]');
const formHeading = document.querySelector("#add-event h2");

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

    // Actions: Edit and Delete buttons
    const actionsCell = addCell(row, "");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", "Edit " + ev.EventName);
    editButton.addEventListener("click", function () { startEdit(ev.EventID); });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("aria-label", "Delete " + ev.EventName);
    deleteButton.addEventListener("click", function () { deleteEvent(ev.EventID); });
    actionsCell.appendChild(deleteButton);

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

// ===== Refresh the table and summary together =====
function refreshPage() {
  showEvents();
  updateSummary();
}

// ===== Edit: put an event back into the form =====
function startEdit(id) {
  const ev = events.find(function (item) { return item.EventID === id; });
  if (!ev) return;

  document.getElementById("event-name").value = ev.EventName;
  document.getElementById("category").value = ev.Category;
  document.getElementById("event-date").value = ev.EventDate;
  document.getElementById("budget").value = ev.BudgetGBP;
  document.getElementById("actual-cost").value = ev.ActualCostGBP;
  document.getElementById("income").value = ev.IncomeGBP;
  document.getElementById("expected-guests").value = ev.ExpectedAttendees;
  document.getElementById("actual-guests").value = ev.ActualAttendees;

  editingId = id;
  submitButton.textContent = "Save changes";
  formHeading.textContent = "Edit event";
  document.getElementById("add-event").scrollIntoView({ behavior: "smooth" });
}

// ===== Leave edit mode and go back to "Add event" =====
function stopEditing() {
  editingId = null;
  submitButton.textContent = "Add event";
  formHeading.textContent = "Add an event";
}

// ===== Delete: remove one event =====
function deleteEvent(id) {
  const ev = events.find(function (item) { return item.EventID === id; });
  if (!ev) return;

  if (confirm('Delete "' + ev.EventName + '"? This can\'t be undone.')) {
    events = events.filter(function (item) { return item.EventID !== id; });
    if (editingId === id) {
      form.reset();
    }
    refreshPage();
  }
}

// ===== When "Add event" / "Save changes" is clicked =====
form.addEventListener("submit", function (e) {
  e.preventDefault();   // stops the page from reloading

  const formData = {
    EventName: document.getElementById("event-name").value.trim(),
    Category: document.getElementById("category").value,
    EventDate: document.getElementById("event-date").value,
    BudgetGBP: Number(document.getElementById("budget").value),
    ActualCostGBP: Number(document.getElementById("actual-cost").value),
    IncomeGBP: Number(document.getElementById("income").value) || 0,
    ExpectedAttendees: Number(document.getElementById("expected-guests").value),
    ActualAttendees: Number(document.getElementById("actual-guests").value)
  };

  if (editingId) {
    // Update the existing event, keeping its ID
    const index = events.findIndex(function (item) { return item.EventID === editingId; });
    formData.EventID = editingId;
    events[index] = calculate(formData);
  } else {
    // Add a brand-new event
    formData.EventID = "EVT-" + String(nextId).padStart(3, "0");
    nextId++;
    events.push(calculate(formData));
  }

  refreshPage();
  form.reset();   // empties the form (and leaves edit mode)
});

// ===== "Clear" button also cancels editing =====
form.addEventListener("reset", function () {
  stopEditing();
});

// ===== Sample data (fictional) =====
const sampleEvents = [
  { EventName: "Opening Ceremony", Category: "Venue", EventDate: "2026-11-09", BudgetGBP: 80000, ActualCostGBP: 74000, IncomeGBP: 5000, ExpectedAttendees: 500, ActualAttendees: 520 },
  { EventName: "State Banquet", Category: "Catering", EventDate: "2026-11-10", BudgetGBP: 50000, ActualCostGBP: 56000, IncomeGBP: 0, ExpectedAttendees: 200, ActualAttendees: 180 },
  { EventName: "Delegate Shuttle Service", Category: "Transport", EventDate: "2026-11-09", BudgetGBP: 25000, ActualCostGBP: 27500, IncomeGBP: 0, ExpectedAttendees: 300, ActualAttendees: 260 },
  { EventName: "Leaders' Retreat", Category: "Accommodation", EventDate: "2026-11-11", BudgetGBP: 60000, ActualCostGBP: 58200, IncomeGBP: 0, ExpectedAttendees: 60, ActualAttendees: 56 },
  { EventName: "Security Operations", Category: "Security", EventDate: "2026-11-09", BudgetGBP: 120000, ActualCostGBP: 131000, IncomeGBP: 0, ExpectedAttendees: 1000, ActualAttendees: 950 },
  { EventName: "Media Centre", Category: "Media", EventDate: "2026-11-09", BudgetGBP: 35000, ActualCostGBP: 33800, IncomeGBP: 8000, ExpectedAttendees: 250, ActualAttendees: 290 },
  { EventName: "Business Forum", Category: "Venue", EventDate: "2026-11-10", BudgetGBP: 40000, ActualCostGBP: 42500, IncomeGBP: 15000, ExpectedAttendees: 400, ActualAttendees: 360 },
  { EventName: "Youth Forum", Category: "Venue", EventDate: "2026-11-08", BudgetGBP: 18000, ActualCostGBP: 16400, IncomeGBP: 2000, ExpectedAttendees: 150, ActualAttendees: 165 },
  { EventName: "Women's Forum Lunch", Category: "Catering", EventDate: "2026-11-08", BudgetGBP: 12000, ActualCostGBP: 11600, IncomeGBP: 0, ExpectedAttendees: 120, ActualAttendees: 110 },
  { EventName: "Delegate Hotel Block", Category: "Accommodation", EventDate: "2026-11-08", BudgetGBP: 150000, ActualCostGBP: 146000, IncomeGBP: 0, ExpectedAttendees: 300, ActualAttendees: 285 },
  { EventName: "Airport Arrivals Hospitality", Category: "Transport", EventDate: "2026-11-08", BudgetGBP: 15000, ActualCostGBP: 14200, IncomeGBP: 0, ExpectedAttendees: 300, ActualAttendees: 310 },
  { EventName: "Press Conference", Category: "Media", EventDate: "2026-11-12", BudgetGBP: 8000, ActualCostGBP: 9100, IncomeGBP: 0, ExpectedAttendees: 100, ActualAttendees: 130 },
  { EventName: "Closing Reception", Category: "Catering", EventDate: "2026-11-12", BudgetGBP: 30000, ActualCostGBP: 28700, IncomeGBP: 3000, ExpectedAttendees: 350, ActualAttendees: 340 },
  { EventName: "Cultural Evening", Category: "Other", EventDate: "2026-11-11", BudgetGBP: 22000, ActualCostGBP: 24600, IncomeGBP: 4000, ExpectedAttendees: 300, ActualAttendees: 275 },
  { EventName: "Foreign Ministers' Meeting", Category: "Venue", EventDate: "2026-11-10", BudgetGBP: 28000, ActualCostGBP: 26500, IncomeGBP: 0, ExpectedAttendees: 80, ActualAttendees: 78 }
];

// ===== "Load sample data" button =====
document.getElementById("load-sample").addEventListener("click", function () {
  events = sampleEvents.map(function (ev, index) {
    const copy = Object.assign({}, ev);
    copy.EventID = "EVT-" + String(index + 1).padStart(3, "0");
    return calculate(copy);
  });
  nextId = events.length + 1;
  form.reset();
  refreshPage();
});

// ===== "Download CSV" button =====
document.getElementById("download-csv").addEventListener("click", function () {
  if (events.length === 0) {
    alert("There are no events to download yet.");
    return;
  }

  const columns = [
    "EventID", "EventName", "Category", "EventDate",
    "BudgetGBP", "ActualCostGBP", "IncomeGBP",
    "ExpectedAttendees", "ActualAttendees",
    "VarianceGBP", "VariancePct", "BudgetStatus",
    "NetCostGBP", "CostPerAttendeeGBP", "AttendanceRatePct"
  ];

  // Wrap a value in quotes if it contains a comma or quote mark
  function csvSafe(value) {
    const text = String(value);
    if (text.includes(",") || text.includes('"')) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  const lines = [columns.join(",")];
  events.forEach(function (ev) {
    const row = columns.map(function (col) { return csvSafe(ev[col]); });
    lines.push(row.join(","));
  });

  const csvText = lines.join("\n");
  const file = new Blob([csvText], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "chogm-event-data.csv";
  link.click();
});

// ===== "Clear all" button =====
document.getElementById("clear-all").addEventListener("click", function () {
  if (confirm("Remove all events? This can't be undone.")) {
    events = [];
    nextId = 1;
    form.reset();
    refreshPage();
  }
});