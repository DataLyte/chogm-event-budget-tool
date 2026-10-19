# Data Dictionary

This document describes the data collected and calculated by the CHOGM Event Budget Tool.
All data is fictional and used for demonstration purposes only.

Each row in the data represents **one event**.

## 1. Fields entered by the user

| Field name | Description | Type | Required? | Example |
|---|---|---|---|---|
| EventID | Unique reference for each event (created automatically) | Text | Auto | EVT-001 |
| EventName | Name of the event | Text | Yes | State Banquet |
| Category | Type of event or cost area | Choice from list | Yes | Catering |
| EventDate | Date the event takes place (YYYY-MM-DD) | Date | Yes | 2026-11-12 |
| BudgetGBP | Planned budget in pounds | Number (0 or more) | Yes | 50000 |
| ActualCostGBP | Actual amount spent in pounds | Number (0 or more) | Yes | 56000 |
| IncomeGBP | Income or sponsorship received in pounds | Number (0 or more) | No (defaults to 0) | 0 |
| ExpectedAttendees | Number of guests expected | Whole number (1 or more) | Yes | 200 |
| ActualAttendees | Number of guests who attended | Whole number (0 or more) | Yes | 180 |

### Category options
Venue, Catering, Security, Transport, Accommodation, Media, Other

## 2. Fields calculated by the tool

| Field name | Description | Calculation | Example |
|---|---|---|---|
| VarianceGBP | Amount over (+) or under (−) budget | ActualCostGBP − BudgetGBP | 6000 |
| VariancePct | Variance as a percentage of budget | VarianceGBP ÷ BudgetGBP × 100 | 12.0 |
| BudgetStatus | Whether the event is over or within budget | "Over" if VarianceGBP > 0, otherwise "Within" | Over |
| NetCostGBP | Cost after income is taken off | ActualCostGBP − IncomeGBP | 56000 |
| CostPerAttendeeGBP | Average cost per guest | ActualCostGBP ÷ ActualAttendees | 311.11 |
| AttendanceRatePct | Turnout compared with expectations | ActualAttendees ÷ ExpectedAttendees × 100 | 90.0 |

## 3. Data rules
- All money is in GBP (£). Values are stored as plain numbers, without £ signs or commas.
- Dates use the format YYYY-MM-DD.
- Percentages and money are rounded to 2 decimal places.
- If ActualAttendees is 0, CostPerAttendeeGBP is left blank, to avoid dividing by zero.
- If BudgetGBP is 0, VariancePct is left blank.
- Categories must be chosen from the list above, so spelling stays consistent.

## 4. Example row (as exported to CSV)

    EventID,EventName,Category,EventDate,BudgetGBP,ActualCostGBP,IncomeGBP,ExpectedAttendees,ActualAttendees,VarianceGBP,VariancePct,BudgetStatus,NetCostGBP,CostPerAttendeeGBP,AttendanceRatePct
    EVT-001,State Banquet,Catering,2026-11-12,50000,56000,0,200,180,6000,12.00,Over,56000,311.11,90.00
