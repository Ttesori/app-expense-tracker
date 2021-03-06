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
  document.querySelector('.is-loading').remove();
}

const showPastReports = () => {
  const div = document.createElement('div');
  div.classList.add('no-reports');
  div.innerHTML = `
  <i class="fa fa-question-circle"></i>
  <h3>No reports available for current month.</h3>
  <p>Choose a month from the dropdown to view past reports.</p>
  `;
  els.reportsEl.appendChild(div);
  document.querySelector('.is-loading').remove();
  els.monthSwitcherEl.addEventListener('change', handleMonthChange);
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
  els.reportsEl.appendChild(buildReportSectionCategory(expenses, total));

  // build report section: by account
  els.reportsEl.appendChild(buildReportSectionAccount(expenses, total));

  els.reportsEl.appendChild(buildReportSectionTotals(total));

}

const buildReportSectionTotals = () => {
  const totalsSectionEl = document.createElement('section');
  const button = document.createElement('button');
  button.innerHTML = `<i class="fas fa-print"></i> Print Report`;
  button.className = 'btn-add btn-print';
  button.addEventListener('click', () => window.print())
  totalsSectionEl.appendChild(button);

  return totalsSectionEl;
}

const buildReportSectionCategory = (expenses, total) => {
  const section = document.createElement('section');
  section.className = 'report-section';
  const tableSection = document.createElement('div');
  tableSection.className = 'table-section';
  const h3 = document.createElement('h3');
  h3.textContent = 'Expenses By Category';
  h3.classList.add('et-section-header');
  tableSection.appendChild(h3);

  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('et-reports-table');
  const tbody = document.createElement('tbody');
  let categoriesMap = getCategoriesMap(expenses);
  categoriesMap.forEach(category => {
    const tr = createReportRow(category, total)
    tbody.appendChild(tr);
  });
  // Append total row
  const tr = createTotalRow(total);
  tbody.appendChild(tr);
  table.appendChild(tbody);

  tableSection.appendChild(table);
  section.appendChild(tableSection);

  createPieChart(section, categoriesMap, 'Expense Categories');

  return section;
}

const createTotalRow = (total) => {
  const tr = document.createElement('tr');
  tr.className = 'row-total';
  const th = document.createElement('th');
  th.textContent = 'Total';
  const td = document.createElement('td');
  td.textContent = formatMoney(total);

  tr.appendChild(th);
  tr.appendChild(td);

  return tr;
}

const createPieChart = (section, map, title) => {
  let amounts = [];
  let labels = [];
  map.length = 5;
  map.forEach(category => {
    amounts.push(category.amount);
    labels.push(category.name);
  });
  const canvas = document.createElement('canvas');
  const figure = document.createElement('figure');
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = `A pie chart showing ${title}. The same data is reflected in the preceeding table.`;
  figcaption.className = 'figcaption';
  canvas.className = 'chart';

  figure.appendChild(canvas);
  figure.appendChild(figcaption);
  section.appendChild(figure);


  const data = {
    labels: labels,
    datasets: [{
      label: title,
      data: amounts,
      backgroundColor: [
        'rgb(36, 84, 94)',
        'rgb(32, 204, 148)',
        'rgb(33, 250, 174)',
        'rgb(200, 200, 200)',
        'rgb(230, 230, 230)',
      ],
      hoverOffset: 4,
      borderWidth: 3
    }]
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: `Top 5 ${title}`,
        font: {
          size: 16,
          family: 'Roboto Slab'
        },
        color: 'rgb(36, 84, 94)'
      }
    }
  };
  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: data,
    options: options,
    responsive: true
  });

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
  const section = document.createElement('div');
  section.className = 'report-section';
  const tableSection = document.createElement('div');
  tableSection.className = 'table-section';
  const h3 = document.createElement('h3');
  h3.textContent = 'Expenses By Account';
  h3.classList.add('et-section-header');
  tableSection.appendChild(h3);

  const table = document.createElement('table');
  table.classList.add('table');
  table.classList.add('et-reports-table');
  const tbody = document.createElement('tbody');
  let accountsMap = getAccountsMap(expenses);
  accountsMap.forEach(account => {
    const tr = createReportRow(account, total);
    tbody.appendChild(tr)
  });
  const tr = createTotalRow(total);
  tbody.appendChild(tr);

  table.appendChild(tbody);
  tableSection.appendChild(table);
  section.appendChild(tableSection);

  createPieChart(section, accountsMap, 'Expense Accounts');

  return section;
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
      els.monthSwitcherEl.prepend(option);
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
  let expensesByMonth = await getExpenses();
  populateMonths(expensesByMonth);
  if (expenses.length === 0 && expensesByMonth.length > 0) return showPastReports();
  if (expensesByMonth.length === 0) return showNoReports();
  showReport(expenses, getMonthString());
  els.monthSwitcherEl.addEventListener('change', handleMonthChange);
}

init();