const gradeModel = require('../models/TransactionModel.js');

let controller = {};

controller.create = async (req, res) => {
  console.log('acessado CREATE');
  try {
    const newGrade = req.body;
    newGrade.lastModified = new Date();
    const grade = new gradeModel(newGrade);
    await grade.save();
    res.send(grade);
    console.log(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    console.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

controller.findAll = async (req, res) => {
  const period = req.query.period;

  try {
    if (period) {
      //condicao para o filtro no findAll
      var condition = { yearMonth: period };
      const resposta = await gradeModel.find(condition);
      res.send(resposta);
      console.log(`GET /transaction`, period);
    } else {
      res.status(500).send({
        message:
          'Requisição incorreta, pois não foi informado o parâmetro period',
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    console.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

controller.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const resposta = await gradeModel.findOne({ _id: id });
    res.send(resposta);
    console.log(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    console.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

controller.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const grade = await gradeModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.send({ message: 'Grade atualizado com sucesso', grade: grade });

    console.log(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    console.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

controller.remove = async (req, res) => {
  const id = req.params.id;

  try {
    await gradeModel.findOneAndDelete({ _id: id });
    res.send({ message: 'Grade excluido com sucesso' });

    console.log(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    console.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

controller.removeAll = async (req, res) => {
  const id = req.params.id;

  try {
    await gradeModel.deleteMany({});
    res.send({
      message: `Grades excluidos`,
    });
    console.log(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    console.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

module.exports = controller;
