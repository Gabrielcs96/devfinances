const Modal = {
    open() {
        //abrir modal 
        //adicionar a classe modal Active ao modal 
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
        //Fechar o modal
        //removendo a classe active no modal 
    }

}

const Storage ={
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

    }
}

const transactions = [{

    description: 'luz',
    amount: -50000,
    date: '23/01/2021'
},
{

    description: 'Criação de WebSite',
    amount: 500000,
    date: '23/01/2021'
},

{

    description: 'Internet',
    amount: -20000,
    date: '23/01/2021'
},
{

    id: 4,
    description: 'Só um teste',
    amount: 200000,
    date: '14/11/2021'


}




]
const Transaction = {
    all: Storage.get(),


    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas as transações
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income = income + transaction.amount;
            }
        })
        // verifico se é maior que zero 
        //-- soma de entradas e retornar uma variavel 
        return income;
    },
    expenses() {
        let expense = 0;
        // Adição e subtração de valores( saídas)
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },
    total() {

        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction,index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="data">${transaction.date}</td>
        <td>
          <img onclick= "Transaction.remove(${index}) " src="./assets/minus.svg" alt="Imagem de saída de dinheiro">
        </td>
        `
        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""

    }

}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"

        })
        return (signal + value)
    },
    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value)
    },
    formateDate(date){
        const splitedDate= date.split("-")
        return `${splitedDate[2]}/ ${splitedDate[1]} / ${splitedDate[0]} `
    }
}




const App = {
    init() {
        Transaction.all.forEach(function (transaction,index) {
            DOM.addTransaction(transaction,index)
        })
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    validateFields() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preenhca todos os campos")
        }
    },
    formateValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formateDate(date)

        
        return{
            description,
            amount,
            date
        }
        
    },
    saveTransaction(transaction){
        Transaction.add(transaction) // Usando a função que desenvolvemos lá em cima para adicionar transações 
    },
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    closeModal(){
        Modal.close()
    },
    reload(){
        App.reload()
    },
  

    submit(event) {

        event.preventDefault()

        try {
            // Vamos verificar se todas as informações foram preenchidas
            Form.validateFields()
          

            // formtar os dados  para salvar 
           const transaction = Form.formateValues()
            // salvar 
            Form.saveTransaction(transaction)

            // apagar os dados que obtivemos a partir do formulário 
            Form.clearFields()
            //fechar o  modal !
            Form.closeModal()
            //atualizar aplicação     
            // Form.reload() - Já temos um reload noadd 
        } catch (error) {
            alert(error.message)
        }

    }
}



App.init()


