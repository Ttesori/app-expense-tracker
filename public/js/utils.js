const fetchRequest = async (uri, payload) => {
  if (!payload) {
    let resp = await fetch(uri);
    return await resp.json()
  }
  let resp = await fetch(uri, payload);
  return await resp.status;
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
  const intFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  //const intFmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  return intFmt.format(num);
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