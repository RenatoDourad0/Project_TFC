import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User.model';

import { Response } from 'superagent';
import Team from '../database/models/Team.model';

chai.use(chaiHttp);

const { expect } = chai;

const teams = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  }
];


describe('Teste da rota /teams', () => {
  let chaiHttpResponse: Response;

  // beforeEach(async () => {
  //   sinon
  //     .stub(User, "findOne")
  //     .onFirstCall().resolves(user as User)
  //     .onCall(2).resolves(undefined)
  //     .onCall(3).resolves(undefined)
  // });

  // afterEach(()=>{
  // })

  it('se retorna uma lista de teams no endpoint GET - /teams', async () => {
    sinon
    .stub(Team, "findAll")
    .resolves(teams as Team[])

    chaiHttpResponse = await chai
        .request(app)
        .get('/teams')
    
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body[0]).to.haveOwnProperty('id');
    expect(chaiHttpResponse.body[0]).to.haveOwnProperty('teamName');

    (Team.findAll as sinon.SinonStub).restore();
  });

  it('se retorna o team especificado no endpoint GET - /teams/:id', async () => {
    sinon
    .stub(Team, "findByPk")
    .onFirstCall().resolves(teams[0] as Team)

    chaiHttpResponse = await chai
        .request(app)
        .get('/teams/1')
        
    expect(chaiHttpResponse.status).to.be.equals(200);
    expect(chaiHttpResponse.body).to.have.property('id');
    expect(chaiHttpResponse.body).to.have.property('teamName');

    (Team.findByPk as sinon.SinonStub).restore();
  });
});