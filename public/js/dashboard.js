const els = {
  expensesEl: document.getElementById('expenses'),
  btnShowAll: document.getElementById('btn-show-all'),
  btnShowMonth: document.getElementById('btn-show-month'),
  expenseForm: {
    form: document.getElementById('expenses-form'),
    title: document.querySelector('.expenses-form-title'),
    date: document.querySelector('.date-expense_date'),
    desc: document.querySelector('.txt-expense_desc'),
    amt: document.querySelector('.number-expense_amt'),
    category: document.querySelector('.txt-expense_category'),
    btnSubmit: document.querySelector('.btn-expenses_submit'),
    id: document.querySelector('.hidden-id')
  }
}

let expenses = [];

const fetchRequest = async (uri, method = 'GET', payload) => {
  if (method === 'GET') {
    let resp = await fetch(uri);
    return await resp.json()
  }
}
const getExpenses = async () => {
  const data = await fetchRequest(`/expenses`);
  console.log(data);
  return data;
}

const getExpensesByMonth = async (month) => {
  const data = await fetchRequest(`/expenses?month=2021-${month.toString().padStart(2, '0')}`);
  console.log(data);
  return data;
}

const showExpenses = (expenses) => {
  els.expensesEl.innerHTML = '';
  const ul = document.createElement('ul');
  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.setAttribute('data-id', expense._id);
    li.innerHTML = `
    ${formatDate(expense.date)} -
    ${expense.desc} -
    ${formatMoney(expense.amount)} -
    ${expense.category}
    <button class="btn-expense-edit">Edit</button>
    `;
    ul.appendChild(li);
  });
  els.expensesEl.appendChild(ul);
  addEditEventListeners();
}

const addEditEventListeners = () => {
  let editButtons = document.querySelectorAll('.btn-expense-edit');
  editButtons.forEach(button => button.addEventListener('click', handleEditExpense));
}

const handleEditExpense = (e) => {
  const btnId = e.path[1].dataset.id;
  // Get expense from array with that ID
  const expense = expenses.find(expense => expense._id === btnId);
  // fill in form with data
  fillInEditForm(expense);
}

const fillInEditForm = (expense) => {
  // Set values of form fields
  els.expenseForm.date.value = dayjs(expense.date).format('YYYY-MM-DD');
  els.expenseForm.desc.value = expense.desc;
  els.expenseForm.amt.value = expense.amount;
  els.expenseForm.category.value = expense.category;
  els.expenseForm.id.value = expense._id;
  els.expenseForm.form.setAttribute('action', '/expenses?_method=PUT');

  // Update card title
  els.expenseForm.title.textContent = 'Update Expense';

  // Update button text
  els.expenseForm.btnSubmit.textContent = 'Update Expense';
}

const formatDate = (date) => {
  const initDate = dayjs(new Date(date).toISOString());
  return `${initDate.format('M/DD/YYYY')}`;
}

const formatMoney = (num, symbol = '$') => {
  return `${symbol}${num.toFixed(2).toLocaleString()}`;
}

const handleSwitchView = async (e) => {
  const target = e.target.id;
  if (target === 'btn-show-all') {
    expenses = await getExpenses();
  } else {
    let month = (new Date().getUTCMonth()) + 1;
    expenses = await getExpensesByMonth(month);
  }
  if (expenses.length > 0) return showExpenses(expenses);

  els.btnShowAll.classList.add('hide');
  els.btnShowMonth.classList.add('hide');
}

const init = async () => {
  expenses = await getExpenses();
  els.btnShowAll.addEventListener('click', handleSwitchView);
  els.btnShowMonth.addEventListener('click', handleSwitchView);

  if (expenses.length > 0) return showExpenses(expenses);
  els.btnShowAll.classList.add('hide');
}

init();
