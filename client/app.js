App = {
  contracts: {},

  init: async () => {
    await App.loadWallet();
    await App.loadContracts();
    await App.loadAccount();
    App.render();
    await App.renderTask();
  },

  loadWallet: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Please, Install EVM Compatible Wallet");
    }
  },

  loadAccount: async () => {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = account[0];
  },

  loadContracts: async () => {
    const res = await fetch("TaskContract.json");
    const taskContractJSON = await res.json();

    App.contracts.taskContract = TruffleContract(taskContractJSON);

    App.contracts.taskContract.setProvider(App.web3Provider);

    App.taskContract = await App.contracts.taskContract.deployed();
  },

  render: async () => {
    document.getElementById("account").innerText = App.account;
  },

  renderTask: async () => {
    const tasks = await App.taskContract.taskCounter();
    const taskCounter = tasks.toNumber();

    let html = "";

    for (let i = 1; i <= taskCounter; i++) {
      const task = await App.taskContract.tasks(i);

      const taskId = task[0];
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreated = task[4];

      let taskElement = `
                <div class="card bg-light mt-2 text-dark">
                    <div class="card-header d-flex justify-content-between align-items-cente">
                        <span class="fw-bold">${taskTitle}</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox"/ ${taskDone && "checked"} data-id="${taskId}" onchange="App.toggleDone(this)">                    
                        </div>
                    </div>
                    <div class="card-body">
                        <span class="fw-normal">${taskDescription}</span>
                        <p class="text-dark fw-lighter">Task was created at: ${ new Date (taskCreated * 1000).toLocaleString()} </p>
                    </div>
                </div>
            `;

      html += taskElement;
    }

    document.querySelector("#taskList").innerHTML = html;
  },

  createTask: async (title, description) => {
    const result = await App.taskContract.createTask(title, description, {
      from: App.account,
    });
    console.log(result.logs[0].args);
  },

  toggleDone: async (element) => {
    const taskId = element.dataset.id

    await App.taskContract.toggleDone(taskId, {
        from: App.account
    })

    window.location.reload();
  }

};

App.init();
