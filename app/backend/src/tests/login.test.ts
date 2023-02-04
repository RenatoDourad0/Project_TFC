import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User.model';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const user = {
  dataValues: {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
  }
};

describe('Teste da rota /login', () => {
  let chaiHttpResponse: Response;

  // beforeEach(async () => {
  //   sinon
  //     .stub(User, "findOne")
  //     .onFirstCall().resolves(user as User)
  //     .onCall(2).resolves(undefined)
  //     .onCall(3).resolves(undefined)
  // });

  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('se retorna um token para um acesso válido', async () => {
    sinon
    .stub(User, "findOne")
    .onFirstCall().resolves(user as User)

    chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin'
        })
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.have.property('token');
    
  });

  it('se retorna mensagem de erro para um acesso sem email/senha', async () => {
    sinon
    .stub(User, "findOne")
    .onFirstCall().resolves(undefined)

    chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: '',
          password: 'secret_admin'
        })

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).not.to.have.property('token');
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled')
  });

  it('se retorna mensagem de erro para um acesso com usuário não encontrado', async () => {
    sinon
    .stub(User, "findOne")
    .onFirstCall().resolves(undefined)

    chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          'email': 'test@fake.com',
          'password': 'secret_admin'
        })
    
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).not.to.have.property('token');
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password')
  });
});

describe('Teste da rota /Login/validate',() => {
  let chaiHttpResponse: Response;
  let token: string;

  beforeEach(async () => {
    const tokenReturn = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'secret_admin'
      });
    token = tokenReturn.body.token;
  })

  // beforeEach(async () => {
  //   sinon
  //     .stub(User, "findByPk")
  //     .onFirstCall().resolves(user as User)
  //     .onSecondCall().resolves(null)
  //     .onThirdCall().resolves(null);
  // });

  afterEach(()=>{
    (User.findByPk as sinon.SinonStub).restore();
  })

  it('se retorna um role para uma solicitação válida', async () => {
    const validTokenReturn = await chai
    .request(app)
    .post('/login')
    .send({
      email: 'admin@admin.com',
      password: 'secret_admin'
    });
    const validToken = validTokenReturn.body.token;
    
    sinon
    .stub(User, "findByPk")
    .onFirstCall().resolves(user as User)

    chaiHttpResponse = await chai
        .request(app)
        .get('/login/validate')
        .set('Authorization', validToken)

    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.have.property('role');
    expect(chaiHttpResponse.body.role).to.be.equal('admin');
  });

  it('se retorna mensagem de erro para uma solicitação com token inválido', async () => {
    sinon
    .stub(User, "findByPk")
    .onFirstCall().resolves(null)

    chaiHttpResponse = await chai
        .request(app)
        .get('/login/validate')
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5HCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvCGUiOiJhZG1pbiIsImRiTWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY3NTM2OTczNCwiZXhwIjoxNjc1OTc0NTM0fQ.ecR4h43KCkAQpfemEgnOIHavMf2ZCyvuCKph0MctcUI')
    
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).not.to.have.property('role');
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password')
  });

  it('se retorna mensagem de erro para uma solicitação sem token', async () => {
    sinon
    .stub(User, "findByPk")
    .onFirstCall().resolves(null)

    chaiHttpResponse = await chai
        .request(app)
        .get('/login/validate');

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).not.to.have.property('role');
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled')
  });
});