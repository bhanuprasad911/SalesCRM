# 🚀 CanovaCRM

**CanovaCRM** is a CRM (Customer Relationship Management) system built using the **MERN stack** that allows businesses to manage leads and employees efficiently. It features lead assignment logic, employee performance tracking, activity logs, and automated scheduling—all through a clean, role-based interface for admins and employees.

---

## 🛠 Tech Stack

- ⚛️ Frontend: React.js
- 🌐 Backend: Node.js + Express.js
- 🗃️ Database: MongoDB

---

## 🌐 Live Demo Links

> Replace the below placeholders with actual deployment links.

- 🔑 **Admin Panel:** [Admin Link](#)
- 👤 **Employee Panel:** [Employee Link](#)

---

## 🔐 Login Credentials

### 👨‍💼 Admin

- **Email:** `abcd@gmail.com`
- **Password:** `ABCD`

### 👷‍♂️ Employee (Default)

- **Email:** `bhanu1@gmail.com`
- **Password:** `prasad`

---

## 🧑‍💼 Admin Features

### 🔐 Login

- Admins log in using email and password.
- After login, redirected to the **Dashboard**.

### 📊 Dashboard

- See analytics like:
  - Total unassigned leads
  - Active employees
  - Conversion rate
- Line graph showing leads closed in the past 10 days.
- List of active employees with live status and counts.
- Admin's recent activity history.

### 📁 Leads Page

- View uploaded lead files:
  - Filename, total leads, assigned, closed, upload date
- Upload new leads using `.csv` files.
- Basic validation on upload.
- **Lead Assignment Strategy:**
  1. Match both `location` and `language`
  2. Match either `location` or `language`
  3. Remaining leads are distributed one-by-one starting from the employee with the **least number** of assigned leads.

#### 📄 Sample `leads.csv`

```csv
name,email,phone,location,language,source,NextAvailable,AssignedTo
Keith Elliott,lynn67@hotmail.com,0195501318,Pune,English,Referral,2025-07-03T17:22:31,
Taylor Joyce,mlambert@gmail.com,4802227080,Pune,Tamil,Referral,2025-07-07T14:22:51,
Robin Miller,james45@erickson.info,7820928051,Hyderabad,Bengali,Cold call,2025-07-06T07:30:46,
Kelly Mckinney,dingram@miller.com,6959756851,Hyderabad,Hindi,Cold call,2025-07-05T15:09:58,
Alicia Blackwell,gutierrezbryan@robles-buck.org,5160759944,Hyderabad,Hindi,Cold call,2025-07-05T14:36:11,
Robert Lee,howarddavid@yahoo.com,2690578771,Delhi,Tamil,Cold call,2025-07-13T00:17:48,
Tammy Johnson,cookstephanie@donaldson-moore.net,0065282222,Hyderabad,Bengali,Cold call,2025-07-03T16:55:35,
Dr. Michael Williams,mark35@martin.info,9269029062,Pune,Bengali,Referral,2025-07-07T08:09:18,
Amanda Waters,kimberlynunez@french-barnes.org,3258386126,Hyderabad,Tamil,Referral,2025-07-08T15:40:32,
Danielle James,deannasanders@hotmail.com,4485809973,Delhi,Tamil,Cold call,2025-07-07T07:38:39,
```

### 👥 Employee Management

- View list of all employees: name, email, ID, status, assigned/closed leads.
- Add, edit, or delete employees.
- Search and sort employees by any field.

### ⚙️ Settings

- View and update admin details and password.

### 🔓 Logout

- Admin is auto-logged out:
  - On browser **tab close**
  - After **1 hour** of inactivity

---

## 👨‍💻 Employee Features

### 🔐 Login

- Employees use their registered email.
- Default password is their **last name**.

### 🏠 Homepage

- Displays check-in and check-out times.
- Break time is calculated as the time between checkout and the next check-in.
  - If a break spans multiple days, it is split between the days.
- Shows recent activities.

### 📋 Leads Page

- View all assigned leads.
- Search by name, email, phone, or status.
- Filter leads by status (Open/Closed).
- Update lead details:
  - Status (`Open` → `Closed`)
  - Lead type
  - Next availability date
- Once closed, a lead cannot be reopened.

### 📅 Schedule Page

- View leads scheduled for follow-up.
- Filter by `NextAvailable` = **today**
- Search leads by any field.

### 🙍‍♂️ Profile Page

- View and update employee profile details.

### 🔓 Logout

- Manual logout via a button near the check-in/out panel.
- Auto logout after **5 minutes** of inactivity.
- 🚫 Logout on tab close is not implemented because it involves critical database updates like setting `breakStartTime` and `checkedOutTime`.  
  Browser tab-close events are unreliable and don't support async operations needed for DB consistency.  
  To ensure accurate tracking, logout is handled manually or via inactivity-based auto logout.

---

## ✅ Summary

CanovaCRM is a robust, modular, and role-based CRM system that simplifies lead management, employee productivity monitoring, and customer follow-up scheduling. It handles smart lead assignment and real-time data analytics, offering a practical solution for growing businesses.
