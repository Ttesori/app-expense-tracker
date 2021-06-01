const els = {
  _id: document.getElementById('_id')
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

const init = async () => {
  const expenses = await getExpenses(els._id.value);
  console.log(expenses);
}

init();
