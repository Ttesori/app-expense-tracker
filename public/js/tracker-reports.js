const els = {
  reportsEl: document.querySelector('.report-container'),
  reportTitleEl: document.querySelector('.report-title'),
  reportMonthEl: document.querySelector('.et-report-month'),
  monthSwitcherEl: document.querySelector('#month-switcher'),
}

const showNoReports = () => {
  els.monthSwitcherEl.classList.add('hide');
  const div = document.createElement('div');
  div.classList.add('no-reports');
  div.innerHTML = `
  <i class="fa fa-question-circle"></i>
  <h3>No reports available.</h3>
  <p>Add expenses to generate reports.</p>
  `;
  els.reportsEl.appendChild(div);
}

const showReport = (expenses, month) => {
  // CLear prev report
  els.reportsEl.innerHTML = '';
  els.monthSwitcherEl.classList.remove('hide');
  els.monthSwitcherEl.value = '#';

  // Add report title
  els.reportMonthEl.textContent = dayjs(month).format('MMMM YYYY');

  // get total spent for month
  const total = expenses.reduce((count, expense) => count + expense.amount, 0);

  // build report section: by category
  buildReportSectionCategory(expenses, total);

  // build report section: by account
  buildReportSectionAccount(expenses, total);

  // totals
  const total_fmt = formatMoney(total);
  const h3 = document.createElement('h3');
  h3.classList.add('et-section-header')
  h3.textContent = `Total Expenses: ${total_fmt}`;
  els.reportsEl.appendChild(h3);

  // Add print button
  els.reportsEl.appendChild(document.createElement('hr'));
  const button = document.createElement('button');
  button.innerHTML = `<i class="fas fa-print"></i> Print Report`;
  button.className = 'btn-add btn-print';
  button.addEventListener('click', () => window.print())
  els.reportsEl.appendChild(button);
}

const buildReportSectionCategory = (expenses, total) => {
  const h3 = document.createElement('h3');
  h3.textContent = 'Expenses By Category';
  h3.classList.add('et-section-header');
  els.reportsEl.appendChild(h3);

  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('et-reports-table');
  const tbody = document.createElement('tbody');
  let categoriesMap = getCategoriesMap(expenses);
  categoriesMap.forEach(category => {
    const tr = createReportRow(category, total)
    tbody.appendChild(tr);
  })
  table.appendChild(tbody);
  els.reportsEl.appendChild(table);
}

const createReportRow = (data, total) => {
  const tr = document.createElement('tr');
  const td_name = document.createElement('td')
  td_name.textContent = data.name;
  td_name.classList.add('col_name');
  tr.appendChild(td_name);
  const td_amt = document.createElement('td');
  td_amt.textContent = formatMoney(data.amount);
  td_amt.classList.add('col_amt');
  tr.appendChild(td_amt);
  const td_per = document.createElement('td');
  td_per.classList.add('col_per');
  const span_per = document.createElement('span');
  span_per.textContent = formatPercent(data.amount, total);
  span_per.classList.add('et-report-percentage');
  td_per.appendChild(span_per);

  const span_bar = document.createElement('span');
  span_bar.classList.add('et-report-percentage-bar');
  span_bar.style.width = formatPercent(data.amount, total);
  td_per.appendChild(span_bar);
  tr.appendChild(td_per);
  return tr;
}

const getCategoriesMap = (expenses) => {
  let categories = expenses.map(expense => expense.category);
  let distinctCategories = Array.from(new Set(categories));
  let categoriesMap = [];
  distinctCategories.forEach(category => {
    // sum the total of all expenses in that category
    let expensesSum = expenses.filter(expense => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
    categoriesMap.push({
      name: category,
      amount: expensesSum
    })
  });
  categoriesMap.sort((a, b) => b.amount - a.amount);
  return categoriesMap;
}

const buildReportSectionAccount = (expenses, total) => {
  const h3 = document.createElement('h3');
  h3.textContent = 'Expenses By Account';
  h3.classList.add('et-section-header');
  els.reportsEl.appendChild(h3);

  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('et-reports-table');
  const tbody = document.createElement('tbody');
  let accountsMap = getAccountsMap(expenses);
  accountsMap.forEach(account => {
    const tr = createReportRow(account, total);
    tbody.appendChild(tr)
  });
  table.appendChild(tbody);
  els.reportsEl.appendChild(table);
}

const getAccountsMap = (expenses) => {
  let account = expenses.map(expense => expense.account_id.desc);
  let distinctAccounts = Array.from(new Set(account));
  let accountsMap = [];
  distinctAccounts.forEach(account => {
    // sum the total of all expenses in that category
    let expensesSum = expenses.filter(expense => expense.account_id.desc === account).reduce((sum, expense) => sum + expense.amount, 0);
    accountsMap.push({
      name: account,
      amount: expensesSum
    })
  });
  accountsMap.sort((a, b) => b.amount - a.amount);
  return accountsMap;
}

const populateMonths = (expenses) => {
  let monthsMap = getMonthsMap(expenses);

  for (let year in monthsMap) {
    const months = monthsMap[year];
    months.forEach(month => {
      const monthString = getMonth(year, month).format('MMMM YYYY');
      const option = document.createElement('option');
      option.value = getMonthString(year, month);
      option.textContent = monthString;
      els.monthSwitcherEl.appendChild(option);
    })
  }
}

const handleMonthChange = async () => {
  let selMonth = els.monthSwitcherEl.value;
  if (selMonth === '#') return;

  showReport(await getExpensesByMonth(selMonth), getMonthString(selMonth));
}

const init = async () => {
  let expenses = await getExpensesByMonth();
  populateMonths(await getExpenses());
  if (expenses.length === 0) return showNoReports();
  showReport(expenses, getMonthString());
  els.monthSwitcherEl.addEventListener('change', handleMonthChange)
}

init();