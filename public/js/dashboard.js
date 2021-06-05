let expenses = [];
let expenses_month = [];

const els = {
  expensesEl: document.getElementById('expenses'),
  datalistCategory: document.getElementById('category_datalist'),
  btnAdd: document.querySelector('.btn-add'),
  selMonthPicker: document.getElementById('sel-choose-month'),
  expensesDesc: document.querySelector('.expenses-desc'),
  searchEl: document.querySelector('#search'),
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

const showExpenses = (expenses) => {
  if (expenses.length === 0) return;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  table.appendChild(thead);
  const tr = document.createElement('tr');
  thead.appendChild(tr);
  const th_date = document.createElement('th');
  th_date.textContent = 'Date';
  tr.appendChild(th_date);
  const th_desc = document.createElement('th');
  th_desc.textContent = 'Description';
  tr.appendChild(th_desc);
  const th_act = document.createElement('th');
  th_act.textContent = 'Account';
  th_act.classList.add('col-act');
  tr.appendChild(th_act);
  const th_cat = document.createElement('th');
  th_cat.textContent = 'Account';
  th_cat.classList.add('col-cat');
  tr.appendChild(th_cat);
  const th_amt = document.createElement('th');
  th_amt.textContent = 'Amount';
  tr.appendChild(th_amt);
  const th_btns = document.createElement('th');
  tr.appendChild(th_btns);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', expense._id);

    const td_date = document.createElement('td');
    td_date.textContent = formatDate(expense.date);
    tr.appendChild(td_date);

    const td_desc = document.createElement('td');
    td_desc.textContent = expense.desc;
    tr.appendChild(td_desc);

    const td_cat = document.createElement('td');
    td_cat.classList.add('col-cat');
    td_cat.textContent = expense.category;
    tr.appendChild(td_cat);

    const td_act = document.createElement('td');
    td_act.classList.add('col-act');
    td_act.textContent = expense.account_id.desc;
    tr.appendChild(td_act);

    const td_amt = document.createElement('td');
    td_amt.textContent = formatMoney(expense.amount);
    tr.appendChild(td_amt);

    const td_btn = document.createElement('td');
    td_btn.innerHTML = '<a class="btn-expense-edit">Edit</a><a class="btn-expense-del">X</a>';
    tr.appendChild(td_btn);

    tbody.appendChild(tr);
  }
  els.expensesEl.appendChild(table);
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
  els.expenseForm.amt.value = expense.amount.toFixed(2);
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
  els.expensesEl.innerHTML = '';
  // Show no expenses found message
  const div = document.createElement('div');
  div.classList.add('no-expenses');
  div.textContent = 'No expenses found.';
  els.expensesEl.appendChild(div);
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

const populateMonths = async () => {
  const monthsMap = getMonthsMap(await getExpenses());

  for (let year in monthsMap) {
    const months = monthsMap[year];
    months.forEach(month => {
      const monthString = getMonth(year, month).format('MMMM YYYY');
      const option = document.createElement('option');
      option.value = getMonthString(year, month);
      option.textContent = monthString;
      els.selMonthPicker.appendChild(option);
    })
  }

  // Set current month as active by default
  els.selMonthPicker.value = getMonthString();
  handleMonthChange();
}

const handleMonthChange = async () => {
  // Reset search
  els.searchEl.value = '';

  let selMonth = els.selMonthPicker.value;

  // If all, load expenses from all endpoint
  if (selMonth === 'all') {
    showExpenses(await getExpenses());
    return;
  }
  // else load expenses for that month
  expenses_month = await getExpensesByMonth(selMonth);
  showExpenses(expenses_month);
}

const handleSearch = (e) => {
  let s = e.target.value.toLowerCase();

  let filtered = expenses_month.filter(expense => {
    return expense.desc.toLowerCase().includes(s) ||
      expense.category.toLowerCase().includes(s) ||
      expense.account_id.desc.toLowerCase().includes(s)
  })
  if (filtered.length === 0) { return showNoExpenses() }
  showExpenses(filtered);
}

const addEventListeners = () => {
  els.selMonthPicker.addEventListener('change', handleMonthChange);
  els.searchEl.addEventListener('input', handleSearch);
}

const init = async () => {
  expenses = await getExpenses();
  if (expenses.length > 0) {
    addEventListeners();
    createCategoryDatalist();
    populateAccounts();
    populateMonths();
    return;
  }
  showNoExpenses();
}

init();
