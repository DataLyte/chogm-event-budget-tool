# User Guide

This guide explains how to use the CHOGM Event Budget Tool and its Power BI dashboard. No technical knowledge is needed.

> This is a learning prototype. Use fictional data only.

## Part 1: The website

### Opening the tool

Open `index.html` in a web browser such as Edge, Chrome or Firefox. Nothing needs to be installed, and no login is needed.

The page has four areas, from top to bottom:

1. **Summary**: four boxes showing the overall totals
2. **Add an event**: the form for entering event details
3. **Events**: a table listing every event entered
4. **Data buttons**: Load sample data, Download CSV and Clear all

### Adding an event

1. Fill in the form:

| Box | What to enter | Required? |
|---|---|---|
| Event name | The name of the event, for example "State Banquet" | Yes |
| Category | Choose from the list | Yes |
| Date | The date of the event | Yes |
| Budget | The planned budget in pounds | Yes |
| Actual cost | The amount actually spent in pounds | Yes |
| Income / sponsorship | Any money received, such as sponsorship. Leave as 0 if none | No |
| Expected guests | How many guests were expected | Yes |
| Actual guests | How many guests attended | Yes |

2. Click **Add event**.

The event appears in the table, and the summary boxes update.

> Enter amounts as plain numbers, without £ signs or commas. For example, type `50000`, not `£50,000`.

### Reading the results

For each event, the table shows:

| Column | What it means |
|---|---|
| Variance | How much over (+) or under (−) budget, in £ and % |
| Status | A red **Over** label if the event overspent, or a green **Within** label if it did not |
| Cost per guest | The actual cost divided by the number of guests who attended |
| Attendance | How many guests came, as a percentage of those expected. Over 100% means more came than expected |

The summary boxes at the top show the totals for all events together.

### Editing an event

1. Click **Edit** next to the event in the table.
2. The event's details appear in the form, and the form title changes to **Edit event**.
3. Make your changes and click **Save changes**.

To cancel without saving, click **Clear**.

### Deleting an event

1. Click **Delete** next to the event.
2. Click **OK** to confirm, or **Cancel** to keep it.

### Loading sample data

Click **Load sample data** to fill the tool with 15 fictional CHOGM events. This is useful for demonstrations and for trying the tool out.

> This replaces any events already in the table.

### Downloading the data

Click **Download CSV**. A file called `chogm-event-data.csv` is saved to your Downloads folder. It can be opened in Excel or loaded into Power BI.

### Clearing everything

Click **Clear all**, then **OK**, to remove every event.

> **Important:** the tool does not save your data. Refreshing or closing the page removes all events. Download the CSV first if you want to keep a copy.

## Part 2: The Power BI dashboard

### Opening the dashboard

Open `chogm-dashboard.pbix` in **Power BI Desktop** (free from the Microsoft Store). If you don't have Power BI, see `dashboard-screenshot.png` for a picture of the dashboard.

### What the dashboard shows

| Part | What it tells you |
|---|---|
| Headline cards | Total budget, total spent, money remaining, and the number of events over budget |
| Budget vs actual cost by event | Each event's budget (light bar) next to its actual cost (dark bar). Where the dark bar is longer, the event overspent |
| Total spend by category | Where the money is going, from highest to lowest |
| Cost per guest by event | Which events cost the most per person |
| Category filter | Choose a category to show only those events across the whole page |

> Large figures on the cards are rounded to the nearest thousand, for example £693K.

### Filtering

- Use the **Category** dropdown at the top right to show one category, such as Catering.
- You can also click any bar in a chart to filter the rest of the page. Click it again to undo.
- Set the dropdown back to **All** to see everything again.

### Updating the dashboard with new data

1. On the website, enter your events and click **Download CSV**.
2. Replace the old `chogm-event-data.csv` with the new file, keeping the **same name and folder**.
3. In Power BI, click **Refresh** on the Home tab.

## Troubleshooting

| Problem | What to do |
|---|---|
| The page looks plain, with no colours | Check that `style.css` is in the same folder as `index.html` |
| The logo doesn't show, only the words "The Commonwealth" | Check that `commonwealth-logo.png` is in the same folder as `index.html` |
| Buttons don't do anything | Check that `script.js` is in the same folder as `index.html`, then press Ctrl + F5 |
| The form won't let me add an event | A required box is empty, or a number is negative. The browser highlights the box to fix |
| My events disappeared | The page was refreshed or closed. Data is not saved, so download the CSV regularly |
| "There are no events to download yet" | Add an event or load the sample data first |
| `index.html` opens in a code editor instead of a browser | Right-click the file, choose **Open with**, and pick your web browser |
