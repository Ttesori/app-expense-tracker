let accounts;
const els = {
  accountsEl: document.getElementById('accounts'),
  txtAccountNameEl: document.querySelector('.txt-account_desc'),
  hiddenIdEl: document.querySelector('.hidden-id'),
  editForm: {
    modalEl: document.getElementById('add-modal'),
    modal: new bootstrap.Modal(document.getElementById('add-modal')),
    formEl: document.querySelector('#accounts-form'),
    title: document.querySelector('.accounts-form-title'),
    btn: document.querySelector('.btn-accounts_submit'),
  }
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

const getAccounts = async () => {
  const data = await fetchRequest(`/accounts/count`);
  accounts = data;
  console.log(accounts);
  return data;
}

const showAccounts = (accounts) => {
  if (accounts.length === 0) return;

  els.accountsEl.innerHTML = '';
  const ul = document.createElement('ul');
  for (let account_id in accounts) {
    const account = accounts[account_id];
    const li = document.createElement('li');
    li.setAttribute('data-id', account._id);
    li.innerHTML = `
    ${account.desc}
    (${account.count})
    <button class="btn-account-edit">Edit</button>
    ${account.count === 0 ? '<button class="btn-account-del">X</button>' : ''}
    `;
    ul.appendChild(li);
  }
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

const handleDelete = (e) => {
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
  els.editForm.title.textContent = 'Edit Account';
  els.editForm.btn.textContent = 'Edit Account';
  els.editForm.btn.addEventListener('click', sendEdits);
  els.editForm.modal.show();
  els.editForm.modalEl.addEventListener('hide.bs.modal', function (e) {
    els.editForm.title.textContent = 'Add Account';
    els.editForm.btn.textContent = 'Add Account';
    els.txtAccountNameEl.value = '';
    els.editForm.btn.removeEventListener('click', sendEdits);
  });
}

const sendEdits = async (e) => {
  // Check to see if value has changed, if it hasn't do not send update
  e.preventDefault();
  let resp = await fetchRequest('/accounts',
    'PUT', {
    _id: els.hiddenIdEl.value,
    desc: els.txtAccountNameEl.value,
  });
  if (resp.status === 200) {
    return location.reload();
  }
  console.log(resp)
}

const deleteExpense = async (btnId) => {
  let resp = await fetchRequest('/accounts', 'DELETE',
    {
      id: btnId
    });
  if (resp.status === 200) {
    return location.reload();
  }
  console.log(resp);
}

const showNoAccounts = () => {
  // Show no expenses found message
  const div = document.createElement('div');
  div.classList.add('no-expenses');
  div.textContent = 'Add accounts below for them to show up here.';
  els.accountsEl.appendChild(div);
}


const init = async () => {
  const accounts = await getAccounts();
  if (accounts.length === 0) return showNoAccounts();
  showAccounts(accounts);
}

init();

