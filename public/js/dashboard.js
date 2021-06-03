const els = {
  expensesEl: document.getElementById('expenses'),
  btnShowAll: document.getElementById('btn-show-all'),
  btnShowMonth: document.getElementById('btn-show-month'),
  datalistCategory: document.getElementById('category_datalist'),
  expenseForm: {
    form: document.getElementById('expenses-form'),
    title: document.querySelector('.expenses-form-title'),
    date: document.querySelector('.date-expense_date'),
    desc: document.querySelector('.txt-expense_desc'),
    amt: document.querySelector('.number-expense_amt'),
    category: document.querySelector('.txt-expense_category'),
    account: document.querySelector('.txt-expense_acc'),
    btnSubmit: document.querySelector('.btn-expenses_submit'),
    id: document.querySelector('.hidden-id')
  }
}

let expenses = [];

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
  console.log(data);
  return data;
}

const getAccounts = async () => {
  const data = await fetchRequest(`/accounts`);
  console.log(data);
  return data;
}

const getExpensesByMonth = async (month) => {
  const data = await fetchRequest(`/expenses?month=2021-${month.toString().padStart(2, '0')}`);
  console.log(data);
  return data;
}

const showExpenses = (expenses) => {
  if (expenses.length === 0) return;

  els.expensesEl.innerHTML = '';
  const ul = document.createElement('ul');
  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.setAttribute('data-id', expense._id);
    li.innerHTML = `
    ${formatDate(expense.date)} -
    ${expense.desc} -
    ${formatMoney(expense.amount)} -
    ${expense.account_id.desc} -
    ${expense.category}
    <button class="btn-expense-edit">Edit</button>
    <button class="btn-expense-del">X</button>
    `;
    ul.appendChild(li);
  });
  els.expensesEl.appendChild(ul);
  addEditEventListeners();
  addDeleteEventListeners();
}

const addEditEventListeners = () => {
  let editButtons = document.querySelectorAll('.btn-expense-edit');
  editButtons.forEach(button => button.addEventListener('click', handleEditExpense));
}

const addDeleteEventListeners = () => {
  let delButtons = document.querySelectorAll('.btn-expense-del');
  delButtons.forEach(button => button.addEventListener('click', handleDeleteExpense));
}

const handleEditExpense = (e) => {
  const btnId = e.path[1].dataset.id;
  // Get expense from array with that ID
  const expense = expenses.find(expense => expense._id === btnId);
  // fill in form with data
  fillInEditForm(expense);
}

const handleDeleteExpense = (e) => {
  const btnId = e.path[1].dataset.id;

  // send delete request with that ID
  let answer = confirm('Are you sure you want to remove this expense?')
  if (answer) {
    deleteExpense(btnId);
  }

}

const deleteExpense = async (id) => {
  console.log('Deleting expense', id);
  let body = {
    id: id
  };
  let resp = await fetchRequest('/expenses', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (resp === 200) {
    expenses = await getExpenses();
    if (expenses.length > 0) return showExpenses(expenses);
  }
}

const fillInEditForm = (expense) => {
  // Set values of form fields
  els.expenseForm.date.value = dayjs(expense.date).format('YYYY-MM-DD');
  els.expenseForm.desc.value = expense.desc;
  els.expenseForm.amt.value = expense.amount;
  els.expenseForm.category.value = expense.category;
  els.expenseForm.account.value = expense.account_id._id;
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

const createCategoryDatalist = () => {
  let categories = expenses.reduce((categoriesMap, expense) => {
    if (categoriesMap.indexOf(expense.category) === -1) {
      return [...categoriesMap, expense.category]
    }
    return categoriesMap;
  }, []);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    els.datalistCategory.appendChild(option);
  })
}

const showNoExpenses = () => {
  // Hide buttons
  // Show no expenses found message
}

const showErrors = () => {

}

const populateAccounts = async () => {
  let accounts = await getAccounts();

  //if (accounts.length === 0) accounts = ['Cash', 'Credit Card'];
  console.log(accounts);
  accounts.forEach(account => {
    console.log(account);
    const option = document.createElement('option');
    option.value = account._id;
    option.textContent = account.desc;
    els.expenseForm.account.appendChild(option);
  })
}

const init = async () => {
  expenses = await getExpenses();
  els.btnShowAll.addEventListener('click', handleSwitchView);
  els.btnShowMonth.addEventListener('click', handleSwitchView);
  createCategoryDatalist();
  populateAccounts();
  if (expenses.length > 0) return showExpenses(expenses);
  els.btnShowAll.classList.add('hide');

}

init();
