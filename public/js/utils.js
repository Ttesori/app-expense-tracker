const dateFormat = {
  1: 'M/D/YY',
  2: 'D/M/YY'
}

const fetchRequest = async (uri, method, body) => {
  if (!method) {
    let resp = await fetch(uri);
    return await resp.json()
  }
  let resp = await fetch(uri, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await resp;
}

const getExpenses = async () => {
  const data = await fetchRequest(`/expenses`);
  return data;
}

const getAccounts = async () => {
  const data = await fetchRequest(`/accounts/count`);
  return data;
}

const getExpensesByMonth = async (month = getMonthString()) => {
  const data = await fetchRequest(`/expenses?month=${month}`);
  return data;
}

const formatDate = (date) => {
  const initDate = dayjs(new Date(date).toISOString());
  return `${initDate.format('M/DD/YYYY')}`;
}

const formatMoney = (num) => {
  const currencyMap = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP'
  }
  const currKey = (etUserSettings !== undefined) ? etUserSettings.currencySymbol : 1;
  const currency = currencyMap[currKey];

  num = num.toFixed(2);
  let intFmt;
  if (etUserSettings.numberFormat === 1) {
    intFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency });
    return intFmt.format(num).toString();
  }
  intFmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency });
  return intFmt.format(num).toString();
}

const formatPercent = (num, total) => {
  return parseInt((num / total) * 100) + '%';
}

const getMonthString = (year = dayjs().year(), month = dayjs().month() + 1) => {
  return dayjs(`${year}-${month.toString().padStart(2, '0')}-01`).format('YYYY-MM-DD');
}

const getMonth = (year = dayjs().year(), month = dayjs().month() + 1) => {
  return dayjs(`${year}-${month.toString().padStart(2, '0')}-01`);
}

const getMonthsMap = (expenses) => {
  let monthsMap = {};

  expenses.forEach(expense => {
    let date = dayjs(expense.date);
    let month = date.month();
    let year = date.year();

    if (year in monthsMap) {
      if (monthsMap[year].indexOf(month + 1) === -1) {
        monthsMap[year].push(month + 1);
      }
    } else {
      monthsMap[year] = [];
      monthsMap[year].push(month + 1);
    }
  });
  return monthsMap;
}

const handleToggler = (e) => {

  const toOpen = e.target.classList.contains('fa-bars');
  const menuEl = document.querySelector('.et-nav');

  if (toOpen) {
    // change icon
    menuToggler.innerHTML = '<i class="fa fa-times"></i>';
    // remove hide class
    menuEl.classList.remove('hide');
    menuToggler.classList.add('open');
    e.preventDefault();
    return;
  }

  // close menu
  menuToggler.innerHTML = '<i class="fa fa-bars"></i>';
  menuToggler.classList.remove('open');
  menuEl.classList.add('hide');
  // Change hamburger to close


  // remove hide_menu class

  //
}

const menuToggler = document.querySelector('.et-menu-toggle');
menuToggler.addEventListener('click', handleToggler);



