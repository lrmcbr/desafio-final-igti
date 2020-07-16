import React, { useState, useEffect } from 'react';
import Transaction from './components/Transaction.js';
import TransactionDataService from './services/TransactionService';
import { Cursor } from 'mongodb';
import ReactModal from 'react-modal';

export default function App() {
  const hoje = new Date();
  const periodoAtual =
    hoje.getFullYear() + '-' + ('0' + (hoje.getMonth() + 1)).substr(-2, 2);
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState(periodoAtual);
  const [transactionNotFiltered, setTransactionNotFiltered] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [janelaData, setJanelaData] = useState(false);

  const getTransactions = (periodo) => {
    console.log('get transactions', periodo, filtro);
    if (!periodo) {
      periodo = period;
    }
    TransactionDataService.getAll({ period: periodo })
      .then((response) => {
        setTransactions(response.data);
        setTransactionNotFiltered(response.data);
        aplicaFiltro(filtro, response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPreviousMonth = () => {
    let periodo = period.split('-');
    let mes = Number(periodo[1]) - 1;
    let ano = Number(periodo[0]);
    if (mes <= 0) {
      mes = 12;
      ano -= 1;
    }
    periodo = ano + '-' + ('0' + mes).substr(-2, 2);
    setPeriod(periodo);
    getTransactions(periodo);
  };

  const getNextMonth = () => {
    let periodo = period.split('-');
    let mes = Number(periodo[1]) + 1;
    let ano = Number(periodo[0]);
    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
    periodo = ano + '-' + ('0' + mes).substr(-2, 2);

    setPeriod(periodo);
    getTransactions(periodo);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const toMoney = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
      .format(value)
      .toString();

  const getReceitas = (array) =>
    array.reduce((acc, cur) => {
      if (cur.type === '+') {
        return acc + cur.value;
      }
      return acc;
    }, 0);

  const getDespesas = (array) =>
    array.reduce((acc, cur) => {
      if (cur.type === '-') {
        return acc + cur.value;
      }
      return acc;
    }, 0);

  const handleChangeFilter = (event) => {
    let filtroLocal = event.target.value;
    setFiltro(filtroLocal);
    aplicaFiltro(filtroLocal);
  };

  const aplicaFiltro = (filtroLocal, data) => {
    console.log('Aplicar ', filtroLocal);
    let newTransactions = false;
    if (data)
      newTransactions = data.filter((item) => {
        return item.description.includes(filtroLocal);
      });
    else
      newTransactions = transactionNotFiltered.filter((item) => {
        return item.description.includes(filtroLocal);
      });
    console.log(newTransactions);
    setTransactions(newTransactions);
  };

  const handleEdit = (id) => {
    console.log('handle edit', id);
    const janela = { titulo: 'Edição de Lançamento', edit: true, id: id };
    janela.transaction = getTransaction(id);
    setJanelaData(janela);

    setOpenModal(true);
  };

  const handleNew = () => {
    const janela = { titulo: 'Inclusão de Lançamento', edit: false };
    setJanelaData(janela);
    setOpenModal(true);
  };

  const closeModal = () => {
    console.log('close modal');
    setOpenModal(false);
  };

  const handleSave = () => {
    const dadosForm = getDadosForm();
    if (janelaData.edit) {
      console.log('Salvando', janelaData.id);
      dadosForm._id = janelaData.id;
      TransactionDataService.update(janelaData.id, dadosForm)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log('Salvando novo');
      TransactionDataService.create(dadosForm)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    closeModal();
    getTransactions(period);
  };

  const handleDelete = (id) => {
    console.log('handle delete', id);
    TransactionDataService.remove(id)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
    getTransactions(period);
  };

  const getDadosForm = () => {
    const dadosForm = {};
    dadosForm.type = document.querySelector(
      'input[name="formType"]:checked'
    ).value;
    dadosForm.description = document.getElementById('formDescricao').value;
    dadosForm.category = document.getElementById('formCategoria').value;
    dadosForm.value = document.getElementById('formValue').value;
    let dataCompleta = document.getElementById('formDate').value;

    let dataArray = dataCompleta.split('-');
    dadosForm.year = dataArray[0];
    dadosForm.month = dataArray[1];
    dadosForm.day = dataArray[2];
    dadosForm.yearMonth = dataArray[0] + '-' + dataArray[1];
    dadosForm.yearMonthDay = dataCompleta;
    return dadosForm;
  };

  const setDadosForm = () => {
    const dados = janelaData;
    if (dados && dados.transaction) {
      const {
        value,
        description,
        yearMonthDay,
        category,
        type,
      } = dados.transaction;
      document.getElementById('formValue').value = value;
      document.getElementById('formDescricao').value = description;
      document.getElementById('formDate').value = yearMonthDay;
      document.getElementById('formCategoria').value = category;
      if (type === '+') {
        document.getElementById('formReceita').checked = true;
      } else {
        document.getElementById('formDespesa').checked = true;
      }
      document.getElementById('formReceita').disabled = true;
      document.getElementById('formDespesa').disabled = true;
    } else {
      document.getElementById('formReceita').disabled = false;
      document.getElementById('formDespesa').disabled = false;
    }
  };

  const getTransaction = (id) => transactions.find((item) => item._id === id);

  return (
    <div className="container">
      <h3 className="center-align">Bootcamp Fullstack - Desafio Final</h3>
      <h4 className="center-align">Controle Financeiro Pessoal</h4>
      <br />
      <div className="row">
        <div className="col s5 right-align">
          <button
            class="waves-effect waves-light btn-small"
            onClick={getPreviousMonth}
          >
            &lt;
          </button>
        </div>
        <div className="col s2 center-align">
          <input
            type="text"
            className="centered-input"
            disabled
            value={period}
          />
        </div>
        <div className="col s5 left-align">
          <button
            class="waves-effect waves-light btn-small"
            onClick={getNextMonth}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="card-panel row">
        <div className="col s3">
          <b>Lançamentos:</b> {transactions.length}
        </div>
        <div className="col s3">
          <b>Receitas:</b> {toMoney(getReceitas(transactions))}
        </div>
        <div className="col s3">
          <b>Despesas:</b> {toMoney(getDespesas(transactions))}
        </div>
        <div className="col s3">
          <b>Saldo:</b>
          {toMoney(getReceitas(transactions) - getDespesas(transactions))}
        </div>
      </div>
      <div className="section row">
        <div className="col s3">
          <button
            className="waves-effect waves-light btn-small"
            onClick={handleNew}
          >
            NOVO LANÇAMENTO
          </button>
        </div>
        <div className="col s9" onChange={handleChangeFilter}>
          <input type="text" id="filtro" />
        </div>
      </div>
      <div className="row">
        {transactions.map((transaction) => {
          return (
            <Transaction
              key={transaction._id}
              transaction={transaction}
              editFunction={handleEdit}
              deleteFunction={handleDelete}
            />
          );
        })}
      </div>
      <ReactModal
        isOpen={openModal}
        contentLabel={janelaData.titulo}
        parentSelector={() => document.body}
        onAfterOpen={setDadosForm}
      >
        <div className="container">
          <div>
            <div className="row">
              <div className="col s9 valign-wrapper">
                <h3>{janelaData.titulo}</h3>
              </div>
              <div className="col s3 right-align">
                <button
                  className="waves-effect waves-light red lighthen-1 btn-small"
                  onClick={closeModal}
                >
                  X
                </button>
              </div>
            </div>
            <div className="row">
              <p className="col s6">
                <label>
                  <input
                    name="formType"
                    type="radio"
                    value="-"
                    id="formDespesa"
                  />
                  <span>Despesa</span>
                </label>
              </p>
              <p className="col s6">
                <label>
                  <input
                    name="formType"
                    type="radio"
                    value="+"
                    id="formReceita"
                  />
                  <span>Receita</span>
                </label>
              </p>
            </div>
            <div>
              <label>
                <span>Descrição</span>
                <input type="text" id="formDescricao" />
              </label>
            </div>
            <div>
              <label>
                <span>Categoria</span>
                <input type="text" id="formCategoria" />
              </label>
            </div>
            <div className="row">
              <div className="col s6">
                <label>
                  <span>Valor</span>
                  <input type="number" step="0.01" id="formValue" />
                </label>
              </div>
              <div className="col s6">
                <input type="date" id="formDate" />
              </div>
            </div>
          </div>
          <div>
            <button
              className="waves-effect waves-light btn-small"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
