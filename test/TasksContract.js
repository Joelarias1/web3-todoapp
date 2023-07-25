const taskContract = artifacts.require("taskContract");

contract("taskContract", () => {
    before(async () =>{
        this.taskContract = await taskContract.deployed()
    })


    it('migrate deployed successfully', async () =>{
        const address = this.taskContract.address
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('get Tasks list', async () => {
        const taskCounter = await this.taskContract.taskCounter()
        const task = await this.taskContract.tasks(taskCounter)

        assert.equal(task.id.toNumber(), taskCounter)
    })

    it('task toggle done', async () =>{
        const result = await this.taskContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.taskContract.task(1);

        assert.equal(task.done, true);
        assert.equal(taskEvent.id, 1);
        assert.equal(taskEvent.done, true);



    })

})