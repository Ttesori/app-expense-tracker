const els = {
  reportsEl: document.querySelector('.report-container'),
  reportTitleEl: document.querySelector('.report-title'),
  monthSwitcherEl: document.querySelector('#month-switcher'),
}

const showNoReports = () => {
  const div = document.createElement('div');
  div.classList.add('no-reports');
  div.textContent = 'No reports available'
  els.reportsEl.appendChild(div);
}

const showReport = (expenses, month) => {
  // CLear prev report
  els.reportsEl.innerHTML = '';
  els.monthSwitcherEl.value = month;

  // get total spent for month
  const total = expenses.reduce((count, expense) => count + expense.amount, 0);

  // build report section: by category
  buildReportSectionCategory(expenses, total);

  // build report section: by account
  buildReportSectionAccount(expenses, total);

  // totals
  const total_fmt = formatMoney(total);
  const h3 = document.createElement('h3');
  h3.textContent = `Total Expenses: ${total_fmt}`;
  els.reportsEl.appendChild(h3);
}

const buildReportSectionCategory = (expenses, total) => {
  const h3 = document.createElement('h3');
  h3.textContent = 'Expenses By Category';
  els.reportsEl.appendChild(h3);

  const ul = document.createElement('ul');
  let categoriesMap = getCategoriesMap(expenses);
  categoriesMap.forEach(category => {
    const li = document.createElement('li');
    li.textContent = `${category.name}: ${formatMoney(category.amount)} (${formatPercent(category.amount, total)})`;
    ul.appendChild(li);
  })
  els.reportsEl.appendChild(ul);
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
  els.reportsEl.appendChild(h3);

  const ul = document.createElement('ul');
  let accountsMap = getAccountsMap(expenses);
  accountsMap.forEach(account => {
    const li = document.createElement('li');
    li.textContent = `${account.name}: 
    ${formatMoney(account.amount)} 
    (${formatPercent(account.amount, total)})`;
    ul.appendChild(li)
  });
  els.reportsEl.appendChild(ul);
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