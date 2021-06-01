const els = {
  _id: document.getElementById('_id'),
  expensesEl: document.getElementById('expenses')
}

const fetchRequest = async (uri, method = 'GET', payload) => {
  if (method === 'GET') {
    let resp = await fetch(uri);
    return await resp.json()
  }
}
const getExpenses = async (id) => {
  const data = await fetchRequest(`/expenses?uid=${id}`);
  return data;
}

const showExpenses = (expenses) => {
  const ul = document.createElement('ul');
  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.innerHTML = `
    ${formatDate(expense.date)} -
    ${expense.desc} -
    ${expense.amount} -
    ${expense.category}
    `;
    ul.appendChild(li);
  });
  els.expensesEl.appendChild(ul);
}

const formatDate = (date) => {
  const initDate = new Date(date);
  return `
  ${initDate.getMonth() + 1}-${initDate.getDate()}-${initDate.getUTCFullYear()}
  `;
}

const init = async () => {
  const expenses = await getExpenses(els._id.value);
  showExpenses(expenses);
}

init();
