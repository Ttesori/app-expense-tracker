let expenses;

const els = {
  reportsEl: document.querySelector('.report-container')
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

const getExpensesByMonth = async (month = dayjs().month()) => {
  const data = await fetchRequest(`/expenses?month=2021-${month.toString().padStart(2, '0')}`);
  return data;
}

const showNoReports = () => {
  const div = document.createElement('div');
  div.classList.add('no-reports');
  div.textContent = 'No reports available'
  els.reportsEl.appendChild(div);
}

const init = async () => {
  expenses = await getExpensesByMonth();
  if (expenses.length === 0) showNoReports();
  console.log(expenses);
}

init();