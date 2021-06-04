const els = {
  expensesEl: document.getElementById('expenses'),
  datalistCategory: document.getElementById('category_datalist'),
  btnAdd: document.querySelector('.btn-add'),
  selMonthPicker: document.getElementById('sel-choose-month'),
  expensesDesc: document.querySelector('.expenses-desc'),
  expenseForm: {
    modalEl: document.getElementById('add-modal'),
    modal: new bootstrap.Modal(document.getElementById('add-modal')),
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
  return data;
}

const getAccounts = async () => {
  const data = await fetchRequest(`/accounts`);
  return data;
}

const getExpensesByMonth = async (month) => {
  const data = await fetchRequest(`/expenses?month=${month}`);
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
  els.expenseForm.modal.show();

  els.expenseForm.modalEl.addEventListener('hide.bs.modal', resetExpenseForm);

}

const resetExpenseForm = () => {
  els.expenseForm.title.textContent = 'Add Expense';
  els.expenseForm.btnSubmit.textContent = 'Add Expense';
  els.expenseForm.form.setAttribute('action', '/expenses');
  els.expenseForm.date.value = '';
  els.expenseForm.desc.value = '';
  els.expenseForm.amt.value = '';
  els.expenseForm.category.value = '';
  els.expenseForm.account.removeAttribute('value');
  els.expenseForm.id.value = '';
}

const formatDate = (date) => {
  const initDate = dayjs(new Date(date).toISOString());
  return `${initDate.format('M/DD/YYYY')}`;
}

const formatMoney = (num, symbol = '$') => {
  return `${symbol}${num.toFixed(2).toLocaleString()}`;
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
  // Show no expenses found message
  const div = document.createElement('div');
  div.classList.add('no-expenses');
  div.textContent = 'Add expenses below for them to show up here.'
  els.expensesEl.appendChild(div);
}

const showErrors = () => {

}

const populateAccounts = async () => {
  let accounts = await getAccounts();
  accounts.forEach(account => {
    const option = document.createElement('option');
    option.value = account._id;
    option.textContent = account.desc;
    els.expenseForm.account.appendChild(option);
  })
}

const populateMonths = () => {
  const monthsMap = getMonthsMap();

  for (let year in monthsMap) {
    const months = monthsMap[year];
    months.forEach(month => {
      const monthString = getMonthString(year, month).format('MMMM YYYY');
      const option = document.createElement('option');
      option.value = getMonthString(year, month);
      option.textContent = monthString;
      els.selMonthPicker.appendChild(option);
    })
  }
}

const getMonthString = (year = dayjs().year(), month = dayjs().month() + 1) => {
  return dayjs(`${year}-${month.toString().padStart(2, '0')}-01`);
}

const getMonthsMap = () => {
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
  console.log(monthsMap)
  return monthsMap;
}

const handleMonthChange = async () => {
  let selMonth = els.selMonthPicker.value;

  // If all, load expenses from all endpoint
  if (selMonth === 'all') {
    showExpenses(await getExpenses());
    return;
  }
  // else load expenses for that month
  showExpenses(await getExpensesByMonth(selMonth));
}

const addEventListeners = () => {
  els.selMonthPicker.addEventListener('change', handleMonthChange);
}

const init = async () => {
  expenses = await getExpenses();
  if (expenses.length === 0) return showNoExpenses();
  addEventListeners();
  createCategoryDatalist();
  populateAccounts();
  populateMonths();

  let currMonth = getMonthString();
  els.selMonthPicker.value = currMonth;
  handleMonthChange();
}

init();
