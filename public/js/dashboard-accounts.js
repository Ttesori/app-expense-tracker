let accounts;
const els = {
  accountsEl: document.getElementById('accounts'),
  txtAccountNameEl: document.querySelector('.txt-account_desc'),
  hiddenIdEl: document.querySelector('.hidden-id')
}


const fetchRequest = async (uri, payload) => {
  if (!payload) {
    let resp = await fetch(uri);
    return await resp.json()
  }
  let resp = await fetch(uri, payload);
  return await resp.status;
}

const getAccounts = async () => {
  const data = await fetchRequest(`/accounts`);
  accounts = data;
  return data;
}

const showAccounts = (accounts) => {
  if (accounts.length === 0) return;

  els.accountsEl.innerHTML = '';
  const ul = document.createElement('ul');
  accounts.forEach(account => {
    const li = document.createElement('li');
    li.setAttribute('data-id', account._id);
    li.innerHTML = `
    ${account.desc}
    <button class="btn-account-edit">Edit</button>
    <button class="btn-account-del">X</button>
    `;
    ul.appendChild(li);
  });
  els.accountsEl.appendChild(ul);
  addEditEventListeners();
  addDeleteEventListeners();
}

const addEditEventListeners = () => {
  let editButtons = document.querySelectorAll('.btn-account-edit');
  editButtons.forEach(button => button.addEventListener('click', handleEdit));
}

const addDeleteEventListeners = () => {
  let delButtons = document.querySelectorAll('.btn-account-del');
  delButtons.forEach(button => button.addEventListener('click', handleDelete));
}

const handleEdit = (e) => {
  const btnId = e.path[1].dataset.id;
  // Get expense from array with that ID
  const account = accounts.find(account => account._id === btnId);
  // fill in form with data
  fillInEditForm(account);
}

const handleDelete = () => {
  const btnId = e.path[1].dataset.id;

  // send delete request with that ID
  let answer = confirm('Are you sure you want to remove this account?')
  if (answer) {
    deleteExpense(btnId);
  }
}

const fillInEditForm = (account) => {
  els.txtAccountNameEl.value = account.desc;
  els.hiddenIdEl.value = account._id;
}

const init = async () => {
  showAccounts(await getAccounts());
}

init();

