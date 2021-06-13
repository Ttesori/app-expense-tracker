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

const showAccounts = (accounts) => {
  if (accounts.length === 0) return;

  els.accountsEl.innerHTML = '';
  const ul = document.createElement('ul');
  ul.classList.add('et-accounts-list')
  for (let account_id in accounts) {
    const account = accounts[account_id];
    const li = document.createElement('li');
    li.classList.add('et-accounts-item');
    li.setAttribute('data-id', account._id);
    li.innerHTML = `
    <span class="act-desc">${account.desc}
    <span class="act-count badge bg-${account.count > 0 ? 'primary' : 'secondary'}" title="Number of expenses">${account.count} ${account.count === 1 ? 'expense' : 'expenses'}</span>
    </span>
    <span class="act-btns" data-id="${account._id}">
    <a class="btn-account-edit" title="Edit Account" >
    <i class="fa fa-edit"></i></a>
    ${account.count === 0 ? `
    <a class="btn-account-del" title="Delete Account">
    <i class="fa fa-times"></i></a>
    ` : ''}
    </span>
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
  const btnId = e.target.parentNode.parentNode.dataset.id;

  // Get expense from array with that ID
  const account = accounts.find(account => account._id === btnId);
  // fill in form with data
  fillInEditForm(account);
}

const handleDelete = (e) => {
  const btnId = e.target.parentNode.parentNode.dataset.id;

  // send delete request with that ID
  let answer = confirm('Are you sure you want to remove this account?')
  if (answer) {
    deleteAccount(btnId);
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
    return window.location = '/tracker/accounts?update=1'
  }
}

const deleteAccount = async (btnId) => {
  let resp = await fetchRequest('/accounts', 'DELETE',
    {
      id: btnId
    });
  if (resp.status === 200) {
    return window.location = '/tracker/accounts?delete=1'
  }
}

const showNoAccounts = () => {
  // Show no expenses found message
  const div = document.createElement('div');
  div.classList.add('no-expenses');
  div.textContent = 'Add accounts below for them to show up here.';
  els.accountsEl.appendChild(div);
}

const parseQuery = () => {
  if (window.location.search.length === 0) return;
  const params = new URLSearchParams(window.location.search);

  if (params.get('add')) {
    if (params.get('add') == 1) {
      showAlert('success', 'Account added successfully!', els.accountsEl);
    }
  } else if (params.get('update')) {
    showAlert('success', 'Account updated successfully!', els.accountsEl);
  } else if (params.get('delete')) {
    showAlert('success', 'Account removed successfully!', els.accountsEl);
  }
}

const init = async () => {
  accounts = await getAccounts();
  if (accounts.length === 0) return showNoAccounts();
  showAccounts(accounts);
  parseQuery();
}

init();

